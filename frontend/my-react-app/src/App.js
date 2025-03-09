import './App.css';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"
import UserRegister from './pages/UserRegister'
import Home from './pages/Home'

function App() {
  return (
    <div className="App">
      <Router>
        <Link to={"/"}>Home</Link>
        <Link to={"/register"}>Register</Link>
        <Routes>
          <Route path='/' exact Component={Home}></Route>
          <Route path= "/register" exact Component={UserRegister} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
