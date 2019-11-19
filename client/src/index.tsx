import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks'
import App from './App'

// import { gql } from 'apollo-boost'
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})

// client.query({
//   query: gql`
//     query{
//       getCategories{
//         id,
//         name
//       }
//     }
//   `
// }).then(result => console.log(result))

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
