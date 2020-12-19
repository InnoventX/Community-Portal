import React,{useState,useContext} from 'react';
import {NavLink} from 'react-router-dom';

import logo from '../../photos/logo.png';
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
                <a className="navbar-brand" href="#"><img className="logo" src={logo} />InnoventX</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link" style={{color:"white"}}>Home</NavLink>
                        </li>

                        { !auth.isLogedIn && (  
                            <li className="nav-item">
                                <div className="portal-div">
                                    <NavLink to="/authenticate" className="nav-link"><p className="portal-link">Portal</p></NavLink>
                                </div>
                            </li>
                            )
                        }

                        { auth.isLogedIn && ( 
                            <React.Fragment>
                            <li className="nav-item">
                                <NavLink to={`/userid/question`} className="nav-link" style={{color:"white"}}>My Ques</NavLink>
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
                                <NavLink to="/question/new">
                                    <div className="ask-div">ASK</div>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/" className="nav-link"><AccountCircleIcon style={{color:"#4CD9D9",fontSize:"2.3rem",marginLeft:"0"}} /></NavLink>
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

