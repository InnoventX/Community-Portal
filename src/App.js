import logo from './logo.svg';
import './App.css';

import Navbar from './shared/components/Navbar';
import SignIn from "./user/components/SignIn";
import PortalNavbar from './shared/components/PortalNavbar';
import PortalHome from "./portal home/components/PortalHome";


function App() {
  return (
    <div className="App">
      <PortalNavbar />
      <PortalHome />
    </div>
  );
}

export default App;
