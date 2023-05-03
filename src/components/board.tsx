// board.tsx

import { Block, EmptyCell, CellOptions, BoardShape } from '../types/types'

//board 
interface Props {
  currentBoard: BoardShape;
}

function Board({ currentBoard }: Props) {
  return (
    <div className='board'>
      {currentBoard.map((row, rowIndex) => (
        <div className='row' key={`${rowIndex}`}>
          {row.map((cell, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} type={cell}/>
          ))}

        </div>
      ))}

    </div>
  )
}
export default Board