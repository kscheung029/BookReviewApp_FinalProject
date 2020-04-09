import React from 'react';
import { Modal } from 'reactstrap';

const BASE_URL = "https://BookReviewAPI.azurewebsites.net/api/";

const Register = (props) => {
  const signup = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const rePassword = e.target.rePassword.value;

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
      .then(response => response.json())
      .then(json => {
        if (json.status === 200) {
          alert("Sign up successfully!");
          props.toggleLogin();
          props.toggleRegister();
        } else {
          alert(json.errors);
        }
      })
      .catch(error => {
        alert(error);
      });

  }

  return (
    <Modal isOpen={props.isOpen} toggle={props.toggleRegister}>
      <div className='modal-header d-flex justify-content-center'>
        <h5 className='modal-title text-center'>
          Register
        </h5>
        <button
          aria-label='Close'
          className='close'
          type='button'
          onClick={props.toggleRegister}
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
          <div className="form-group">
            <input type="password" id="rePassword" placeholder="Re-type Password" required/>
          </div>
          <div className="form-group d-flex justify-content-center">
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
        </form>
      </div>
      <div className="modal-footer d-flex justify-content-center">
        Have an account already?
        <button className="btn btn-primary btn-sm" onClick={() => { props.toggleRegister(); props.toggleLogin(); }}>Login</button>
      </div>
    </Modal>
  );
}

export default Register;