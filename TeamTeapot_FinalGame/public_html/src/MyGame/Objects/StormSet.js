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

function StormSet()
{
    this.mSet = [];
    this.mStormSize = 0;
}

gEngine.Core.inheritPrototype(StormSet, GameObjectSet);

StormSet.prototype.createStorm = function (spriteTexture)
{
    var xspawn = Math.random() * 100;
    var yspawn = -50 + Math.random() * 100;
    var storm = new Storm(spriteTexture, xspawn, yspawn);
    this.addToSet(storm);
    this.mStormSize++;
};

StormSet.prototype.addToSet = function (obj)
{
    this.mSet.push(obj);
};

StormSet.prototype.update = function()
{
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

StormSet.prototype.getPatrol1Size = function()
{
    return this.mPatrol1Size;
};