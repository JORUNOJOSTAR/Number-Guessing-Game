import fs from "node:fs";
const fileDir ="./gamehist";
const fileName = "gameData";
if (!fs.existsSync(fileDir)){
    fs.mkdirSync(fileDir);
}


function addData(data,file){
    let success = true;
    try{
        fs.writeFileSync(file,data);
    }catch(err){
        console.log(err);
        console.log("Erro Occur while saving file.");
        success = false;
    }
    
    return success;
}

function readData(){
    let data = {};
    try{
        data = fs.readFileSync(`./${fileDir}/${fileName}.json`);
    }catch(err){
        data = {
            Easy:{},
            Medium:{},
            Hard: {}
        };
        data = JSON.stringify(data);
    }
    
    return JSON.parse(data);
}


export class saveData{
    
    static save(gameResult){
        const data = readData();
        // data from game result
        const gameMode = gameResult.gameMode;
        const gameCount = gameResult.guessCount;
        const gameTime = gameResult.totalTime;

        // history game data
        const highScoreCount = data[gameMode]["highScoreCount"] || ( gameCount + 1);
        const highScoreTime = data[gameMode]["highScoreTime"] || (gameTime + 1);

        if(gameCount<highScoreCount){
            data[gameMode]["highScoreCount"] = gameCount;
            console.log("You beat your highScore in guess attempts!!!!!!");
        }
        if(gameTime<highScoreTime){
            data[gameMode]["highScoreTime"] = gameTime;
            console.log("You beat your highScore in times take to guess!!!!");
        }

        console.log("\n");
        
        if(!addData(JSON.stringify(data),`./${fileDir}/${fileName}.json`)){
            console.log("Error occurs when saving your high Score.");
        };
    }
};