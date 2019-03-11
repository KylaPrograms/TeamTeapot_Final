/*
 * File:        SunkenTreasureSet.js
 * Programmers: Kyla            March 10, 2019
 *              
 *
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SunkenTreasureSet()
{
    GameObjectSet.call(this);
}
gEngine.Core.inheritPrototype(SunkenTreasureSet, GameObjectSet);

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