import "./style.css";

import { useMemo } from "react";
import Cell from "../Cell";
import { cellsAtom, boardSizeAtom } from "../state/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useRef } from "react";
import { clone } from "ramda";

const Board = () => {
  const boardRef = useRef();
  const [cells, setCells] = useRecoilState(cellsAtom);
  const boardSize = useRecoilValue(boardSizeAtom);

  useEffect(() => {
    let board = [];
    for (let row = 0; row < boardSize.height; row++) {
      board[row] = [];
      for (let col = 0; col < boardSize.width; col++) {
        board[row][col] = false;
      }
    }
    setCells(board);
  }, [boardSize, setCells]);

  const renderBoard = useMemo(() => {
    let board = [];
    for (let row in cells) {
      for (let col in cells[row]) {
        if (cells[row][col])
          board.push(<Cell key={`${row}#${col}`} x={row} y={col} />);
      }
    }
    return board;
  }, [cells]);

  const handleClick = (event) => {
    const rect = boardRef.current.getBoundingClientRect();
    const doc = document.documentElement;

    const elemOffset = {
      x: rect.left + window.pageXOffset - doc.clientLeft,
      y: rect.top + window.pageYOffset - doc.clientTop,
    };

    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY - elemOffset.y;

    const x = Math.floor(offsetX / boardSize.cellSize);
    const y = Math.floor(offsetY / boardSize.cellSize);

    if (x >= 0 && x <= boardSize.width && y >= 0 && y <= boardSize.height) {
      let newCells = clone(cells);

      newCells[x][y] = !newCells[x][y];
      setCells(newCells);
    }
  };

  return (
    <div
      ref={boardRef}
      className="board"
      style={{
        gridTemplateColumns: `repeat(${boardSize.width}, ${boardSize.cellSize}px)`,
        gridTemplateRows: `repeat(${boardSize.height}, ${boardSize.cellSize}px`,
        backgroundSize: ` ${boardSize.cellSize}px  ${boardSize.cellSize}px`,
        backgroundImage:
          "linear-gradient(to right, grey 1px, transparent 1px), linear-gradient(to bottom, grey 1px, transparent 1px)",
        border: "1px solid black",
      }}
      onClick={handleClick}
    >
      {renderBoard}
    </div>
  );
};

export default Board;
