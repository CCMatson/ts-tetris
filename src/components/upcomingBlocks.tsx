import { Block, Shapes } from "../types/types";

interface Props {
  upcomingBlocks: Block[];
}

//this is code for the 'upcoming blocks' viewer window. The block value is used to get a shape (2D boolean arrays), filter is applied to the shape array to remove empty rows. The boolean 'isSet' checks to see if the current dropping block is commited to a position so that the array can be adjusted. 
function UpcomingBlocks({ upcomingBlocks }: Props) {
  return (
    <div className="upcoming">
      {upcomingBlocks.map((block, blockIndex) => {
        const shape = Shapes[block].shapes.filter((row) =>
          row.some((cell) => cell)
        );
        return (
          <div key={blockIndex}>
            {shape.map((row, rowIndex) => {
              return (
                <div key={rowIndex} className="row">
                  {row.map((isSet, cellIndex) => {
                    const cellClass = isSet ? block : "hidden";
                    return (
                      <div
                        key={`${blockIndex}-${rowIndex}-${cellIndex}`}
                        className={`cell ${cellClass}`}
                      ></div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default UpcomingBlocks;
