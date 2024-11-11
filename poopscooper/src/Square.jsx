import { useState, useContext, useEffect } from 'react';
import './Square.css'
import { GameContext } from './GameContext';
import { RevealedContext } from './RevealedContext';

function Square(props) {
    const [revealed, setRevealed] = useState(false);
    const [flagged, setFlagged] = useState(false);
    const hasMine = props.hasMine;
    const safeNum = props.safeNum;
    const { x, y } = props;
    const {gameState, setGameState, totalSafeSquares, unsafeFirstClick, setUnsafeFirstClick} = useContext(GameContext);
    const [revealedCount, setRevealedCount, coordsToBeRemoved, setCoordsToBeRemoved, handleFirstSquareClick] = useContext(RevealedContext);

    // effect for handling game state
    useEffect(() => {
        if (gameState === 'game over' && hasMine) {
            setRevealed(true);
        }
    }, [gameState, hasMine]);

    // add flag
    function addFlag(e) {
        e.preventDefault();

        if (gameState !== 'ongoing' || revealed) return;

        const coords = `${x}-${y}`;

        setFlagged((prevFlagged) => !prevFlagged); // switch the state
    }

    // method for handling logic of clicking a square
    function clickedFn() {
        if (gameState !== 'ongoing' || revealed) return;

        // adding logic for safe first click
        if (revealedCount === 0 && hasMine) {
            setUnsafeFirstClick(true);
            let newCoords = [x, y]
            setCoordsToBeRemoved(newCoords)
            handleFirstSquareClick(x, y);
            return;
        }

        setRevealed(true);

        if (hasMine) {
            setGameState('game over');
        } else {
            let newRevealedCount = revealedCount + 1;
            setRevealedCount(newRevealedCount);

            if (newRevealedCount === totalSafeSquares) {
                setGameState('won');
            }
        }
    }

    let coveredClassName = 'square';
    let content = '';

    // updating the class based on type (safe vs mine)
    if (revealed) {
        if (hasMine){
            coveredClassName = 'poop';
            content = '💩';

        }
        else {
            coveredClassName = 'revealed';
            content = safeNum;
        }
    } else if (flagged) {
        coveredClassName = 'flagged';
        content = '🚩';
    }


  return (
    <div className={coveredClassName} onClick={clickedFn} onContextMenu={addFlag}>
        <p className="centered-text">{content}</p>
    </div>
  )
}

export default Square
