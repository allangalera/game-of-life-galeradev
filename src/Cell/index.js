import "./style.css";

const Cell = ({ x, y }) => {
  return (
    <div
      id={`${x}#${y}`}
      className="cell"
      style={{
        gridColumnStart: +x + 1,
        gridRowStart: +y + 1,
      }}
    />
  );
};

export default Cell;
