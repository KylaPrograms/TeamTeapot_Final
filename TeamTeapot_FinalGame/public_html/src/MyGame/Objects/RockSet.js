/*
 * File:        RockSet.js
 * Programmers: Emily           March 2, 2019
 *
 */

/* jslint node: true, vars: true */
/* global gEngine: false, GameObject: false, GameObjectSet: false,
 * SpriteAnimateRenderable: false, Rock: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function RockSet(kTexture)
{
    this.mSet = [];
    this.mRockSize = 0;
    this.kRockTexture = kTexture;
    for (var i = 0; i < 10; i++)
    {
        this.createRock();
    }
}

gEngine.Core.inheritPrototype(RockSet, GameObjectSet);

RockSet.prototype.createRock = function ()
{
    var xspawn = -160 + Math.random() * 300;
    var yspawn = -160 + Math.random() * 300;
    var rock = new Rock(this.kRockTexture, xspawn, yspawn);
    rock.getXform().setRotationInRad(Math.random() * 2 * Math.PI);
    
    var scale = Math.random() * .5;
    var newSize = rock.getXform().getSize();
    newSize[0] = newSize[0] * scale + newSize[0] * .75;
    newSize[1] = newSize[1] * scale + newSize[1] * .75;
    
    rock.getXform().setSize(newSize[0], newSize[1]);
    this.addToSet(rock);
    this.mRockSize++;
};

RockSet.prototype.addToSet = function (obj)
{
    this.mSet.push(obj);

};

RockSet.prototype.getRockSize = function()
{
    return this.mRockSize;
};

RockSet.prototype.drawForMap = function (aCamera)
{
    for (var i = 0; i < this.mSet.length; i++)
    {
        this.mSet[i].drawForMap(aCamera);
    }
};