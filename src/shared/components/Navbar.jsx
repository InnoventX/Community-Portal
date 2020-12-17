import React from 'react';
import logo from '../../photos/logo.png';
import "./Navbar.css";

function Navbar(){
    return(
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark">
                <a className="navbar-brand" href="#"><img className="logo" src={logo} />InnoventX</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">About</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Services</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">TimeLine</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Contact</a>
                        </li>
                        <li className="nav-item">
                            <div className="portal-div">
                                <a className="nav-link" href="#"><p className="portal-link">Portal</p></a>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
  )
}

export default Navbar;