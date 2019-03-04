/*
 * File:        PirateShip.js
 * Programmers: Jonathan            March 4, 2019
 *              
 *
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Rock(spriteTexture)
{
    this.mRock = new SpriteRenderable(spriteTexture);
    this.mRock.getXform().setPosition(0, 20);
    this.mRock.getXform().setSize(8, 8);
    
    // FOR PLACEHOLDER
    this.mRock.setColor([1, 1, 1, 1]);
    
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
