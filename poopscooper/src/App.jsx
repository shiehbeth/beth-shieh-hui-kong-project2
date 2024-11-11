import { useState } from 'react'
import { Link } from 'react-router-dom';
import poopYoshi from "./assets/pooping_yoshi.jpeg"
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "./NavBar"
import { Button } from 'react-bootstrap';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NavBar clasName="nav" fixed='top' expand='large'/>
      <div>
          <img src={poopYoshi} className="poopingYoshi" alt="Pooping dog" />
      </div>
      <h1>PoopScooper</h1>
      <p>Welcome to the PoopScooper game!</p>
      <p> Navigate to the rules page to learn how to play, or select a difficulty level to start playing!</p>
      <div className="difficulty-buttons">
        {/* Link to the game at different difficulty levels */}
        <Link to="/game/easy">
          <Button variant="success">Easy</Button>
        </Link>
        <Link to="/game/medium">
          <Button variant="warning">Medium</Button>
        </Link>
        <Link to="/game/hard">
          <Button variant="danger">Hard</Button>
        </Link>
      </div>
    </>
  )
}

export default App
