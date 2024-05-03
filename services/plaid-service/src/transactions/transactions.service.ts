import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PlaidAccount, PlaidUser } from '@prowl/db-entities';
import { PlaidService } from '../plaid.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(PlaidUser)
    private plaidUserRepository: Repository<PlaidUser>,

    @InjectRepository(PlaidAccount, 'user-db-connection')
    private userRepository: Repository<PlaidAccount>,

    private readonly plaidService: PlaidService,
    private readonly configService: ConfigService
  ) {}

  async getTransactions() {
    const uuid = '18f372ff-8b5e-45d1-a572-b30377a98842';
    const plaidAccessToken = await this.getPlaidAccessToken(uuid);

    const { accounts } = await this.syncPlaidTransactions(plaidAccessToken);
    // const accounts = syncData.accounts;

    const missingAccounts = await this.getMissingAccounts(accounts);
    if (missingAccounts.length > 0) {
      await this.saveMissingAccounts(missingAccounts, uuid);
    }

    return missingAccounts; // or any other desired return value
  }

  private async getPlaidAccessToken(uuid: string): Promise<string> {
    const { plaidAccessToken }: PlaidUser =
      await this.plaidUserRepository.findOneBy({ uuid });
    return plaidAccessToken;
  }

  private async syncPlaidTransactions(accessToken: string): Promise<any> {
    const plaidClient = this.plaidService.getClient();
    try {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to sync Plaid transactions: ${error}`);
      throw error;
    }
  }

  private async getMissingAccounts(accounts: any[]): Promise<any[]> {
    const accountIds: any = accounts.map((account) => account.account_id);
    console.log('accountIds', accountIds);
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
  ): Promise<void> {
    // Map and flatten the balances data into the PlaidAccount structure
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
        available: available ?? null, // Ensure null if undefined
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

    await this.userRepository.save(accountsWithUuid);
  }
}
