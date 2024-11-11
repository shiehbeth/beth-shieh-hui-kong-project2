import React, { useState, useEffect } from 'react';
import Square from './Square'
import './Game.css'
import {GameContext} from './GameContext'
import { RevealedContext} from './RevealedContext'
import Button from 'react-bootstrap/Button';
import {useParams} from 'react-router-dom';
import NavBar from './NavBar'


function Game() {
    // dynamically changing with the difficulty specified
    const { difficulty } = useParams();
    const settings = getGameSettings(difficulty);

    const { max_width, max_height, num_mines } = settings;

    const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

    const [mineCoordSet, setMineCoordSet] = useState(new Set());
    const [safeNumMap, setSafeNumMap] = useState(new Map());
    const [grid, setGrid] = useState([]);
    const [gameState, setGameState] = useState('ongoing');
    const [revealedCount, setRevealedCount] = useState(0);
    const totalSafeSquares = max_width * max_height - num_mines;
    const [displayMessage, setDisplayMessage]= useState('');
    const [markedFlags, setMarkedFlags] = useState(new Set());
    const [squareSize, setSquareSize] = useState(50);
    // const [isFirstClick, setIsFirstClick] = useState(true);
    const [unsafeFirstClick, setUnsafeFirstClick] = useState(false);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [coordsToBeRemoved, setCoordsToBeRemoved] = useState([])



    // effect for generating coords for the number of mines needed
    useEffect(() => {
        const updatedMines = generateMines();
        setMineCoordSet(updatedMines);
    }, [difficulty, resetTrigger]);

    // effect for updating safe nums based on mine coords generated
    useEffect(() => {
        const makeNewMap = updateSafeNums();
        setSafeNumMap(makeNewMap)
    }, [mineCoordSet]);

    // effect to generate the grid and display message
    useEffect(() => {
        generateGrid();
        const updatedGrid = generateGrid();
        setGrid(updatedGrid)
        // handleFirstSquareClick(coordsToBeRemoved[0], coordsToBeRemoved[1]);
        updateDisplayMessage();
    }, [safeNumMap, gameState, markedFlags]);

    // effect to handle the size of the square
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 480 || window.innerHeight <= 480) {
                setSquareSize(30);
            } else if (window.innerWidth <= 780 || window.innerHeight <= 780){
                setSquareSize(40);
            } else {
                setSquareSize(50);
            }
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // method for generating mines
    function generateMines() {
        const newCoordSet = new Set(mineCoordSet);

        while (newCoordSet.size < num_mines) {
            const coords = generateMineCoords();
            newCoordSet.add(coords);
        }
        return newCoordSet;
    }

    // helper method for generating the grid
    function generateGrid() {
        const newGrid = []
        for(let i = 0; i < max_width; i++) {
            let row = [];
            for(let j = 0; j < max_height; j++) {
                const coords = `${i}-${j}`;
                const hasMine = mineCoordSet.has(coords);
                let safeNum = 0;
                if (!hasMine) {
                    safeNum = safeNumMap.get(coords);
                }

                row.push(
                    <Square key={coords} x={i} y={j} hasMine={hasMine} safeNum={safeNum} />
                )
            }
            newGrid.push(<div key={i} className="row">{row}</div>);
        }
        // setGrid(newGrid);
        return newGrid;
    }

    // helper method for clicking each cell
    function handleFirstSquareClick(x, y) {
        if (unsafeFirstClick) {
            // move the bomb
            moveBomb(x, y);
            const newSafe = updateSafeNums();
            setSafeNumMap(newSafe);
            setGrid(generateGrid());
            setUnsafeFirstClick(false);
            setCoordsToBeRemoved([]);
        }
    }

    // helper method for moving the bomb
    function moveBomb(x, y) {
        const newCoordSet = new Set(mineCoordSet);
        newCoordSet.delete(`${x}-${y}`);
        let newCoords;
        do {
            newCoords = generateMineCoords();
        } while (newCoordSet.has(newCoords));
        newCoordSet.add(newCoords);
        setMineCoordSet(newCoordSet);
    }

    // helper method for generating random mine coords
    function generateMineCoords() {
        const random_x_coord = Math.floor(Math.random() * (max_width));
        const random_y_coord = Math.floor(Math.random() * (max_height));
        return `${random_x_coord}-${random_y_coord}`;
    }

    // helper method for updating safe numbers
    function updateSafeNums() {
        const newMap = new Map()
        for (let i = 0; i < max_width; i++) {
            for (let j = 0; j < max_height; j++) {
                if (!mineCoordSet.has(`${i}-${j}`)) {
                    let safe_num = 0;
                    safe_num = findNumOfBombs(i, j, safe_num);
                    newMap.set(`${i}-${j}`, safe_num);
                }
            }
        }
        return newMap;
    }

    // helper method for tallying num bombs in adjacent squares (safe number)
    function findNumOfBombs(x, y, num) {
        for (let [dir_x, dir_y] of dirs) {
            const new_x = x + dir_x;
            const new_y = y + dir_y;
            const neighbor_coords = `${new_x}-${new_y}`
            if (new_x >= 0 && new_y >= 0 && new_x < max_width
                && new_y < max_height) {
                if (mineCoordSet.has(neighbor_coords)) {
                    num += 1;
                }
            }
        }
        return num;
    }

    // method for updating the display message based on the game state
    function updateDisplayMessage() {
        if (gameState === 'won') {
            let newMessage = 'You Win!';
            setDisplayMessage(newMessage);
        }
        else if (gameState === 'ongoing') {
            setDisplayMessage('')
        }
        else {
            let newMessage = 'You Lose!';
            setDisplayMessage(newMessage);
        }
    }

    // method for resetting the game
    function resetGame() {
        setMineCoordSet(new Set());
        setSafeNumMap(new Map());
        setGrid([]);
        setGameState('ongoing');
        setRevealedCount(0);
        setDisplayMessage('');
        // setIsFirstClick(true);
        setMarkedFlags(new Set());
        setUnsafeFirstClick(false);
        setResetTrigger(prev => prev + 1);
    }

    // method for setting game difficulty
    function getGameSettings(difficulty) {
        switch (difficulty) {
            case 'easy':
                return {max_width: 8, max_height: 8, num_mines: 10};
            case 'medium':
                return {max_width: 16, max_height: 16, num_mines: 40};
            case 'hard':
                return {max_width: 30, max_height: 16, num_mines: 99};
            default:
                return {max_width: 8, max_height: 8, num_mines: 10};
        }
    }
    
    return (

        <GameContext.Provider value={{ gameState, setGameState, totalSafeSquares, unsafeFirstClick, setUnsafeFirstClick }}>
            <RevealedContext.Provider value={[revealedCount, setRevealedCount, coordsToBeRemoved, setCoordsToBeRemoved, handleFirstSquareClick]}>
                <div>
                    <NavBar/>
                </div>
                <div className="centered-content">
                    <h1>PoopScooper</h1>

                    <div className="board" style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${max_width}, ${squareSize}px)`, 
                        gridTemplateRows: `repeat(${max_height}, ${squareSize}px)`, 
                        gap: "0px", 
                        margin: "auto",
                        marginBottom: "20px",
                    }}>
                        {grid}
                    </div>

                    <h3>
                        {displayMessage}
                    </h3>

                    <Button variant="secondary" onClick={resetGame}>Restart Game</Button>
                </div>
            </RevealedContext.Provider>
        </GameContext.Provider>
    )
}

export default Game
