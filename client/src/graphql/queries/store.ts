import { gql } from '@apollo/client';

export default gql`
  query GetStores {
    stores {
      id
      guid
      name
    }
  }
`;

