import React from "react";
import Cell from "./Cell";

function Square({row,col}){

    const squares=Array(3).fill(Array(3).fill(0))

    return(
        <div className="box h-full w-full gap-1  flex flex-col">
            {squares.map((arr,i)=>(
                <div key={i} className="w-full h-full flex gap-1">
                {arr.map((_,k)=>(
                    <Cell key={k} row={row*3+i} col={col*3+k}/>
                ))

                }
            </div>
            ))}
            
        </div>
    )
}

export default Square