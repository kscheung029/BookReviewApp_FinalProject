import React from 'react';
import { Link } from 'react-router-dom';

const BASE_URL = "https://BookReviewAPI.azurewebsites.net/api/";

const Register = (props) => {
  const signup = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const rePassword = e.target.rePassword.value;

    if (email === "" || password === "") {
      alert("Username and password are required.");
      return;
    }

    if (password !== rePassword) {
      alert("Please confrim password.");
      return;
    }

    if (password.length < 8) {
      alert("Password has at least 8 characters.");
      return;
    }

    await fetch(BASE_URL + "Register", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "Email": email,
        "Password": password,
        "ConfirmPassword": rePassword
      })
    })
      .then(response => {
        if (response.status === 200) {
          alert("Sign up successfully!");
          props.history.push("/login");
        } else if (response.status === 204) {
          alert("Username has been used.");
        }
      });
  }

  return (
    <div>
      <h1 className="text-center mt-5">Book Review</h1>
      <div className="d-flex justify-content-center mt-5">
        <div className="border border-dark rounded bg-white">
          <form onSubmit={signup}>
            <h4 className="text-center">Register</h4>
            <div className="form-group d-flex justify-content-center">
              <input type="text" id="email" placeholder="E-mail" />
            </div>
            <div className="form-group d-flex justify-content-center">
              <input type="password" id="password" placeholder="Password" />
            </div>
            <div className="form-group d-flex justify-content-center">
              <input type="password" id="rePassword" placeholder="Re-type Password" />
            </div>
            <div className="form-group d-flex justify-content-center">
              <button type="submit" className="btn btn-primary btn-sm">Sign up</button>
            </div>
          </form>
          <p>Have an account already? Sign in <Link to="/login" className="text-decoration-none">here</Link>.</p>
        </div>
      </div>
    </div>
  );
}

export default Register;