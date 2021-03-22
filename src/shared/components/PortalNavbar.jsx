import React,{useState,useContext} from 'react';
import {NavLink} from 'react-router-dom';

import ask from '../../photos/ask-add.svg';
import logo from '../../photos/logo.svg';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import "./PortalNavbar.css";
import {AuthContext} from '../../shared/context/AuthContext';

function PortalNavbar(){

    const [search,setSearch] = useState("");
    const auth = useContext(AuthContext);

    function handleSearch(event){
        const ipValue = event.target.value;
        setSearch(ipValue);
    }

    function handleClick(){
        alert("Search: " + search);
        setSearch("");
    }
 
    return(
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark">
            <a className="navbar-brand" href="#">
                <img className="logo" src={logo} alt="logo" />
                <span style={{color: "red"}}>I</span>NNOVENT<span style={{color: "red"}}>X</span>
            </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                    <ul className="nav nav-pills justify-content-right">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link" exact>Home</NavLink>
                        </li>

                        { !auth.isLogedIn && (  
                            <li className="nav-item">
                                <div className="portal-div">
                                    <NavLink to="/authenticate" className="nav-link PORTAL">Portal</NavLink>
                                </div>
                            </li>
                            )
                        }

                        { auth.isLogedIn && ( 
                            <React.Fragment>
                            <li className="nav-item">
                                <NavLink to={`/${auth.userId}/questions`} className="nav-link">My Ques</NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to={`/${auth.userId}/answers`} className="nav-link">My Ans</NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to={`/${auth.userId}/savedAnswers`} className="nav-link">Save</NavLink>
                            </li>

                            <li className="nav-item">
                                <form className="form-inline my-2 my-lg-0">
                                    <div className="button-in">
                                        <input  className="search" type="search" placeholder="Search" aria-label="Search" value={search} onChange={handleSearch}/>
                                        <button className="search-btn" onClick={handleClick}><SearchIcon style={{color:"white"}}/></button>
                                    </div>
                                </form>
                            </li>
                            
                            <li className="nav-item">
                                <NavLink to="/question/new" style={{textDecoration:"none"}} className="nav-link">
                                    <img className="ask-button" src={ask}></img>ASK
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/" className="PROFILE"><AccountCircleIcon style={{fontSize:"2.3rem",marginLeft:"2", marginTop:"8"}} /></NavLink>
                            </li>
                            </React.Fragment>
                            )
                        }
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default PortalNavbar;