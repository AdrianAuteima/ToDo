import { gql } from '@apollo/client';


export const GET_TASKS_QUERY = gql`
    query Tasks{
        tasks {
            _id
            title
            description
            user {
                _id
                name
            }
            completed
            updatedAt
        }
    }
`;

export const GET_TASK_QUERY = gql`
    query Task($id: ID!){
        task(id: $id) {
            _id
            title
            description
            user {
                _id
                name
            }
            completed
            updatedAt
        }
    }
`;