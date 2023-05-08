//block types are strings
export enum Block {
  I = "I",
  J = "J",
  L = "L",
  O = "O",
  S = "S",
  T = "T",
  Z = "Z",
}

//can be empty cell
export enum EmptyCell {
  Empty = "Empty",
}

//cell can contain a block or by empty
export type CellOptions = Block | EmptyCell;

//2D array of cellOptions
export type BoardShape = CellOptions[][];

//2D array of boolean values, representing shape of a block that can be placed on the game board
export type BlockShape = boolean[][];

type ShapesObj = {
  [key in Block]: {
    shapes: BlockShape;
  }
}

//shapes starting positions as boolean arrays, rotate these arrays to rotate blocks
export const Shapes: ShapesObj = {
  I: {
    shapes: [
      [false, false, false, false],
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false],
    ],
  },
  J: {
    shapes: [
      [false, false, false],
      [true, false, false],
      [true, true, true],
    ],
  },
  L: {
    shapes: [
      [false, false, false],
      [false, false, true],
      [true, true, true],
    ],
  },
  O: {
    shapes: [
      [true, true],
      [true, true],
    ],
  },
  S: {
    shapes: [
      [false, false, false],
      [false, true, true],
      [true, true, false],
    ],
  },
  T: {
    shapes: [
      [false, false, false],
      [false, true, false],
      [true, true, true],
    ],
  },
  Z: {
    shapes: [
      [false, false, false],
      [true, true, false],
      [false, true, true],
    ],
  },
};
