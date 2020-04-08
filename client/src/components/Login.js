import React from 'react';
import { Link } from 'react-router-dom';

const BASE_URL = "https://BookReviewAPI.azurewebsites.net/api/";

const Login = (props) => {
  const signup = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email === "" || password === "") {
      alert("Username and password are required");
      return;
    }

    await fetch(BASE_URL + "Login", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "Email": email,
        "Password": password
      })
    })
      .then(response => response.json())
      .then(json=>{
        if (json.status === 200) {
          sessionStorage.setItem("auth_user", json.token);
          props.auth.setAuth(sessionStorage.getItem("auth_user"));
          props.history.push(`/`);
        }
        else {
          alert(json.errors);
        }
      });
  }

  return (
    <div>
      <h1 className="text-center mt-5">Book Review</h1>
      <div className="d-flex justify-content-center mt-5">
        <div className="border border-dark rounded bg-white">
          <form onSubmit={signup}>
            <h4 className="text-center">Sign In</h4>
            <div className="form-group d-flex justify-content-center">
              <input type="text" id="email" placeholder="E-mail" />
            </div>
            <div className="form-group d-flex justify-content-center">
              <input type="password" id="password" placeholder="Password" />
            </div>
            <div className="form-group d-flex justify-content-center">
              <button type="submit" className="btn btn-primary btn-sm">Sign in</button>
            </div>
          </form>
          <p>Don't have an account? Register <Link to="/register" className="text-decoration-none">here</Link>.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;