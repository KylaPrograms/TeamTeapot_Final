/*
 * File:        RockSet.js
 * Programmers: Emily           March 2, 2019
 *              Kyla            March 10, 2019
 *
 */

/* jslint node: true, vars: true */
/* global gEngine: false, GameObject: false, GameObjectSet: false,
 * SpriteAnimateRenderable: false, Rock: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function RockSet(spriteTexture)
{
    this.kRockTex = spriteTexture;
    
    GameObjectSet.call(this);
    
    for (var i = 0; i < 10; i++)
    {
        this._createRock();
    }
}

gEngine.Core.inheritPrototype(RockSet, GameObjectSet);

RockSet.prototype._createRock = function ()
{
    var xspawn = -160 + Math.random() * 300;
    var yspawn = -160 + Math.random() * 300;
    var rock = new Rock(this.kRockTex, xspawn, yspawn);
    rock.getXform().setRotationInRad(Math.random() * 2 * Math.PI);
    
    var scale = Math.random() * .5;
    var newSize = rock.getXform().getSize();
    newSize[0] = newSize[0] * scale + newSize[0] * .75;
    newSize[1] = newSize[1] * scale + newSize[1] * .75;
    
    rock.getXform().setSize(newSize[0], newSize[1]);
    this.addToSet(rock);
};

RockSet.prototype.getRockSet = function ()
{
    return this.mSet;
};

RockSet.prototype.drawForMap = function (aCamera)
{
    for (var i = 0; i < this.mSet.length; i++)
    {
        this.mSet[i].drawForMap(aCamera);
    }
};
