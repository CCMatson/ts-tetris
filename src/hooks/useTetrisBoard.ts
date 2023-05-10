import { Dispatch, useReducer } from "react";
import { BoardShape } from "../types/BoardShape";
import { BlockShape } from "../types/BlockShape";
import { Shapes } from "../types/Shapes";
import { EmptyCell } from "../types/EmptyCell";
import { Block } from "../types/Block";

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

//type for the state of the Tetris board, board is a 2D array of empty cells, dropping shape is a 2d array of boolean values that represents the dropping shape on the board
export type BoardState = {
  board: BoardShape;
  droppingRow: number;
  droppingColumn: number;
  droppingBlock: Block;
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

//this is a type for the actions that can be dispatched to update the board
type Action = {
  type: "start" | "drop" | "commit" | "move";
  newBoard?: BoardShape;
  newBlock?: Block;
  isPressingLeft?: boolean;
  isPressingRight?: boolean;
  isRotating?: boolean;
};

//reducer function updates the state of the board based on the action that is dispatched, returns a new state object
function boardReducer(state: BoardState, action: Action): BoardState {
  let firstBlock;
  let unhandledType: never;
  const newState = { ...state };
  let rotatedShape = newState.droppingShape;
  let columnOffset;

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
      return {
        board: [
          ...getEmptyBoard(BOARD_HEIGHT - action.newBoard!.length),
          ... action.newBoard!],
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: action.newBlock!,
        droppingShape: Shapes[action.newBlock!].shapes,
      };
    case "move":
      rotatedShape = action.isRotating
        ? rotateBlock(newState.droppingShape)
        : newState.droppingShape;
      columnOffset = action.isPressingLeft ? -1 : 0;
      columnOffset = action.isPressingRight ? 1 : columnOffset;
      if (
        !hasCollision(
          newState.board,
          rotatedShape,
          newState.droppingRow,
          newState.droppingColumn + columnOffset
        )
      ) {
        newState.droppingColumn += columnOffset;
        newState.droppingShape = rotatedShape;
      }
        break;
    default:
      unhandledType = action.type;
      throw new Error(`Unhandled action type: ${unhandledType}`);
  }
  return newState;
}

//when the action is 'move' the player can rotate the block, the 2D boolean arrays
function rotateBlock(shape: BlockShape): BlockShape {
  const rows = shape.length;
  const columns = shape[0].length;

  const rotated = Array(rows)
    .fill(null)
    .map(() => Array(columns).fill(false));

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      rotated[column][rows - 1 - row] = shape[row][column];
    }
  }
  return rotated;
}

//get a random block
export function getRandomBlock(): Block {
  const blockValues = Object.values(Block);
  return blockValues[Math.floor(Math.random() * blockValues.length)] as Block;
}

