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

function PopUp(spriteTexture, ElmTop, FirstElmLeft, ElmWidth, ElmHeight, NumElems, WidthPadding, fadeOutTime)
{
    this.mPopUp = new SpriteAnimateRenderable(spriteTexture);
    this.mPopUp.getXform().setPosition(0, 0);
    this.mPopUp.getXform().setSize(10, 10);
    //this.mPopUp.setElementPixelPositions(15, 500, 60, 560);
    this.mPopUp.setSpriteSequence(ElmTop, FirstElmLeft, ElmWidth, ElmHeight, NumElems, WidthPadding);
    this.mPopUp.setAnimationSpeed(2)
    //this.mPopUp.setSpriteSequence(128,0, 100, 100, 61, 0);
    this.mCycles = 0;
    
    this.kAnimLength = NumElems;
    this.kFadeOut = fadeOutTime;
    
    //GameObject.call(this, this.mPopUp);
}
//gEngine.Core.inheritPrototype(PopUp, GameObject);

PopUp.prototype.draw = function (aCamera)
{
    //GameObject.prototype.draw.call(this, aCamera);
    this.mPopUp.draw(aCamera);
};

PopUp.prototype.updatePopUp = function()
{
    this.mCycles++;
    if (this.mCycles < this.kAnimLength)
    {
        this.mPopUp.updateAnimation();
    }
    
}

PopUp.prototype.isPopUpDone = function()
{
    return this.mCycles > this.kFadeOut;
}

PopUp.prototype.getXform = function()
{
    return this.mPopUp.getXform();
}
