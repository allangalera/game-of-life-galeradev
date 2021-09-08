import "./App.css";
import Board from "./Board";
import { useEffect, useState } from "react";

const initialState = {
  width: 50,
  height: 50,
  board: [],
  initialized: false,
  running: false,
};

function App() {
  const [state, setState] = useState(initialState);
  const [timer, setTimer] = useState(null);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    handleClearBoard();
  }, [state.width, state.height]);

  const handleCellClick = (row, col) => {
    if (!state.initialized) return;

    let board = state.board.slice();
    board[row][col] = !board[row][col];

    setState((state) => ({
      ...state,
      board,
    }));
  };

  const handleGOLLogic = () => {
    let currentBoard = state.board.slice();
    const board = currentBoard.map((row, rowIndex) => {
      return row.map((col, colIndex) => {
        if (col) return handleAliveCell(rowIndex, colIndex, currentBoard);
        return handleDeadCell(rowIndex, colIndex, currentBoard);
      });
    });

    setState((state) => ({
      ...state,
      board,
    }));
    setGeneration((generation) => generation + 1);
  };

  const countAliveCells = (row, col, board) => {
    let aliveCells = 0;

    for (let currentRow = row - 1; currentRow <= row + 1; currentRow++) {
      for (let currentCol = col - 1; currentCol <= col + 1; currentCol++) {
        if (
          currentRow < 0 ||
          currentCol < 0 ||
          currentRow > state.height - 1 ||
          currentCol > state.width - 1
        )
          continue;
        if (currentCol === col && currentRow === row) continue;
        if (board[currentRow][currentCol]) aliveCells++;
      }
    }
    return aliveCells;
  };

  const handleAliveCell = (row, col, board) => {
    const aliveCells = countAliveCells(row, col, board);

    if (aliveCells < 2 || aliveCells > 3) return false;

    return true;
  };

  const handleDeadCell = (row, col, board) => {
    const aliveCells = countAliveCells(row, col, board);

    if (aliveCells === 3) return true;

    return false;
  };

  const handleClearBoard = () => {
    if (state.running) return;
    let board = [];
    for (let row = 0; row < state.width; row++) {
      let row = [];
      for (let col = 0; col < state.height; col++) {
        row.push(false);
      }
      board.push(row);
    }
    setState((state) => ({
      ...state,
      board,
      initialized: true,
    }));
  };

  const handleStep = () => {
    if (state.running) return;
    handleGOLLogic();
  };

  const handlePlayStopGame = () => {
    setState((state) => {
      if (state.running) {
        clearTimeout(timer);
        setTimer(null);
      }

      return {
        ...state,
        running: !state.running,
      };
    });
  };

  useEffect(() => {
    if (state.running) {
      const newTimer = setTimeout(() => {
        handleGOLLogic();
      }, 1000);

      setTimer(newTimer);
    }
  }, [state.board, state.running]);

  return (
    <div className="App">
      <h1>Game of Life</h1>
      <div className="controls">
        <button onClick={handlePlayStopGame}>
          {state.running ? "Pause" : "Play"}
        </button>
        <button onClick={handleStep} disabled={state.running}>
          Step
        </button>
        <button onClick={handleClearBoard} disabled={state.running}>
          Clear
        </button>
        <button onClick={() => setGeneration(0)} disabled={state.running}>
          Reset
        </button>
        <div>generation: {generation}</div>
      </div>
      <Board {...state} handleCellClick={handleCellClick} />
    </div>
  );
}

export default App;
