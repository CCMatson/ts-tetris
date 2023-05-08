import { Block, Shapes } from "../types/types";

interface Props {
  upcomingBlocks: Block[];
}

// function upcomingBlocks({ upcomingBlocks}: Props) {
//   return (
//     <div>
//       {upcomingBlocks.map((block, blockIndex) => {
//         const shape = Shapes[block].shapes.filter((row) => row.some((cell) => cell)
//         )
//         return (
//           <div>
//             {shape.map((row, rowIndex) => {
//               return
//             })}
//           </div>
//         )
//       })}
//     </div>
//   )
// }