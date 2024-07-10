import { gql } from '@apollo/client';

export default gql`
    query GetShoes($storeId: Int) {
    shoes(storeId: $storeId) {
        id
        guid
        model
        inventory
        store {
            id
            guid
            name
        }
    }
}
`