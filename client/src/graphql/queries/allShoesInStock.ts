import { gql } from "@apollo/client";

export default gql`
    query AllShoesInStock {
  shoes:allShoesInStock {
    id
    guid
    inventory
    model
    updatedAt
    store {
      id
      guid
      name
    }
  }
}
`