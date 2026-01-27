import { gql } from 'graphql-tag'; 

export const typeDefs = gql`
    type User {
        _id: ID!
        name: String!
        email: String!
        createdAt: String
        updatedAt: String
    }

    type Task {
        _id: ID!
        title: String!
        description: String
        user: ID!
        dueDate: String
        completed: Boolean
        createdAt: String
        updatedAt: String
    }
    
    type Query {
        tasks: [Task!]!
        task(id: ID!): Task
        users: [User!]!
        user(id: ID!): User
    }

    type Mutation {
        createTask(title: String!, description: String, dueDate: String): Task!
        updateTask(id: ID!, title: String, description: String, dueDate: String, completed: Boolean): Task!
        deleteTask(id: ID!): Boolean!
        createUser(name: String!, email: String!, password: String!): User!
        updateUser(id: ID!, name: String, email: String): User!
        deleteUser(id: ID!): Boolean!
    }
`;