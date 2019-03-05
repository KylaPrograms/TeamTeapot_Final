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

function Rock(spriteTexture)
{
    this.mRock = new SpriteRenderable(spriteTexture);
    this.mRock.getXform().setPosition(0, 20);
    this.mRock.getXform().setSize(7, 8);
    this.mRock.setElementPixelPositions(15, 500, 60, 560);
    
    // FOR PLACEHOLDER
    this.mRock.setColor([1, 1, 1, 0]);
    
    GameObject.call(this, this.mRock);
    
    var rb = new RigidRectangle(this.getXform(), this.getXform().getWidth(), this.getXform().getHeight());
    this.setRigidBody(rb);
    rb.setMass(100);
}
gEngine.Core.inheritPrototype(Rock, GameObject);

Rock.prototype.draw = function (aCamera)
{
    this.mRock.draw(aCamera);
};
