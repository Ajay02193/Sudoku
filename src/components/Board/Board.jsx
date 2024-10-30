import React from "react";
import Square from "./Square";
import { useGame } from "../Store/gameStore";

function Board(){

    const pause=false;
    const over=false;
    const {changeQBoard,mode,totalMistakes,mistake,time,isPause,isComplete,tryAgain,startGame}=useGame();

    const squares=Array(3).fill(Array(3).fill(0));
    const number=Array(9).fill(null);

    function formatTime(seconds){
        seconds=Math.max(0,Math.floor(seconds));
        const minutes=Math.floor(seconds/60);
        const remainingSeconds=seconds%60;
        const minutesFormatted=String(minutes).padStart(2,"0");
        const secondsFormatted=String(remainingSeconds).padStart(2,"0");

        return`${minutesFormatted}:${secondsFormatted}`;
    }

    return(
        <div className="flex w-screen h-[50vh] md:w-[600px] md:h-[600px] p-2 flex-col gap-2 relative">

        {
            isPause&&<span className="text-6xl text-center w-full bg-slate-700 z-10 shadow-lg border-black p-10 rounded-xl
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Pause</span>
        }

        {
            isComplete&&<div className="text-2xl text-center w-full bg-slate-700 z-10 shadow-lg border-black p-10 rounded-xl
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{mistake>=totalMistakes?<span>All mistakes used</span>
            :<span>Congratulations</span>}
            <div className="flex items-center p-5 justify-around">

            <button onClick={tryAgain} className="bg-slate-900 p-3 rounded-md hover:bg-slate-700 active:scale-90">Try Again</button>
            <button onClick={()=>startGame(mode.key)} className="bg-slate-900 p-3 rounded-md hover:bg-slate-700 active:scale-90">Start New</button>

                </div>
            </div>
        }
        <div className="flex justify-around text-xl pt-5w-full">
        <p>Mode: <span>{mode?.name}</span></p>
        <p>Mistake: <span>{mistake}/{totalMistakes}</span></p>
        <p>Time: <span>{formatTime(time)}</span></p>
        </div>
            {squares.map((arr,row)=>(
                <div key={row}className="flex gap-2 h-full w-full">
                {
                    arr.map((_,col)=>(
                        <Square key={col} row={row} col={col}/>
                    ))
                }
            </div>
            ))}
            <div className="flex justify-around select-none w-full">{
                number.map((_,i)=>(
                    <span key={i} onClick={()=>changeQBoard(i+1)} className="text-slate-200 bg-neutral-900 shadow-lg p-2 rounded-md outline-[1px]
                    hover:outline md:px-3 text-2xl cursor-pointer my-5">{i+1}</span>

                ))}

            </div>
        </div>
    )
}

export default Board