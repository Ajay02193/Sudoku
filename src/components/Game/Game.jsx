import React, { useEffect, useRef } from "react";
import Board from "../Board/Board";
import { Edit, Lightbulb, LogOut, Pause, Play } from "lucide-react";
import { useGame } from "../Store/gameStore";
import { useNavigate } from "react-router-dom";

function Game(){

  const navigate=useNavigate();
  const {isStart,increaseTime,isPause,pauseGame,resetQBoard,isComplete,
    quitGame,pencilMode,togglePencilMode,useHint,hints}=useGame();
  const timeRef=useRef();

  useEffect(()=>{
    if(!isStart){
      navigate('/');
    }

    timeRef.current=setInterval(()=>{
      if(!isPause || !isComplete){increaseTime();}
    },1000);
    return()=>clearInterval(timeRef.current);
  },[isStart,isPause,isComplete]);

    return(
      <div className="flex flex-col items-center justify-center">
       
        <Board/>
        <div className="flex items-center justify-around w-full">
        <button onClick={quitGame} className="bg-slate-900 p-3 rounded-md hover:bg-slate-700 active:scale-90"><LogOut/></button>
        <button onClick={pauseGame} className="bg-slate-900 p-3 rounded-md hover:bg-slate-700 active:scale-90">{!isPause?<Pause/>:<Play/>}</button>
        <button onClick={resetQBoard}className="bg-slate-900 p-3 rounded-md hover:bg-slate-700 active:scale-90">Reset</button>
        <button onClick={togglePencilMode} className={`bg-slate-900 p-3 rounded-md hover:bg-slate-700 active:scale-90 ${pencilMode&&"text-green-500"}`}><Edit/></button>
        <button onClick={useHint} className="bg-slate-900 p-3 rounded-md hover:bg-slate-700 active:scale-90 relative">
          <span className="absolute h-6 w-6 -right-3 -top-3 flex items-center justify center text-center 
          text-xl bg-blue-700 text-white p-2 rounded-full">{hints}</span><Lightbulb/></button>
        </div>
      </div>
    )
  }

  export default Game;