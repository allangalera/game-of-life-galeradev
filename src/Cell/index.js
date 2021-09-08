import "./style.css";

const Cell = ({ isAlive, handleCellClick }) => {
  return (
    <div
      className={`cell${isAlive ? " alive" : ""}`}
      onClick={handleCellClick}
    />
  );
};

export default Cell;
