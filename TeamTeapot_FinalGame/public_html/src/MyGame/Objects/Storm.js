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

Storm.prototype.update = function () {
    var headX = this.mPatrolHead.getXform();
    var headXSpeed = this.mXdir * (Math.random() * 5 + 5) / 60;
    var headYSpeed = this.mYdir * (Math.random() * 5 + 5) / 60;
    
    //Move the Brain object
    headX.incXPosBy(headXSpeed);
    headX.incYPosBy(headYSpeed);
    
    //Do not let it get out of bounds
    if(headX.getXPos() > 96.25  || headX.getXPos() < -96.25) {
        this.mXdir = -this.mXdir;
    }
    if(headX.getYPos() > 96.25  || headX.getYPos() < -96.25) {
        this.mYdir = -this.mYdir;
    }
};

Storm.prototype.draw = function (aCamera) {
    this.mPatrolHead.draw(aCamera);
    this.mPatrolWingTop.draw(aCamera);
    this.mPatrolWingBot.draw(aCamera);
};

Storm.prototype.isDead = function() { // change
    return this.isAlphaDead() || this.isOutOfBnds();
    
};

Storm.prototype.isOutOfBnds = function() {
    //If the entire object is out of bounds, then yeah it needs to die
    return (this.mPatrolHead.getXform().getXPos() >= 103.75);
};