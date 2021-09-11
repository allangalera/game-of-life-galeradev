import "./style.css";

const Cell = ({ x, y }) => {
  return (
    <div
      id={`${x}#${y}`}
      className="cell"
      style={{
        gridRowStart: +x + 1,
        gridColumnStart: +y + 1,
      }}
    />
  );
};

export default Cell;
