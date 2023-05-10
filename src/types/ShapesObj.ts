import { Block } from "./Block"
import { BlockShape } from "./BlockShape";

export type ShapesObj = {
  [key in Block]: {
    shapes: BlockShape;
  }
}