/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function GameState(mainHero) 
{
    this.mTreasureCollected = 0;
    this.mHealth = mainHero.getHealth();
    this.mGameOver = false;
}

GameState.prototype.update = function()
{
    if(isGameOver()) {
        gEngine.GameLoop.stop();
    }
    if(this.mHealth === 0) {
        setGameOver(true);
    }
};

GameState.prototype.displayStatus = function() 
{
    var status = "Health: " + this.mHealth + " Treasure: " 
            + this.mTreasureCollected;
    return status;
};

GameState.prototype.addTreasure = function() 
{
    this.mTreasureCollected++;
};

// Returns a boolean to tell whether the game is over
GameState.prototype.isGameOver = function() 
{
    return this.mGameOver;
};

GameState.prototype.setGameOver = function(gameStatus) {
    this.mGameOver = gameStatus;
};