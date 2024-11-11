import NavBar from './NavBar'
import './Rules.css'

function Rules() {
    return(
        <>
            <div>
                <NavBar />
            </div>
            <div className='rule-box'>
                <h1>Game Rules</h1>
                <p>
                In PoopScooper, your goal is to clear a yard without stepping in hidden dog poop.
                </p>
                <p>
                Each cell you click on will reveal a number indicating how many adjacent cells contain poop, helping you avoid those areas.
                </p>
                <p>
                If you uncover a cell with poop, the game ends, and all poop spots are revealed.
                </p>
                <p>
                Good luck dodging those messes!
                </p>
            </div>
        </>

    )

}

export default Rules
