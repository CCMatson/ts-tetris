import { ShapesObj } from "./ShapesObj";

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
