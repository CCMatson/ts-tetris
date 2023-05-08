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

//speed options for dropping shapes
enum TickSpeed {
  Normal = 800,
  Sliding = 100,
  Fast = 50,
}

//define state variables
export function useTetris() {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null);
  const [isCommiting, setIsCommiting] = useState(false);
  const [upcomingBlocks, setUpcomingBlocks] = useState<Block[]>([]);

  //here the useTetrisBoard hook is used to define 2 variables, an object that respresents the current state of the game play and a function to dispatch an update of the state of the game board
  const [
    { board, droppingRow, droppingColumn, droppingBlock, droppingShape },
    dispatchBoardState,
  ] = useTetrisBoard();

  //start the game with a callback function, setIsPlaying to true
  const startGame = useCallback(() => {
    const startBlocks = [getRandomBlock(), getRandomBlock(), getRandomBlock()];
    setScore(0);
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

    //checking and clearing filled in rows
    let numCleared = 0;
    //start at the bottom and check towards the top
    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      //every entry in the row is checked to see if it's empty, if the row is not empty (filled) then it is cleared.
      if (newBoard[row].every((entry) => entry !== EmptyCell.Empty)) {
        numCleared++;
        newBoard.splice(row, 1);
      }
    }

    //initializes variable with deep copy of the upcomingBlocks array, as each block is commited the new board is set in state so that the new block can drop
    const newUpcomingBlocks = structuredClone(upcomingBlocks) as Block[];
    const newBlock = newUpcomingBlocks.pop() as Block;
    newUpcomingBlocks.unshift(getRandomBlock());

    if (hasCollision(board, Shapes[newBlock].shapes, 0, 3)) {
      setIsPlaying(false);
      setTickSpeed(null);
    } else {
      setTickSpeed(TickSpeed.Normal);
    }
    setUpcomingBlocks(newUpcomingBlocks);
    setScore((prevScore) => prevScore + getPoints(numCleared));
    dispatchBoardState({
      type: "commit",
      newBoard: [...getEmptyBoard(BOARD_HEIGHT - newBoard.length), ...newBoard],
      newBlock,
    });
    setIsCommiting(false);
  }, [
    board,
    dispatchBoardState,
    droppingBlock,
    droppingColumn,
    droppingRow,
    droppingShape,
    upcomingBlocks,
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

  //useEffect to manage event listeners
  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    //set left and right to boolean values for better control
    let isPressingLeft = false;
    let isPressingRight = false;
    let moveIntervalID: number | undefined;

    //sets up an interval that repeatedly dispatches a 'move' action to the boardReducer to indicate if the user is pressing left or right keys
    const updateMovementInterval = () => {
      //clear interval
      clearInterval(moveIntervalID);
      //dispatches action
      dispatchBoardState({
        type: "move",
        isPressingLeft,
        isPressingRight,
      });
      //creates a new interval
      moveIntervalID = setInterval(() => {
        dispatchBoardState({
          type: "move",
          isPressingLeft,
          isPressingRight,
        });
      }, 300);
    };

    //add keybord event listeners here
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }
      if (event.key === "ArrowDown") {
        setTickSpeed(TickSpeed.Fast);
      }
      if (event.key === "ArrowUp") {
        dispatchBoardState({
          type: "move",
          isRotating: true,
        });
      }

      if (event.key === "ArrowLeft") {
        (isPressingLeft = true), updateMovementInterval();
      }

      if (event.key === "ArrowRight") {
        (isPressingRight = true), updateMovementInterval();
      }
    };
    //when user lifts up the the keys, the booleans that stand for "left" and "right" keys are turned to false
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        setTickSpeed(TickSpeed.Normal);
      }

      if (event.key === "ArrowLeft") {
        (isPressingLeft = false), updateMovementInterval();
      }

      if (event.key === "ArrowRight") {
        (isPressingRight = false), updateMovementInterval();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      clearInterval(moveIntervalID);
      setTickSpeed(TickSpeed.Normal);
    };
  }, [dispatchBoardState, isPlaying]);

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

  function getPoints(numCleared: number): number {
    switch (numCleared) {
      case 0:
        return 0;
      case 1:
        return 100;
      case 2:
        return 300;
      case 3:
        return 500;
      case 4:
        return 800;
      default:
        throw new Error("Unexpected number of rows cleared");
    }
  }

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
    score,
    upcomingBlocks,
  };
}
