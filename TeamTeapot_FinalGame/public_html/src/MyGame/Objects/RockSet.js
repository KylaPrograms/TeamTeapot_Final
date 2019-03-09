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

function RockSet()
{
    this.mSet = [];
    this.mRockSize = 0;
}

gEngine.Core.inheritPrototype(RockSet, GameObjectSet);

RockSet.prototype.createRock = function (spriteTexture)
{
    var xspawn = -50 + Math.random() * 300;
    var yspawn = -50 + Math.random() * 300;
    var rock = new Rock(spriteTexture, xspawn, yspawn);
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
