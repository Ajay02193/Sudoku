import {create} from 'zustand'
import { MODES, sudoku } from './SudokuUtils'
import { persist } from 'zustand/middleware';

const initialState={
    isStart: false,
    isPause: false,
    isComplete: false,
    pencilMode: false,
    mistake:0,
    hints:0,
    totalMistakes:5,
    time:0,
    mode:MODES["easy"],
    board: Array.from({length:9},()=>Array(9).fill(0)),
    qBoard: Array.from({length:9},()=>Array(9).fill(0)),
    selectedCell:{
        row:null,
        col:null,
        squares:null
    }
}

const gameState=(set)=>({
    ...initialState,
    startGame:(mode)=>{
        
        const data=sudoku(mode);
        set({...initialState, board:data.solvedBoard,qBoard:data.unSolvedBoard,isStart:true, hints:MODES[mode].hints, 
            totalMistakes:MODES[mode].mistakes,mode:MODES[mode] 
        })
    },
    tryAgain:()=>{
        set(state=>{
            const qBoard=state.qBoard.map(row=>row.map(item=>{
                if(item.default)
                    return item;
                return{default:false,pencilValue:0,value:0};
            }))
            return{...state,qBoard,mistake:0,hints:state.mode.hints,isComplete:false,isPause:false,time:0};
        })
    },
    pauseGame:()=>{
        set(state=>({...state,isPause:!state.isPause}));
    },
    continueGame:()=>{
        set(state=>{
            if(localStorage.getItem('game')){
                const game=JSON.parse(localStorage.getItem('game'));
                return game;
            }
            return state;
        })
    },
    togglePencilMode:()=>{
        set(state=>({...state, pencilMode:!state.pencilMode}))
    },
    changeQBoard: (num) => {
        set(state => {
            if (state.isPause || state.isComplete) return state;
    
            const row = state.selectedCell.row;
            const col = state.selectedCell.col;
    
            if (row === null || col === null) return state; // Ensure a cell is selected
            if (state.qBoard[row][col].default) return state; // Prevent changing default cells
    
            const qBoard = [...state.qBoard]; // Create a shallow copy of qBoard
            let mistake = state.mistake;
            let totalMistakes = state.totalMistakes;
            let isComplete = state.isComplete;
            let win = true;
    
            if (state.pencilMode) {
                // Update pencil value without affecting mistakes
                qBoard[row][col] = { ...qBoard[row][col], pencilValue: num };
            } else {
                // Store the previous value to compare later
                const previousValue = qBoard[row][col].value;
    
                // Update the actual value
                qBoard[row][col] = { ...qBoard[row][col], value: num };
    
                // Increment mistake only if the entered value is incorrect
                if (qBoard[row][col].value !== state.board[row][col]) {
                    if (previousValue === state.board[row][col]) {
                        // Only increment if the previous value was correct
                        if (mistake < totalMistakes) {
                            mistake++;
                        }
                    }
                }
    
                // Check for completion
                qBoard.forEach((r, xrow) => {
                    r.forEach((item, xcol) => {
                        if (item.value !== state.board[xrow][xcol]) {
                            win = false;
                        }
                    });
                });
    
                // Set isComplete if the user has completed the board correctly
                if (win) isComplete = true;
    
                // End the game if mistakes reach the total limit
                if (mistake >= totalMistakes) {
                    isComplete = true; // Mark the game as complete
                    // Optionally, you can also add logic here to notify the user or reset the game
                }
            }
    
            // Return updated state
            return { ...state, qBoard, mistake: Math.min(mistake, totalMistakes), isComplete };
        });
    },
    
    resetQBoard:()=>{
        set(state=>{
            if(state.isPause || state.isComplete)
                return state;
    
            let qBoard=state.qBoard;
            qBoard=qBoard.map(row=>row.map(item=>{
                if(item.default)
                    return item;
                else
                    return{...item,value:0,pencilValue:0};
            }))
            return { ...state, qBoard, mistake: 0, hints: state.mode.hints, isComplete: false };
        })
    },
    quitGame:()=>{
        set(initialState);
    },
    setSelectedCell:(row,col)=>{
        const iRow=Math.floor(row/3)*3;
        const iCol=Math.floor(col/3)*3;
        const squares=[];

        for(let x=iRow;x<iRow+3;x++)
            for(let y=iCol;y<iCol+3;y++)
                squares.push([x,y]);

        set({selectedCell:{row,col,squares}});
    },
    useHint: () => {
        set(state => {
            const row = state.selectedCell.row;
            const col = state.selectedCell.col;
            let qBoard = state.qBoard;
    
            // Check if a cell is selected
            if (row === null || col === null) return state;
    
            // Prevent using a hint if the game is paused, the cell is default, etc.
            if (state.isPause || qBoard[row][col].default || state.isComplete || state.hints <= 0) {
                return state;
            }
    
            // Set the hint value in the qBoard without counting it as a mistake
            qBoard[row][col] = { ...qBoard[row][col], value: state.board[row][col] };
    
            return { ...state, qBoard, hints: state.hints - 1 }; // Decrease the hint count
        });
    },
    
    increaseTime: () => {
        set(state => {
            const newState = { ...state, time: state.time + 1 };
            localStorage.setItem('game', JSON.stringify(newState));
            return newState;
        });
    },
    setState:()=>{},
})

export const useGame =create(persist(gameState,{name: 'board'}))