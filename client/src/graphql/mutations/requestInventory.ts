import { gql } from "@apollo/client";


export default gql`
    mutation RequestShoeInventory($details: RequestShoeInventoryInput) {
  updatedShoes:requestShoeInventory(details: $details) {
    fromShoe {
      id
      inventory
      updatedAt
      store {
        id
        name
      }
    }
    toShoe {
      id
      updatedAt
      inventory
      store {
        id
        name
      }
    }
  }
}
`