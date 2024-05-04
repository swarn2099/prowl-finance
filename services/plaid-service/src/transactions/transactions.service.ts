import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  PlaidAccount,
  PlaidUser,
  Transaction,
  TransactionCategory,
} from '@prowl/db-entities';
import { PlaidService } from '../plaid.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(PlaidUser)
    private plaidUserRepository: Repository<PlaidUser>,

    @InjectRepository(PlaidAccount, 'user-db-connection')
    private userRepository: Repository<PlaidAccount>,

    @InjectRepository(Transaction, 'transaction-db-connection')
    private transactionRepository: Repository<Transaction>,

    @InjectRepository(TransactionCategory, 'transaction-db-connection')
    private transactionCategoriesRepository: Repository<TransactionCategory>,

    private readonly plaidService: PlaidService,
    private readonly configService: ConfigService
  ) {}

  async getTransactions() {
    const uuid = '18f372ff-8b5e-45d1-a572-b30377a98842';
    const plaidAccessToken = await this.getPlaidAccessToken(uuid);
    let nextCursor = null;
    let hasMore = false;

    do {
      const {
        accounts,
        added,
        modified,
        removed,
        has_more,
        next_cursor,
        ...response
      } = await this.syncPlaidTransactions(plaidAccessToken, nextCursor);

      // Handle missing accounts
      const missingAccounts = await this.getMissingAccounts(accounts);
      if (missingAccounts.length > 0) {
        await this.saveMissingAccounts(missingAccounts, uuid);
      }

      // Next, handle transactions
      await this.processAddedTransactions(added, uuid, 'added');
      await this.processModifiedTransactions(modified, uuid, 'modified');
      await this.processRemovedTransactions(removed, 'removed');

      nextCursor = next_cursor;
      hasMore = has_more;

      if (!has_more) {
        await this.updatePlaidUserNextCursor(uuid, nextCursor);
      }
    } while (hasMore);

    return { response: 'success' };
  }

  private async getPlaidAccessToken(uuid: string): Promise<string> {
    const { plaidAccessToken }: PlaidUser =
      await this.plaidUserRepository.findOneBy({ uuid });
    return plaidAccessToken;
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
    await this.plaidUserRepository.update(
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

  private async processAddedTransactions(
    transactions: any[],
    uuid: string,
    status: string
  ) {
    for (const transaction of transactions) {
      const existingTransaction = await this.transactionRepository.findOneBy({
        transaction_id: transaction.transaction_id,
      });
      if (!existingTransaction) {
        const newTransaction = this.mapTransactionData(
          transaction,
          uuid,
          status
        );
        await this.transactionRepository.save(newTransaction);
        await this.saveTransactionCategories(
          transaction.category,
          newTransaction,
          status
        );
      }
    }
  }

  private async processModifiedTransactions(
    transactions: any[],
    uuid: string,
    status: string
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
        await this.transactionRepository.save({
          ...existingTransaction,
          ...updatedTransaction,
        });
        await this.saveTransactionCategories(
          transaction.category,
          updatedTransaction,
          status
        );
      }
    }
  }

  private async processRemovedTransactions(
    transactions: any[],
    status: string
  ) {
    const transactionIds = transactions.map((t) => t.transaction_id);
    const updatePayload = {
      status: status,
      lastModified: new Date(),
    };

    // Update transactions
    await this.transactionRepository.update(
      { transaction_id: In(transactionIds) },
      updatePayload
    );

    // Update transaction categories
    await this.transactionCategoriesRepository.update(
      { transaction: In(transactionIds) },
      updatePayload
    );
  }

  private async saveTransactionCategories(
    categories: string[],
    transaction: Transaction,
    status: string
  ) {
    // Delete existing categories
    await this.transactionCategoriesRepository.delete({ transaction });

    // Save new categories
    const newCategories = categories.map((category) => ({
      transaction: transaction,
      category: category,
      status: status,
      lastModified: new Date(),
    }));
    await this.transactionCategoriesRepository.save(newCategories);
  }

  private mapTransactionData(
    transaction: any,
    uuid: string,
    status: string
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
    } as unknown as Transaction;
  }
}
