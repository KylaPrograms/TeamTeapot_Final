/*
 * File:        Storm.js
 * Programmers: Kyla            March 1, 2019
 *              Emily           March 2, 2019
 *
 */

/* jslint node: true, vars: true */
/* global gEngine: false, GameObject: false, GameObjectSet: false,
 * SpriteAnimateRenderable: false, Storm: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Storm(spriteTexture, atX, atY)
{
    this.kSpeedDelta = 0.002; // use 0.05 when using rigid body, 0.002 when not
    this.kRot = Math.random() * 45;
    
    this.mTotalLifeSpan = Math.random() * 2000;
    this.mLifespan = 0;
    
    this.mStorm = new SpriteRenderable(spriteTexture);
    this.mStorm.getXform().setPosition(atX, atY);
    this.mStorm.getXform().setSize(4, 8);
    
    // FOR PLACEHOLDER
    this.mStorm.setColor([0.42, 0.2, 0.9, 1]);
    
    this.mXdir = Math.random() - 0.5;
    this.mYdir = Math.random() - 0.5;
    
    if(this.mXdir > 0) {
        this.mXdir = 1;
    } else {
        this.mXdir = -1;
    }
    if(this.mYdir > 0) {
        this.mYdir = 1;
    } else {
        this.mYdir = -1;
    }
    
    GameObject.call(this, this.mStorm);
    
//    var r = new RigidRectangle(this.getXform(), 4, 8);
//    r.setMass(1);
//    r.setVelocity(0, 0);
//    this.setRigidBody(r);
//    this.toggleDrawRigidShape();
    
    this.mSpeed = 0;
}

gEngine.Core.inheritPrototype(Storm, GameObject);

Storm.prototype.update = function () 
{
    this.mLifespan++;
    var StormX = this.mStorm.getXform();
    var stormXSpeed = this.mXdir * (Math.random() * 10) / 60;
    var stormYSpeed = this.mYdir * (Math.random() * 10) / 60;
    
    //Move the Storm object
    StormX.incXPosBy(stormXSpeed);
    StormX.incYPosBy(stormYSpeed);
    StormX.incRotationByDegree(this.kRot);
};

Storm.prototype.draw = function (aCamera)
{
    this.mStorm.draw(aCamera);
};

Storm.prototype.isDead = function() 
{
    return (this.mLifespan >= this.mTotalLifeSpan);    
};

Storm.prototype.isOutOfBnds = function() {
    //If the entire object is out of bounds, then yeah it needs to die
    return (this.mPatrolHead.getXform().getXPos() >= 103.75);
};