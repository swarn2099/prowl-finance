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
    getUserAccountsInfo {
      account_id
      uuid
      available
      current
      iso_currency_code
      limit
      unofficial_currency_code
      mask
      name
      official_name
      persistent_account_id
      subtype
      type
      institution_id
      institution_name
      last_payment_amount
      last_payment_date
      last_statement_balance
      last_statement_issue_date
      minimum_payment_amount
      next_payment_due_date
    }
  }
`;

export const getLinkToken = gql`
  query GetLinkToken {
    getLinkToken
  }
`;

export const sendPlaidPublicToken = gql`
  mutation SendPlaidDetails($public_access_token: String!) {
    sendPlaidDetails(public_access_token: $public_access_token)
  }
`;
