import gql from 'graphql-tag'
import { apolloClient } from '../../app'

const IDENTIFY_PERSON_BY_PHONE = gql`
    query ($phone: String!) {
        identifyPersonByPhone(phone: $phone) {
            idented
            hasPassword
            authKey
        }
    }
`

export default (context, phone) => apolloClient.query({
    query: IDENTIFY_PERSON_BY_PHONE,
    variables: {
        phone
    }
})
    .then(result => (result.data.identifyPersonByPhone))
    .catch(err => {console.log(err)})
