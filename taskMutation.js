import { gql } from "@apollo/client";

export const TASK_FIELDS_FRAGMENT = gql`
  fragment TaskFields on Task {
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
`;

export const CREATE_TASK_MUTATION = gql`
    mutation CreateTask($title: String!, $description: String, $dueDate: String){
        createTask(title: $title, description: $description, dueDate: $dueDate){           
            ...TaskFields    
        }
    }
    ${TASK_FIELDS_FRAGMENT}
`;

export const UPDATE_TASK_MUTATION = gql`
    mutation UpdateTask($id: ID!, $title: String, $description: String, $dueDate: String, $completed: Boolean){
        updateTask(id: $id, title: $title, description: $description, dueDate: $dueDate, completed: $completed){
            ...TaskFields
        }
    }
    ${TASK_FIELDS_FRAGMENT}
`;

export const DELETE_TASK_MUTATION = gql`
    mutation DeleteTask($id: ID!){
        deleteTask(id: $id)
    }

`;

export const COMPLETE_TASK_MUTATION = gql`
    mutation CompleteTask($id: ID!){
        completeTask(id: $id){
            ...TaskFields
        }
    }
    ${TASK_FIELDS_FRAGMENT}
`;