/*
 * File:        PirateShip.js
 * Programmers: Jonathan            March 4, 2019
 *              Emily               March 5, 2019
 *              
 *
 */

/* jslint node: true, vars: true */
/* global gEngine: false, GameObject: false, GameObjectSet: false,
 * SpriteAnimateRenderable: false, Storm: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function PopUp(spriteTexture, atX, atY)
{
    this.mPopUp = new SpriteAnimateRenderable(spriteTexture);
    this.mPopUp.getXform().setPosition(atX, atY);
    this.mPopUp.getXform().setSize(7, 8);
    this.mPopUp.setElementPixelPositions(15, 500, 60, 560);
    
    GameObject.call(this, this.mRock);
}
gEngine.Core.inheritPrototype(Rock, GameObject);

Rock.prototype.draw = function (aCamera)
{
    this.mRock.draw(aCamera);
};
