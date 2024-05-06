import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import {
  PlaidAccount,
  PlaidItem,
  Transaction,
  TransactionCategory,
} from '@prowl/db-entities';
import { PlaidService } from '../plaid.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(PlaidItem)
    private plaidItemRepository: Repository<PlaidItem>,

    @InjectRepository(PlaidAccount, 'user-db-connection')
    private userRepository: Repository<PlaidAccount>,

    @InjectRepository(Transaction, 'transaction-db-connection')
    private transactionRepository: Repository<Transaction>,

    @InjectRepository(TransactionCategory, 'transaction-db-connection')
    private transactionCategoriesRepository: Repository<TransactionCategory>,

    private readonly plaidService: PlaidService,
    private readonly configService: ConfigService
  ) {}
  /**
   * Main method to process webhook payload from Plaid and sync transactions.
   */
  async getTransactions(payload) {
    const { webhook_type, webhook_code, item_id } = payload;
    const { uuid, access_token, transactionPageKey } =
      await this.getPlaidAccessToken(item_id);

    let nextCursor = transactionPageKey;
    let hasMore = false;

    do {
      const { accounts, added, modified, removed, has_more, next_cursor } =
        await this.syncPlaidTransactions(access_token, nextCursor);

      if (accounts.length > 0) {
        await this.processAccounts(accounts, uuid);
      }

      await this.transactionRepository.manager.transaction(
        async (transactionalEntityManager) => {
          await this.processAddedTransactions(
            added,
            uuid,
            'added',
            transactionalEntityManager
          );
          await this.processModifiedTransactions(
            modified,
            uuid,
            'modified',
            transactionalEntityManager
          );
          await this.processRemovedTransactions(
            removed,
            'removed',
            transactionalEntityManager
          );
        }
      );

      nextCursor = next_cursor;
      hasMore = has_more;

      if (!has_more) {
        await this.updatePlaidUserNextCursor(uuid, nextCursor);
      }
    } while (hasMore);

    return { response: 'success' };
  }

  private async processAccounts(accounts: any[], uuid: string) {
    const missingAccounts = await this.getMissingAccounts(accounts);
    if (missingAccounts.length > 0) {
      await this.saveMissingAccounts(missingAccounts, uuid);
    }
  }

  /**
   * Process transactions that have been added on Plaid.
   */
  private async processAddedTransactions(
    transactions: any[],
    uuid: string,
    status: string,
    transactionalEntityManager: EntityManager
  ) {
    // Sort transactions by date to ensure correct sequence
    transactions.sort((a, b) => a.date.localeCompare(b.date));

    // This object will store the highest current index of transactions for each date
    const currentIndexForDate = {};

    for (const transaction of transactions) {
      const date = transaction.date;
      // Check if the current date is already processed
      if (!currentIndexForDate[date]) {
        // If not, retrieve the maximum index from the database and store it
        currentIndexForDate[date] =
          (await this.getMaxIndexOfTransactionForDate(
            date,
            transactionalEntityManager
          )) + 1;
      } else {
        // If already processed, increment the current index
        currentIndexForDate[date]++;
      }

      // Map the transaction data including the current index
      const newTransaction = this.mapTransactionData(
        transaction,
        uuid,
        status,
        currentIndexForDate[date]
      );

      // Use transaction manager to save the new transaction
      await transactionalEntityManager.save(Transaction, newTransaction);

      // Handle categories
      await this.saveTransactionCategories(
        transaction.category,
        newTransaction,
        status,
        transactionalEntityManager
      );
    }
  }

  private async getMaxIndexOfTransactionForDate(
    date: string,
    transactionalEntityManager: EntityManager
  ): Promise<number> {
    const result = await transactionalEntityManager
      .createQueryBuilder(Transaction, 'transaction')
      .select('MAX(transaction.indexofTransaction)', 'max')
      .where('transaction.date = :date', { date: date })
      .getRawOne();

    return result.max || 0; // Return 0 if no existing transactions are found for the date
  }

  /**
   * Process transactions that have been modified on Plaid.
   */
  private async processModifiedTransactions(
    transactions: any[],
    uuid: string,
    status: string,
    transactionalEntityManager: EntityManager
  ) {
    for (const transaction of transactions) {
      const existingTransaction = await this.transactionRepository.findOneBy({
        transaction_id: transaction.transaction_id,
      });
      if (existingTransaction) {
        const updatedTransaction = this.mapTransactionData(
          transaction,
          uuid,
          status
        );
        await transactionalEntityManager.save({
          ...existingTransaction,
          ...updatedTransaction,
        });
      }
    }
  }

  /**
   * Process transactions that have been removed on Plaid.
   */
  private async processRemovedTransactions(
    transactions: any[],
    status: string,
    transactionalEntityManager: EntityManager
  ) {
    const transactionIds = transactions.map((t) => t.transaction_id);
    await transactionalEntityManager.update(
      Transaction,
      { transaction_id: In(transactionIds) },
      { status: status, lastModified: new Date() }
    );
  }

  /**
   * Helper method to save categories of a transaction.
   */
  private async saveTransactionCategories(
    categories: string[],
    transaction: Transaction,
    status: string,
    transactionalEntityManager: EntityManager
  ) {
    await transactionalEntityManager.delete(TransactionCategory, {
      transaction,
    });
    const newCategories = categories.map((category) => ({
      transaction,
      category,
      status,
      lastModified: new Date(),
    }));
    await transactionalEntityManager.save(TransactionCategory, newCategories);
  }

  private async getPlaidAccessToken(item_id: string): Promise<PlaidItem> {
    const plaidItemUser: PlaidItem = await this.plaidItemRepository.findOneBy({
      item_id,
    });
    console.log('access_token:', plaidItemUser.access_token);
    return plaidItemUser;
  }

  private async syncPlaidTransactions(
    accessToken: string,
    cursor: string | null
  ): Promise<any> {
    const plaidClient = this.plaidService.getClient();
    try {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
        cursor: cursor,
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to sync Plaid transactions: ${error}`);
      throw error;
    }
  }

  private async updatePlaidUserNextCursor(uuid: string, nextCursor: string) {
    await this.plaidItemRepository.update(
      { uuid },
      { transactionPageKey: nextCursor }
    );
  }

  private async getMissingAccounts(accounts: any[]): Promise<any[]> {
    const accountIds = accounts.map((account) => account.account_id);
    const existingAccounts = await this.userRepository.find({
      where: { account_id: In(accountIds) },
    });
    const existingAccountIds = new Set(
      existingAccounts.map((account) => account.account_id)
    );
    return accounts.filter(
      (account) => !existingAccountIds.has(account.account_id)
    );
  }

  private async saveMissingAccounts(
    accounts: any[],
    uuid: string
  ): Promise<any> {
    const accountsWithUuid = accounts.map((account) => {
      const {
        available,
        current,
        iso_currency_code,
        limit,
        unofficial_currency_code,
      } = account.balances;
      return {
        account_id: account.account_id,
        uuid: uuid,
        available: available ?? null,
        current: current ?? null,
        iso_currency_code: iso_currency_code ?? null,
        limit: limit ?? null,
        unofficial_currency_code: unofficial_currency_code ?? null,
        mask: account.mask,
        name: account.name,
        official_name: account.official_name,
        persistent_account_id: account.persistent_account_id,
        subtype: account.subtype,
        type: account.type,
      };
    });

    return await this.userRepository.save(accountsWithUuid);
  }

  private mapTransactionData(
    transaction: any,
    uuid: string,
    status: string,
    indexofTransaction?: number
  ): Transaction {
    return {
      transaction_id: transaction.transaction_id,
      account_id: transaction.account_id,
      account_owner: transaction.account_owner,
      amount: transaction.amount,
      authorized_date: transaction.authorized_date,
      category_id: transaction.category_id,
      counterparties: transaction.counterparties,
      date: transaction.date,
      iso_currency_code: transaction.iso_currency_code,
      location: transaction.location,
      logo_url: transaction.logo_url,
      merchant_entity_id: transaction.merchant_entity_id,
      merchant_name: transaction.merchant_name,
      name: transaction.name,
      payment_channel: transaction.payment_channel,
      payment_meta: transaction.payment_meta,
      pending: transaction.pending,
      pending_transaction_id: transaction.pending_transaction_id,
      personal_finance_category: transaction.personal_finance_category,
      personal_finance_category_icon_url:
        transaction.personal_finance_category_icon_url,
      transaction_code: transaction.transaction_code,
      transaction_type: transaction.transaction_type,
      unofficial_currency_code: transaction.unofficial_currency_code,
      uuid: uuid,
      status: status,
      last_modified: new Date(),
      indexoftransaction: indexofTransaction,
    } as unknown as Transaction;
  }
}
