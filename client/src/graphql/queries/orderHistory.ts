import { gql } from "@apollo/client";


export default gql`
    query Orders {
  orders {
    shoe {
      id
      model
      store {
        id
        name
      }
    }
    quantitySold
    dateSold
  }
}
`