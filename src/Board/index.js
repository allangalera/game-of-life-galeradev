import "./style.css";

import { useMemo } from "react";
import Cell from "../Cell";

const Board = ({ board, width, height, handleCellClick }) => {
  const renderBoard = useMemo(() => {
    return board.map((row, rowIndex) => {
      return row.map((col, colIndex) => {
        return (
          <Cell
            key={`${rowIndex}#${colIndex}`}
            handleCellClick={() => handleCellClick(rowIndex, colIndex)}
            isAlive={col}
          />
        );
      });
    });
  }, [board, handleCellClick]);

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${width}, 10px)`,
        gridTemplateRows: `repeat(${height}, 10px)`,
      }}
    >
      {renderBoard}
    </div>
  );
};

export default Board;
