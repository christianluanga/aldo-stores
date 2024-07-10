import { gql } from "@apollo/client";


export default gql`
    query Orders {
  orders {
    shoe {
      id
      guid
      model
      store {
        id
        guid
        name
      }
    }
    quantitySold
    dateSold
  }
}
`