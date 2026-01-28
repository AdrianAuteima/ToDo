import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";

// Link para agregar el token a cada request
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token");
  operation.setContext({
    headers: {
        ...Headers,
        Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return forward(operation);
});

const httpLink = new HttpLink({
    uri: "http://localhost:3001/graphql"
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default client;