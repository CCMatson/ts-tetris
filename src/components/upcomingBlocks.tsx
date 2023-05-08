import { Block, Shapes } from "../types/types";

interface Props {
  upcomingBlocks: Block[];
}

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
