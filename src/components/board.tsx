import { BoardShape } from "../types/BoardShape";
import Cell from "./cell";

export interface BoardProps {
  currentBoard: BoardShape;
}

function Board(props: BoardProps) {
  const currentBoard = props.currentBoard;
  
  return (
    <div className="board">
      {currentBoard.map((row, rowIndex) => (
        <div className="row" key={`${rowIndex}`}>
          {row.map((cell, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} type={cell} />
          ))}
        </div>
      ))}
    </div>
  );
}
export default Board;
