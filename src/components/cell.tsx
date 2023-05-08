import { CellOptions } from "../types/Shapes";

interface Props {
  type: CellOptions;
}

function Cell({ type }: Props) {
  return <div className={`cell ${type}`} />;
}

export default Cell;
