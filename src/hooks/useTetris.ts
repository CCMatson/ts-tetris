// import { Block, BlockShape, BoardShape, Shapes,EmptyCell } from "../types/types";
import { useInterval } from "./useInterval";


enum TickSpeed {
  Normal = 800,
}
import { useState} from "react"

export function useTetris(){
  const [isPlaying, setIsPlaying] = useState(false);
  const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null);

  // const [
  //   { board, droppingRow, droppingColumn, droppingBlock, droppingShape }, 
  //   dispatchBoardState ] = useTetrisBoard();

  //   const gameTick = useCallback(() => {
  //     dispatchBoardState({type:'drop'})
  //   }, [dispatchBoardState]);

    useInterval(() => {
      if(!isPlaying){
        return
      }
      gameTick();
    }, tickSpeed);
}