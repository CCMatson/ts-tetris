import { useEffect, useState, useCallback } from "react";
import { Block, BlockShape, BoardShape, Shapes, EmptyCell } from "../types/types";
import { useInterval } from "./useInterval";
import {
  useTetrisBoard,
  BOARD_HEIGHT,
  getEmptyBoard,
  getRandomBlock,
  hasCollision,
} from './useTetrisBoard';

enum TickSpeed {
  Normal = 800,
  Sliding = 100,
  Fast = 50
}

export function useTetris() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null);
  const [isCommiting, setIsCommiting] = useState(false)

  const [
    { board, droppingRow, droppingColumn, droppingBlock, droppingShape },
    dispatchBoardState
  ] = useTetrisBoard();

  const startGame = useCallback(() => {
    setIsCommiting(false)
    setIsPlaying(true)
    setTickSpeed(TickSpeed.Normal)
    dispatchBoardState({ type: 'start' });
  }, [dispatchBoardState])

  const commitPosition = useCallback(() => {
    if (!hasCollision(board, droppingShape, droppingRow + 1, droppingColumn)) {
      setIsCommiting(false);
      setTickSpeed(TickSpeed.Normal)
      return
    }

    const newBoard = structuredClone(board) as BoardShape;
    addShapeToBoard(
      newBoard,
      droppingBlock,
      droppingShape,
      droppingRow,
      droppingColumn
    )
    setTickSpeed(TickSpeed.Normal)
    dispatchBoardState({
      type: 'commit',
      newBoard
    })
    setIsCommiting(false)
  }, [board, dispatchBoardState, droppingBlock, droppingColumn, droppingRow, droppingShape])

  const gameTick = useCallback(() => {
    if (isCommiting) {
      commitPosition();
    } else if (
      hasCollision(board, droppingShape, droppingRow + 1, droppingColumn)
    ) {
      setTickSpeed(TickSpeed.Sliding)
      setIsCommiting(true)
    } else {
      dispatchBoardState({ type: 'drop' })
    }
  }, [board, commitPosition, dispatchBoardState, droppingColumn, droppingRow, droppingShape, isCommiting]);

  useInterval(() => {
    if (!isPlaying) {
      return
    }
    gameTick();
  }, tickSpeed);

  const renderedBoard = structuredClone(board) as BoardShape;
  if (isPlaying) {
    addShapeToBoard(
      renderedBoard,
      droppingBlock,
      droppingShape,
      droppingRow,
      droppingColumn,
    )
  }
  return {
    board: renderedBoard,
    startGame,
    isPlaying
  }

}

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
          board[droppingRow + rowIndex][droppingColumn + colIndex] = droppingBlock;
        }
      });
    })

}
