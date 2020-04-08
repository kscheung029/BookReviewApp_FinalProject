import React from 'react';

const Nav = (props) => {
    const logout = () => {
        sessionStorage.clear();
        props.auth.setAuth(null);
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-dark">
            <img src="book-reader-solid.svg" alt="" />
            <h3 className="navbar-brand ml-4 text-white">Need Review A Book?</h3>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item active">
                        <a className="nav-link text-white text-uppercase ml-3" href="/#">Home&nbsp;<i className="fas fa-home ml-1"></i><span className="sr-only">(current)</span></a>
                    </li>
                    {props.auth.auth ?
                        <li className="nav-item">
                            <button className="btn btn-warning" onClick={() => {logout()}}>Log out</button>
                        </li> :
                        <li className="nav-item">
                            <a className="nav-link text-white text-uppercase ml-4 mr-4" href="/login">Login/Register</a>
                        </li>}
                </ul>
            </div>
        </nav>
    );
}

export default Nav;