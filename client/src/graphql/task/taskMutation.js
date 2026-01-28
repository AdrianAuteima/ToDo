import { gql } from "@apollo/client";

export const CREATE_TASK_MUTATION = gql`
    mutation CreateTask($title: String!, $description: String, $dueDate: String){
        createTask(title: $title, description: $description, dueDate: $dueDate){           
            _id
            title
            description
            user {
                _id
            }
            dueDate
            completed
            createdAt
            updatedAt           
        }
    }
`;

export const UPDATE_TASK_MUTATION = gql`
    mutation UpdateTask($id: ID!, $title: String, $description: String, $dueDate: String, $completed: Boolean){
        updateTask(id: $id, title: $title, description: $description, dueDate: $dueDate, completed: $completed){
            _id
            title
            description
            user{
                _id
            }
            dueDate
            completed
            createdAt
            updatedAt
        }
    }

`;

export const DELETE_TASK_MUTATION = gql`
    mutation DeleteTask($id: ID!){
        deleteTask(id: $id)
    }

`;

export const COMPLETE_TASK_MUTATION = gql`
    mutation CompleteTask($id: ID!){
        completeTask(id: $id){
            _id
            title
            description
            user{
                _id
            }
            dueDate
            completed
            createdAt
            updatedAt
        }
    }
`;