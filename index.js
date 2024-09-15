import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { saveData } from './savefile.js';
const rl = readline.createInterface({ input, output });
const intro = `Welcome to the Number Guessing Game!
I'm thinking of a number between 1 and 100.
You have 5 chances to guess the correct number.

Please select the difficulty level:
1. Easy (10 chances)
2. Medium (5 chances)
3. Hard (3 chances)
`;
const diffChances = {
    1:10,
    2:5,
    3:3,
};
const diffName = ["Easy","Medium","Hard"];
let gameCount = 0;
let answerNum = -1;
let gameMode = diffName[0];
startGame();

async function startGame(){
    let gameContinue = true;
    let start = true;
    while(gameContinue){
        //Setting up the game
        if(start){
            await gameInitialize();
            start = false;
        }

        //guessing the number
        const gameResult = await gamePlay();
        
        //checking the result
        await resultChecker(gameResult);
        
        // End of the round
        gameContinue = await replay();
        start = true;
    }
    rl.close();
}

async function resultChecker(gameResult) {
    if(gameResult.success){
        console.log(`Congratulations!! You guessed the correct number in ${gameResult.guessCount} attempts. (Time: ${gameResult.totalTime} seconds)\n`);
        saveData.save(gameResult);
    }else{
        console.log("You guess chances run out. Game Over!!!\n");
    }
}

async function replay() {
    const replayChoice = await getInput(
        "Do you want to play again? Enter (Q/q) to quit and (Y/y) to continue: ",
        "Invalid input. Enter (Q/q) to quit and (Y/y) to continue: ",
        (char)=> {
            let inputChar = (char || "").toLowerCase();
            return !(inputChar=="q" || inputChar == "y");
        }
    );
    
    return replayChoice.toLowerCase() == "y";
}


// Running the game
async function gamePlay() {
    let guessNum = -1;
    let guessCount = 0;
    let guessCorrect = false;
    const startTime = performance.now();
    for(let i=0;i<gameCount;i++){
        guessNum = await getInput(
            "Enter your guess: ",
            "Your guess should be a number. Enter a number again: ",
            (num)=> isNaN(Number(num))
        );
        guessNum = Number(guessNum);
        guessCount +=1;
        if(guessNum == answerNum){
            guessCorrect = true;
            break;
        }
        console.log(`Incorrect! The number is ${answerNum>guessNum?"greater":"less"} than ${guessNum}.\n`);
    }
    const endTime = performance.now();
    return {
        guessCount: guessCount,
        totalTime : Math.floor((endTime - startTime)/1000),
        success: guessCorrect,
        gameMode: gameMode
    };
}

// Cofigure game difficulty, answer number
async function gameInitialize() {
    answerNum = Math.floor(Math.random() * 101);
    console.log(intro);
    let diffChoice = await getInput(
        "Enter your choice: ",
        "InCorrect choice for diffculty.Please enter again : ",
        (choiceNum)=> !diffChances[choiceNum] 
    );
    diffChoice = Number(diffChoice);
    gameMode = diffName[diffChoice-1];
    console.log(`\nGreat! You have selected the ${gameMode} difficulty level.\nLet's start the game!\n`);
    gameCount = diffChances[diffChoice]
}

//get input and evaluate
async function getInput(message,tryAgainMessage,checker){
    let answer = await rl.question(message);
    while(checker(answer)){
        answer = await rl.question(tryAgainMessage);
    }
    return answer;
}







