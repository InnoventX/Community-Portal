import React,{useState} from 'react';
import logo from '../logo.png';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

function PortalNavbar(){

    const [search,setSearch] = useState("");

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
                            <a className="nav-link" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">About</a>
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
                            <button className="ask-div">ASK</button>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#"><AccountCircleIcon style={{color:"#4CD9D9",fontSize:"2.3rem",marginLeft:"0"}} /></a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default PortalNavbar;