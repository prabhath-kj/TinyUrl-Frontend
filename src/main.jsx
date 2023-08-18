import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import Redirect from './Redirect.jsx';
import { GQL_URL } from './constants.js';

const client = new ApolloClient({
  uri: GQL_URL,
  cache: new InMemoryCache(),
});

const router=createBrowserRouter([
  {
    path:"/",
    element:<App/>,
  },
  {
    path:"/:paramValue",
    element:<Redirect/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
   </ApolloProvider>
)
