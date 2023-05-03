import { BoardShape } from "../types/types"
import { Block } from "../types/types";

export type BoardState = {
  board: BoardShape;
  droppingRow: number;
  droppingColumn: number;
  droppingBlock: Block;
  // hard code rotation?
  // droppingShape: BlockShape;
}