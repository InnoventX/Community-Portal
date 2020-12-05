import logo from './logo.svg';
import './App.css';

import Navbar from './components/Navbar';
import SignIn from "./components/SignIn";
import PortalNavbar from './components/PortalNavbar';
import PortalHome from "./components/PortalHome";


function App() {
  return (
    <div className="App">
      <PortalNavbar />
      <PortalHome />
    </div>
  );
}

export default App;
