import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaidAccount, PlaidItem } from '@prowl/db-entities';
import { PlaidService } from '../plaid.service';

@Injectable()
export class LiabilitiesService {
  constructor(
    @InjectRepository(PlaidItem)
    private plaidItemRepository: Repository<PlaidItem>,

    @InjectRepository(PlaidAccount, 'user-db-connection')
    private userRepository: Repository<PlaidAccount>,

    private readonly plaidService: PlaidService
  ) {}

  async getLiabilities(payload: any) {
    console.log('Received webhook from Liabilities Plaid:', payload);
    const { item_id } = payload;

    // first look up item id and return access token from database

    const { access_token } = await this.plaidItemRepository.findOne({
      where: { item_id: item_id },
    });

    console.log('Exchanged for access_token: ', access_token);

    // get liabilities from plaid
    const plaidClient = this.plaidService.getClient();

    const liabilitiesResponse = await plaidClient.liabilitiesGet({
      access_token,
    });
    console.log('liabilitiesResponse', liabilitiesResponse.data);
    const creditArr = liabilitiesResponse.data.liabilities.credit;
    console.log('creditArr', creditArr);

    // find the user associated with the account_id from the creditArr and update the columns
    for (let i = 0; i < creditArr.length; i++) {
      const creditCard = creditArr[i];

      const user = await this.userRepository.findOne({
        where: { account_id: creditCard.account_id },
      });

      if (user) {
        Object.assign(user, {
          last_payment_amount: creditCard.last_payment_amount,
          last_payment_date: creditCard.last_payment_date,
          last_statement_balance: creditCard.last_statement_balance,
          last_statement_issue_date: creditCard.last_statement_issue_date,
          minimum_payment_amount: creditCard.minimum_payment_amount,
          next_payment_due_date: creditCard.next_payment_due_date,
        });

        await this.userRepository.save(user);
      }
    }
  }
}
