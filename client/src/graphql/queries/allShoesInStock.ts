import { gql } from "@apollo/client";

export default gql`
    query AllShoesInStock {
  shoes:allShoesInStock {
    id
    inventory
    model
    updatedAt
    store {
      name
      id
    }
  }
}
`