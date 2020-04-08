import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Nav = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [auth, setAuth] = useState(sessionStorage.getItem("auth_user"));

  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen);
  }

  const toggleRegister = () => {
    setIsRegisterOpen(!isRegisterOpen);
  }

  const logout = () => {
    alert("Good bye!");
    sessionStorage.clear();
    setAuth(false);
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-dark sticky-top">
      <h3 className="navbar-brand text-white"><i className="fas fa-book"></i> Need Review A Book?</h3>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link text-white text-uppercase" href="/"><i className="fas fa-home"></i> Home<span className="sr-only">(current)</span></a>
          </li>
          {auth &&
            <li className="nav-item">
              <span className="nav-link text-white">Hello, {sessionStorage.getItem("username")}!</span>
            </li>
          }
          {auth ?
            <li className="nav-item">
              <button className="btn btn-warning ml-2" onClick={() => { logout() }}>Log out</button>
            </li> :
            <li className="nav-item">
              <button className="btn btn-warning ml-2" onClick={() => { setIsLoginOpen(true) }}>Login/Register</button>
              <Login isOpen={isLoginOpen} toggleLogin={toggleLogin} toggleRegister={toggleRegister} setAuth={setAuth} />
              <Register isOpen={isRegisterOpen} toggleLogin={toggleLogin} toggleRegister={toggleRegister} />
            </li>
          }
        </ul>
      </div>
    </nav>
  );
}

export default Nav;