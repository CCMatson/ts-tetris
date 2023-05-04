import { Dispatch, useReducer } from "react";
import { BoardShape, BlockShape, Shapes, EmptyCell, Block } from "../types/types"

export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 20;

export type BoardState = {
  board: BoardShape;
  droppingRow: number;
  droppingColumn: number;
  droppingBlock: Block;
  // hard code rotation here?
  droppingShape: BlockShape;
}

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

      }
      return state
    }
  )
  return [boardState, dispatchBoardState]
}

export function getEmptyBoard(height = BOARD_HEIGHT): BoardShape {
  return Array(height)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(EmptyCell.Empty))
}

type Action = {
  type: 'start' | 'drop' | 'commit' | 'move',
};

function boardReducer(state: BoardState, action: Action): BoardState {
  let firstBlock
  let unhandledType: never
  const newState = {...state};
  switch (action.type) {
    case 'start':
      firstBlock = getRandomBlock();
      return {
        board: getEmptyBoard(),
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: firstBlock,
        droppingShape: Shapes[firstBlock].shapes,
      };
    case 'drop':
      newState.droppingRow++;
      break;
    case 'commit':
    case 'move':
      return state;
    default:
      unhandledType = action.type;
      throw new Error(`Unhandled action type: ${unhandledType}`)
  }
  return newState
}

export function getRandomBlock(): Block {
  const blockValues = Object.values(Block);
  return blockValues[Math.floor(Math.random() * blockValues.length)] as Block;
}