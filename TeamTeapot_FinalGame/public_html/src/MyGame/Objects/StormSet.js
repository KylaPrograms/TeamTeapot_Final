/*
 * File:        StormSet.js
 * Programmers: Emily           March 2, 2019
 *
 */

/* jslint node: true, vars: true */
/* global gEngine: false, GameObject: false, GameObjectSet: false,
 * SpriteAnimateRenderable: false, Storm: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function StormSet(spriteTexture, xRange, yRange, shipPosition)
{
    this.kStormTex = spriteTexture;
    this.mSet = [];
    this.mStormSize = 0;
    this.mTotalStorms = 50;
    this.mOffsetX = xRange / 2;
    this.mOffsetY = yRange / 2;
    this.mBoundCenter = shipPosition.getXform().getPosition();
    
    //this.mBoundCenter[0] = center[0];
    //this.mBoundCenter[1] = shipPosition.getXform().getYPos();
    
    this.mStormSpawnTimer = 60;
    this.mTimer = 0;
}

gEngine.Core.inheritPrototype(StormSet, GameObjectSet);

StormSet.prototype.createStorm = function (spriteTexture)
{
    //For now I am hardcoding the size of our world to be 300 WC X 300 WC
    var xspawn = -50 + Math.random() * 100;
    var yspawn = -50 + Math.random() * 100;
    var randomizer = Math.floor(Math.random() + 0.5);
    
    if(xspawn >= (this.mBoundCenter[0] - this.mOffsetX) && xspawn <= (this.mBoundCenter[0] + this.mOffsetX)) 
    {
        //It is within the visible area
        if(randomizer === 1) {
            xspawn = this.mBoundCenter[0] + this.mOffsetX + 8; //The max size of the storms is 8.
        } else {
            xspawn = this.mBoundCenter[0] - this.mOffsetX - 8; //The max size of the storms is 8.
        }
    }
    if(yspawn >= (this.mBoundCenter[1] - this.mOffsetY) && yspawn <= (this.mBoundCenter[1] + this.mOffsetY)) 
    {
        //It is within the visible area
        if(randomizer === 1) {
            yspawn = this.mBoundCenter[1] + this.mOffsetY + 8; //The max size of the storms is 8.
        } else {
            yspawn = this.mBoundCenter[1] + this.mOffsetY + 8; //The max size of the storms is 8.
        }
    }
    var storm = new Storm(spriteTexture, xspawn, yspawn);
    this.addToSet(storm);
    this.mStormSize++;
};

//StormSet.prototype.addToSet = function (obj)
//{
//    this.mSet.push(obj);
//};

StormSet.prototype.update = function()
{
    //Update timer
    this.mTimer++;
    this.mStormSpawnTimer--;
    
    // Spawn the storms
    if(this.mStormSpawnTimer <= 0)
    {
        this.mStormSpawnTimer = Math.random() * 60 + 120;
        if(this.mStormSize < this.mTotalStorms) {
            this.createStorm(this.kStormTex);
        } 
    }

    //Lastly update all storms
    var i;
    for (i = 0; i < this.mSet.length; i++)
    {
        //First update the object
        this.mSet[i].update();
        
        if (this.mSet[i].isDead())
        {
            this.mStormSize--;
            this.mSet.splice(i, 1);
            i--;
        }
    }
};

StormSet.prototype.getStormSize = function()
{
    return this.mStormSize;
};