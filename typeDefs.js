import { gql } from "graphql-tag";

const typeDefs = gql`
    type User {
        _id: ID!
        name: String!
        email: String!
        createdAt: String
        updatedAt: String
    }

    type LoginResponse {
        token: String!
        user: User!
        errors: ValidationUserErrors
    }

    type UserResponse {
        token: String
        user: User
        errors: ValidationUserErrors
    }

    type ValidationUserErrors {
        name: String
        email: String
        password: String
    }

    type Task {
        _id: ID!
        title: String!
        description: String
        user: User
        dueDate: String
        completed: Boolean!
        createdAt: String
        updatedAt: String
    }
    
    type Query {
        tasks: [Task!]!
        task(id: ID!): Task
        user(id: ID!): User
    
    }

    type Mutation {
        createTask(title: String!, description: String, dueDate: String): Task!
        updateTask(id: ID!, title: String, description: String, dueDate: String, completed: Boolean): Task!
        deleteTask(id: ID!): Boolean!
        completeTask(id: ID!): Task!
        createUser(name: String!, email: String!, password: String!): UserResponse!
        login(email: String!, password: String!): LoginResponse!
    }
`;
export default typeDefs;