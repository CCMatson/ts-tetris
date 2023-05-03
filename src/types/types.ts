//block types
export enum Block {
  I = 'I',
  J = 'J',
  L = 'L',
  O ='O',
  S = 'S',
  T = 'T',
  Z = 'Z',
}

//can be empty cell
export enum EmptyCell {
  Empty = 'Empty',
}

export type CellOptions = Block | EmptyCell;

export type BoardShape = CellOptions[][];

//add type ShapeObject?

//shapes starting positions as boolean arrays

export const Shapes = {
  I: {
    shapes: [
      [false, false, false, false],
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false]
    ]
  },
  J: {
    shapes: [
      [false, false, false],
      [true, false, false],
      [true, true, true]
    ]
  },
  L: {
    shapes: [
      [false, false, false],
      [false, false, true],
      [true, true, true]
    ]
  },
  O: {
    shapes: [
      [true, true],
      [true, true]
    ]
  },
  S: {
    shapes: [
      [false, false, false],
      [false, true, true],
      [true, true, false]
    ]
  },
  T: {
    shapes: [
      [false, false, false],
      [false, true, false],
      [true, true, true]
    ]
  },
  Z: {
    shapes: [
      [false, false, false],
      [true, true, false],
      [false, true, true]
    ]
  }
}