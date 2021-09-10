import "./App.css";
import Board from "./Board";
import { Controls } from "./Controls";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <RecoilRoot>
      <div className="App">
        <Controls />
        <Board />
      </div>
    </RecoilRoot>
  );
}

export default App;
