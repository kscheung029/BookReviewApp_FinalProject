import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from "./components/Home";
import BookReview from "./components/BookReview";
import './App.css'


export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/Review/:id" exact component={BookReview}/>
        </Switch>
      </div>
    </Router>
  );
}