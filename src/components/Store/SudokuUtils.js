import { Pencil } from "lucide-react";

export const MODES={
    veryEasy:{key:"veryEasy",name:"Very Easy",value:[15,25],mistakes:5,hints:6},
    easy:{key:"easy",name:"Easy",value:[25,35],mistakes:4,hints:5},
    medium:{key:"medium",name:"Medium",value:[35,45],mistakes:3,hints:4},
    hard:{key:"hard",name:"Hard",value:[50,60],mistakes:2,hints:3},
    extreme:{key:"extreme",name:"Extreme",value:[60,75],mistakes:2,hints:2},
}

export function generateRandom(min,max){
    min=Math.ceil(min);
    max=Math.floor(max);
    return Math.floor(Math.random()*(max-min+1)+min);
}

export function isSafe(board,row,col,num){
    for(let x=0;x<9;x++){
        if(board[row][x]==num||board[x][col]==num){
            return false;
        }

    }
    const iRow=Math.floor(row/3)*3;
    const iCol=Math.floor(col/3)*3;

    for(let x=iRow;x<iRow+3;x++){
        for(let y=iCol;y<iCol+3;y++){
            if(board[x][y]==num)
                return false;
        }
    }

    return true;
}

export function generateSudoku(board, randomArray){
    for(let row=0;row<9;row++){
        for(let col=0;col<9;col++){
            if(board[row][col]==0){
                for(let num of randomArray){
                    if(isSafe(board,row,col,num)){
                        board[row][col]=num;
                        if(generateSudoku(board,randomArray)){
                            return true;
                        }
                        board[row][col]=0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

export function removeCells(board,no){
    for(let x=0;x<no;x++){
        const row = generateRandom(1,9)-1;
        const col = generateRandom(1,9)-1;

        board[row][col]=0;
    }
}

export function sudoku(mode){
    const no_of_cell=generateRandom(MODES[mode].value[0],MODES[mode].value[1]);
    let solvedBoard=Array.from({length:9},()=>Array(9).fill(0));
    let randomArray=[];

    while(1){
        if(randomArray.length==9)
            break;

        const num=generateRandom(1,9);
        
        if(!randomArray.includes(num)){
            randomArray.push(num);
        }
    }

    generateSudoku(solvedBoard,randomArray);

    let unSolvedBoard=solvedBoard.map(row=>row.map(num=>num))

    removeCells(unSolvedBoard,no_of_cell);

    unSolvedBoard=unSolvedBoard.map(row=>{
        return row.map(num=>{
            if(!num==0){
                return{value:num,default:true,pencilValue:0};
            }
            return{value:0,default:false,pencilValue:0};
        })
    })
    return{solvedBoard,unSolvedBoard};
}