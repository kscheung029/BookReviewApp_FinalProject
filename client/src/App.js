import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from "./components/Home";
import BookReview from "./components/BookReview";
import './App.css'
import Nav from "./components/Nav";

export default function App() {
  return (
    <Router>
      <Nav />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/Review/:id" exact component={BookReview} />
        </Switch>
    </Router>
  );
}