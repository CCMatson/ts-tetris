import { CellOptions } from "../types/CellOptions";

export interface CellProps {
  type: CellOptions;
}

function Cell(props: CellProps) {
  return <div className={`cell ${props.type}`} />;
}

export default Cell;
