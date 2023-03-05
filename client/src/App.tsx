import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { setContext } from "@apollo/client/link/context";
import { Container } from "semantic-ui-react";
import MenuItem from "./components/MenuItem";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import "./App.css";
import Single from "./Pages/Single";

function App() {
  const httpLink = createHttpLink({
    uri: "http://localhost:3002/graphql",
  });

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  const token = localStorage.getItem("token");
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Container>
          <MenuItem />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={token ? <Navigate to=".." /> : <Login />}
            />
            <Route
              path="/register"
              element={token ? <Navigate to="../" /> : <Register />}
            />
            <Route
              path="/post/:postId"
              element={<Single />}
            />
          </Routes>
        </Container>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
