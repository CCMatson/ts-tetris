import { Dispatch, useReducer } from "react";
import {
  BoardShape,
  BlockShape,
  Shapes,
  EmptyCell,
  Block,
} from "../types/types";

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

//type for the state of the Tetris board, board is a 2D array of empty cells, dropping shape is a 2d array of boolean values that represents the dropping shape on the board
export type BoardState = {
  board: BoardShape;
  droppingRow: number;
  droppingColumn: number;
  droppingBlock: Block;
  // hard code rotating each shape here?
  droppingShape: BlockShape;
};

//uses the useReducer hook to manage the state of the board and returns an initial state with an empty game board and the first block type and shape. returns the state of the Tetris game board as well as a dispatch function for updating that state.
export function useTetrisBoard(): [BoardState, Dispatch<Action>] {
  const [boardState, dispatchBoardState] = useReducer(
    boardReducer,
    {
      board: [],
      droppingRow: 0,
      droppingColumn: 0,
      droppingBlock: Block.I,
      droppingShape: Shapes.I.shapes,
    },
    (emptyState) => {
      const state = {
        ...emptyState,
        board: getEmptyBoard(),
      };
      return state;
    }
  );
  return [boardState, dispatchBoardState];
}

//returns a 2D array of empty cells of the specified height and width
export function getEmptyBoard(height = BOARD_HEIGHT): BoardShape {
  return Array(height)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(EmptyCell.Empty));
}

//this is a type for the actions that can be dispatched to update the board
type Action = {
  type: "start" | "drop" | "commit" | "move";
  newBoard?: BoardShape;
};

//reducer function updates the state of the board based on the action that is dispatched, returns a new state object
function boardReducer(state: BoardState, action: Action): BoardState {
  let firstBlock;
  let unhandledType: never;
  const newState = { ...state };
  switch (action.type) {
    case "start":
      firstBlock = getRandomBlock();
      return {
        board: getEmptyBoard(),
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: firstBlock,
        droppingShape: Shapes[firstBlock].shapes,
      };
    case "drop":
      newState.droppingRow++;
      break;
    case "commit":
    case "move":
      return state;
    default:
      unhandledType = action.type;
      throw new Error(`Unhandled action type: ${unhandledType}`);
  }
  return newState;
}

//get a random block
export function getRandomBlock(): Block {
  const blockValues = Object.values(Block);
  return blockValues[Math.floor(Math.random() * blockValues.length)] as Block;
}

//check to see if the current block has collided with the board or another block, returns a boolean if there is a collision
export function hasCollision(
  board: BoardShape,
  currentShape: BlockShape,
  row: number,
  column: number
): boolean {
  let hasCollision = false;
  currentShape
    .filter((shapeRow) => shapeRow.some((isSet) => isSet))
    .forEach((shapeRow: boolean[], rowIndex: number) => {
      shapeRow.forEach((isSet: boolean, colIndex: number) => {
        if (
          isSet &&
          (row + rowIndex >= board.length ||
            column + colIndex >= board[0].length ||
            column + colIndex < 0 ||
            board[row + rowIndex][column + colIndex] !== EmptyCell.Empty)
        ) {
          hasCollision = true;
        }
      });
    });

  return hasCollision;
}
