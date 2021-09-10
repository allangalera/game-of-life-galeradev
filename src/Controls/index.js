import "./style.css";

import { useRecoilState, useResetRecoilState } from "recoil";
import { clone } from "ramda";
import {
  boardSizeAtom,
  cellsAtom,
  gameStateAtom,
  generationAtom,
} from "../state/atoms";
import { useEffect, useCallback } from "react";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const Controls = () => {
  const [boardSize, setBoardSize] = useRecoilState(boardSizeAtom);
  const [gameState, setGameState] = useRecoilState(gameStateAtom);
  const [generation, setGeneration] = useRecoilState(generationAtom);
  const resetGeneration = useResetRecoilState(generationAtom);
  const resetGameState = useResetRecoilState(gameStateAtom);
  const [cells, setCells] = useRecoilState(cellsAtom);

  const clearBoardFunction = useCallback(() => {
    let newCells = clone(cells);
    for (let x in newCells) {
      for (let y in newCells[x]) {
        newCells[x][y] = false;
      }
    }
    setCells(newCells);
  }, [cells, setCells]);

  const generateRandomBoard = useCallback(() => {
    let newCells = clone(cells);
    for (let x in newCells) {
      for (let y in newCells[x]) {
        newCells[x][y] = Math.random() >= 0.5;
      }
    }
    setCells(newCells);
  }, [cells, setCells]);

  const countAliveCells = useCallback(
    (x, y) => {
      let aliveCells = 0;
      const dirs = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1],
      ];
      for (let curr of dirs) {
        let x1 = curr[0] + x;
        let y1 = curr[1] + y;
        if (
          x1 >= 0 &&
          y1 >= 0 &&
          x1 < boardSize.height &&
          y1 < boardSize.width &&
          cells[x1][y1]
        ) {
          ++aliveCells;
        }
      }
      return aliveCells;
    },
    [boardSize.height, boardSize.width, cells]
  );

  const testeGL = useCallback(async () => {
    const before = performance.now();
    let hadUpdate = false;
    let newCells = clone(cells);
    for (let x = 0; x < boardSize.width; x++) {
      for (let y = 0; y < boardSize.height; y++) {
        const aliveNeighborhood = countAliveCells(x, y);
        if (cells[x][y] && (aliveNeighborhood < 2 || aliveNeighborhood > 3)) {
          // alive logic
          newCells[x][y] = false;
          hadUpdate = true;
        } else if (aliveNeighborhood === 3) {
          // dead logic
          newCells[x][y] = true;
          hadUpdate = true;
        }
      }
    }
    const after = performance.now();
    console.log(`testeGL: ${after - before} ms`);
    await sleep(boardSize.interval);
    if (!hadUpdate) return setGameState("idle");
    setCells(newCells);
    setGeneration((value) => ++value);
  }, [
    boardSize.height,
    boardSize.interval,
    boardSize.width,
    cells,
    countAliveCells,
    setCells,
    setGameState,
    setGeneration,
  ]);

  const handleRandom = () => {
    generateRandomBoard();
  };

  const gameRunning = useCallback(async () => {
    console.log("gameRunning", gameState);
    if (gameState === "running") {
      await testeGL();
    }
  }, [gameState, testeGL]);

  useEffect(() => {
    gameRunning();
  }, [generation, gameState, gameRunning]);

  const handlePlayStopGame = async () => {
    if (gameState === "running") {
      setGameState("idle");
    } else {
      setGameState("running");
    }
  };

  const handleStep = () => {
    testeGL();
  };

  const handleReset = () => {
    clearBoardFunction();
    resetGameState();
    resetGeneration();
  };

  return (
    <div className="controls">
      <div className="input-container">
        <label>Width</label>
        <input
          type="number"
          onChange={(e) =>
            setBoardSize({
              ...boardSize,
              width: +e.target.value,
            })
          }
          value={boardSize.width}
          disabled={gameState === "running"}
        />
      </div>
      <div className="input-container">
        <label>Height</label>
        <input
          type="number"
          onChange={(e) =>
            setBoardSize({
              ...boardSize,
              height: +e.target.value,
            })
          }
          value={boardSize.height}
          disabled={gameState === "running"}
        />
      </div>
      <div className="input-container">
        <label>Time interval</label>
        <input
          type="number"
          onChange={(e) =>
            setBoardSize({
              ...boardSize,
              interval: +e.target.value,
            })
          }
          value={boardSize.interval}
          disabled={gameState === "running"}
        />
      </div>
      <button onClick={handlePlayStopGame}>
        {gameState === "running" ? "Pause" : "Play"}
      </button>
      <button onClick={handleStep} disabled={gameState === "running"}>
        Step
      </button>
      <button onClick={handleRandom} disabled={gameState === "running"}>
        Random
      </button>
      <button onClick={handleReset} disabled={gameState === "running"}>
        Reset
      </button>
      <div>generation: {generation}</div>
    </div>
  );
};
