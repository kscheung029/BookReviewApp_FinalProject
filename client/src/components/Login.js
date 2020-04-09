import React from 'react';
import { Modal } from 'reactstrap';

const BASE_URL = "https://BookReviewAPI.azurewebsites.net/api/";

const Login = (props) => {
  const signup = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

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
      .then(json => {
        if (json.status === 200) {
          alert("Log in successfully!");
          sessionStorage.setItem("auth_user", json.token);
          sessionStorage.setItem("username", email);
          props.setAuth(sessionStorage.getItem("auth_user"));
          props.toggleLogin();
          window.location.reload();
        }
        else {
          alert(json.errors);
        }
      })
      .catch(error => {
        alert(error);
      });
  }

  return (
    <Modal isOpen={props.isOpen} toggle={props.toggleLogin}>
      <div className='modal-header d-flex justify-content-center'>
        <h5 className='modal-title text-center'>
          Log in
          </h5>
        <button
          aria-label='Close'
          className='close'
          type='button'
          onClick={props.toggleLogin}
        >
          <span aria-hidden={true}>X</span>
        </button>
      </div>
      <div className="modal-body d-flex justify-content-center">
          <form onSubmit={signup}>
            <div className="form-group">
              <input type="email" id="email" placeholder="E-mail" required/>
            </div>
            <div className="form-group">
              <input type="password" id="password" placeholder="Password" required/>
            </div>
            <div className="form-group d-flex justify-content-center">
              <button type="submit" className="btn btn-primary">Sign in</button>
            </div>
          </form>
      </div>
      <div className="modal-footer d-flex justify-content-center">
        Don't have an account?
        <button className="btn btn-primary btn-sm" onClick={() => { props.toggleRegister(); props.toggleLogin(); }}>Register</button>
      </div>
    </Modal>
  );
}

export default Login;