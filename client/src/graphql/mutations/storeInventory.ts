import { gql } from '@apollo/client'

export default gql`
    mutation Mutation($details: ShoeSaleInput) {
    shoe:saleShoe(details: $details) {
        id
        guid
        model
        inventory
        store{
            id
            name
        }
    }
}
`