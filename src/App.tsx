import Board from './components/board'
import { EmptyCell } from './types/types'

const board = Array(20)
.fill(null)
.map(()=> Array(12).fill(EmptyCell.Empty))

function App() {


  return (
    <>
    <div className='App'>
      <h1>Tetris</h1>
      <Board currentBoard={board}/>

    </div>
    </>
  )
}

export default App
