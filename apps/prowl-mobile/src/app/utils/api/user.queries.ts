import { gql } from '@apollo/client';

export const getUserWithTransactions = gql`
  query GetUserById {
    getUserById {
      uuid
      auth0ID
      email
      name
      transactions {
        transaction_id
        account_id
        account_owner
        amount
        authorized_date
        category_id
        date
        iso_currency_code
        location
        merchant_entity_id
        merchant_name
        name
        payment_channel
        payment_meta
        pending
        pending_transaction_id
        personal_finance_category
        personal_finance_category_icon_url
        logo_url
        transaction_code
        transaction_type
        unofficial_currency_code
        status
        lastModified
        categories {
          id
          category
          status
          lastModified
        }
      }
    }
  }
`;
