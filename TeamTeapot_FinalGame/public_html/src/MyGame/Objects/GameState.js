/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function GameState(mainHero) 
{
    this.mTreasureCollected = 0;
    this.mHero = mainHero;
    this.mGameOver = false;
    this.mTimer = 0;
}

GameState.prototype.update = function()
{
    //Update timer
    this.mTimer++;
    
    if(this.isGameOver()) 
    {
        gEngine.GameLoop.stop();
    }
    if(this.mHero.getDamage() >= 100) 
    {
        this.setGameOver(true);
    }
    if((this.mTimer % 60) === 0) 
    {
        this.mHero.regenDamage();
    }
};

GameState.prototype.displayStatus = function() 
{
    var status = "Damage: " + this.mHero.getDamage() + "  Treasure: " 
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

// Takes in a boolean and sets it to be the value of the 
GameState.prototype.setGameOver = function(gameStatus) {
    this.mGameOver = gameStatus;
};