import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from "./components/Home";
import BookReview from "./components/BookReview";
import './App.css'
import Login from "./components/Login"
import Register from "./components/Register"
import Nav from "./components/Nav";

export default function App() {
  const [auth, setAuth] = useState(sessionStorage.getItem("auth_user"));

  const authProps = {
    auth: auth,
    setAuth: setAuth
  }

  return (
    <Router>
      <div>
      <Nav auth={authProps} />
        <Switch>
          <Route path="/" exact render={(props) => <Home {...props} auth={authProps} />} />
          <Route path="/Login" exact render={(props) => <Login {...props} auth={authProps} />} />
          <Route path="/Register" exact render={(props) => <Register {...props} auth={authProps} />} />
          <Route path="/Review/:id" exact render={(props) => <BookReview {...props} auth={authProps} />} />
        </Switch>
      </div>
    </Router>
  );
}