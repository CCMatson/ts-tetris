import Board from './components/board'


function App() {
  // const {board, startGame, isPlaying, score, upcomingBlocks} = useTetris()


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
