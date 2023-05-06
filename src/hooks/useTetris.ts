import { useEffect, useState, useCallback } from "react";
import {
  Block,
  BlockShape,
  BoardShape,
  Shapes,
  EmptyCell,
} from "../types/types";
import { useInterval } from "./useInterval";
import {
  useTetrisBoard,
  BOARD_HEIGHT,
  getEmptyBoard,
  getRandomBlock,
  hasCollision,
} from "./useTetrisBoard";

//speed of dropping shapes
enum TickSpeed {
  Normal = 800,
  Sliding = 100,
  Fast = 50,
}

//define state variables
export function useTetris() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null);
  const [isCommiting, setIsCommiting] = useState(false);
  const [upcomingBlocks, setUpcomingBlocks] = useState<Block[]>([])

  //useTetrisBoard hook is used to define variables,an object that respresents the current state of the game play and a function to update the state of the game board
  const [
    { board, droppingRow, droppingColumn, droppingBlock, droppingShape },
    dispatchBoardState,
  ] = useTetrisBoard();

  //start the game with a callback function, setIsPlaying to true
  const startGame = useCallback(() => {
    const startBlocks = [
      getRandomBlock(),
      getRandomBlock(),
      getRandomBlock(),
    ];
    setUpcomingBlocks(startBlocks);
    setIsCommiting(false);
    setIsPlaying(true);
    setTickSpeed(TickSpeed.Normal);
    dispatchBoardState({ type: "start" });
  }, [dispatchBoardState]);

  //check to see if the shape had a collision with the board or another shape, if no collision then the shape keeps dropping at normal speed
  const commitPosition = useCallback(() => {
    if (!hasCollision(board, droppingShape, droppingRow + 1, droppingColumn)) {
      setIsCommiting(false);
      setTickSpeed(TickSpeed.Normal);
      return;
    }

    //newBoard is a copy of the 'board' with the type BoardShape, call helper function to add shape to the board, updates board state
    const newBoard = structuredClone(board) as BoardShape;
    addShapeToBoard(
      newBoard,
      droppingBlock,
      droppingShape,
      droppingRow,
      droppingColumn
    );

    //initializes variable with deep copy of the upcomingBlocks array
    const newUpcomingBlocks = structuredClone(upcomingBlocks) as Block[]
    const newBlock = newUpcomingBlocks.pop() as Block
    newUpcomingBlocks.unshift(getRandomBlock())

    setTickSpeed(TickSpeed.Normal);
    dispatchBoardState({
      type: "commit",
      newBoard,
    });
    setIsCommiting(false);
  }, [
    board,
    dispatchBoardState,
    droppingBlock,
    droppingColumn,
    droppingRow,
    droppingShape,
    upcomingBlocks
  ]);

  //commits shape conditionally and allows user to slide the block once it has collided with the bottom or another shape
  const gameTick = useCallback(() => {
    if (isCommiting) {
      commitPosition();
    } else if (
      hasCollision(board, droppingShape, droppingRow + 1, droppingColumn)
    ) {
      setTickSpeed(TickSpeed.Sliding);
      setIsCommiting(true);
    } else {
      dispatchBoardState({ type: "drop" });
    }
  }, [
    board,
    commitPosition,
    dispatchBoardState,
    droppingColumn,
    droppingRow,
    droppingShape,
    isCommiting,
  ]);

  //useInterval hook
  useInterval(() => {
    if (!isPlaying) {
      return;
    }
    gameTick();
  }, tickSpeed);

  //render the game board
  const renderedBoard = structuredClone(board) as BoardShape;
  if (isPlaying) {
    addShapeToBoard(
      renderedBoard,
      droppingBlock,
      droppingShape,
      droppingRow,
      droppingColumn
    );
  }
  return {
    board: renderedBoard,
    startGame,
    isPlaying,
  };
}

//keeps track of the shapes on the board, as a boolean if the shape occupys the row and column
function addShapeToBoard(
  board: BoardShape,
  droppingBlock: Block,
  droppingShape: BlockShape,
  droppingRow: number,
  droppingColumn: number
) {
  droppingShape
    .filter((row) => row.some((isSet) => isSet))
    .forEach((row: boolean[], rowIndex: number) => {
      row.forEach((isSet: boolean, colIndex: number) => {
        if (isSet) {
          board[droppingRow + rowIndex][droppingColumn + colIndex] =
            droppingBlock;
        }
      });
    });
}
