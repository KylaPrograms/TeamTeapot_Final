/*
 * File:        SunkenTreasureSet.js
 * Programmers: Kyla            March 14, 2019
 *              
 *
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SunkenTreasureSet(spriteTexture, spawnPosSet)
{
    GameObjectSet.call(this);
    
    this.kTreasureTex = spriteTexture;
    this.mSpawnPosSet = spawnPosSet;
    
    for(var i = 0; i < 7; i++)
    {
        this._createTreasure();
    }
    
}
gEngine.Core.inheritPrototype(SunkenTreasureSet, GameObjectSet);

SunkenTreasureSet.prototype._createTreasure = function()
{
    var skip = true;
    var index = 0;
    while(skip)
    {
        var index = Math.floor(Math.random() * (this.mSpawnPosSet.length - 1));
        console.log(index);
        if(!this.mSpawnPosSet[index].inUse())
        {
            skip = false;
        }
    }
    
    this.mSpawnPosSet[index].markInUse();
    var newTreasure = new SunkenTreasure(this.kTreasureTex, this.mSpawnPosSet[index].getPosition());
    this.addToSet(newTreasure);
    
};

SunkenTreasureSet.prototype.update = function () {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        if(this.mSet[i].update())
        {
            this.removeFromSet(this.mSet[i]);
        }
    }
};

SunkenTreasureSet.prototype.collectAt = function(atX, atY)
{
    var treasureFound = false;
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        var bBox = this.mSet[i].getBBox();
        if(bBox.containsPoint(atX, atY))
        {
            this.mSet[i].collect();
            treasureFound = true;
        }
    }
    
    return treasureFound;
};

SunkenTreasureSet.prototype.drawForMap = function(aCamera)
{
    for (var i = 0; i < this.mSet.length; i++)
    {
        this.mSet[i].drawForMap(aCamera);
    }
};