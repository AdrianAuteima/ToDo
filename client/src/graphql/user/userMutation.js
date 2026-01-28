import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!){
        login(email: $email, password: $password) {
            token
            user {
                _id
                name
                email
            }
            errors {
                email
                password
            }
        }
    }
`;

export const REGISTER_MUTATION = gql`
    mutation CreateUser($name: String!, $email: String!, $password: String!){
        createUser(name: $name, email: $email, password: $password){
        token    
        user {
                _id
                name
                email
            }
            errors {
                name
                email
                password
            }
        }
    }

`;