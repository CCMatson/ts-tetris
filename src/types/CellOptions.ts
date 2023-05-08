import { Block } from "./Block";
import { EmptyCell } from "./EmptyCell";

//cell can contain a block or by empty
export type CellOptions = Block | EmptyCell;