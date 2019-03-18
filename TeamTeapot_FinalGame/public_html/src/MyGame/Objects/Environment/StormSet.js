/*
 * File:        StormSet.js
 * Programmers: Emily           March 2, 2019
 *              Kyla            March 13, 2019
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
    this.mTotalStorms = 50;
    this.mOffsetX = xRange / 2 + 5;
    this.mOffsetY = yRange / 2 + 5;
    this.mBoundCenter = shipPosition.getXform().getPosition();
    
    this.mStormSpawnTimer = 60;
    this.mTimer = 0;
    GameObjectSet.call(this);
}

gEngine.Core.inheritPrototype(StormSet, GameObjectSet);

StormSet.prototype.createStorm = function (spriteTexture)
{
    //For now I am hardcoding the size of our world to be 300 WC X 300 WC
    var xspawn = -150 + Math.random() * 300;
    var yspawn = -150 + Math.random() * 300;
    var randomizer = Math.floor(Math.random() + 0.5);

    var storm = new Storm(spriteTexture, xspawn, yspawn);
    this.addToSet(storm);
};

StormSet.prototype.update = function()
{
    //Update timer
    this.mTimer++;
    this.mStormSpawnTimer--;
    
    // Spawn the storms
    if(this.mStormSpawnTimer <= 0)
    {
        this.mStormSpawnTimer = Math.random() * 60 + 120;
        if(this.size() < this.mTotalStorms) {
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
            this.mSet.splice(i, 1);
            i--;
        }
    }
};

StormSet.prototype.drawForMap = function(aCamera)
{
    for (var i = 0; i < this.mSet.length; i++)
    {
        this.mSet[i].drawForMap(aCamera);
    }
};
