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
    this.kRot1 = Math.random() * 10 + 5;
    this.kSize = Math.random() * 15 + 5;
    this.mGrowStorm = true;

    
    this.mTotalLifeSpan = Math.random() * 1500;
    this.mLifespan = 0;
    
    this.mStorm1 = new SpriteRenderable(spriteTexture);
    this.mStorm1.getXform().setPosition(atX, atY);
    this.mStorm1.getXform().setSize(0.01, 0.01);
    
    this.mMapRenderable = new Renderable();
    this.mMapRenderable.setColor([0, 0, 1.0, 1.0]);
    this.mMapRenderable.getXform().setSize(0.01, 0.01);
    
//    this.mStorm2 = new SpriteRenderable(spriteTexture);
//    this.mStorm2.getXform().setPosition(atX + 5, atY + 5);
//    this.mStorm2.getXform().setSize(8, 8);
//    
//    this.mStorm3 = new SpriteRenderable(spriteTexture);
//    this.mStorm3.getXform().setPosition(atX + 5, atY);
//    this.mStorm3.getXform().setSize(8, 8);
//    
    this.mXdir = Math.random() - 0.5;
    this.mYdir = Math.random() - 0.5;
    
    this.mXdelta = Math.random() * 10;
    this.mYdelta = Math.random() * 10;
    
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
    if(this.mGrowStorm) 
    {
        this.growStorm();
    }
    this.mLifespan++;
    var StormX1 = this.mStorm1.getXform();
    var stormXSpeed = this.mXdir * (this.mXdelta) / 60;
    var stormYSpeed = this.mYdir * (this.mYdelta) / 60;
    
    //Move the Storm object
    StormX1.incXPosBy(stormXSpeed);
    StormX1.incYPosBy(stormYSpeed);
    StormX1.incRotationByDegree(this.kRot1);
    
    this.mMapRenderable.getXform().setPosition(StormX1.getXPos(), StormX1.getYPos());
};

Storm.prototype.growStorm = function ()
{
    var size = this.mStorm1.getXform().getSize();
    var deltaSize = 5 / 60;
    if(size[0] <= this.kSize) {
        this.mStorm1.getXform().setSize(size[0] + deltaSize, size[0] + deltaSize);
        this.mMapRenderable.getXform().setSize(size[0] + deltaSize, size[0] + deltaSize);
    } else {
        this.mGrowStorm = false;
    }
};

Storm.prototype.draw = function (aCamera)
{
    this.mStorm1.draw(aCamera);
//    this.mStorm2.draw(aCamera);
//    this.mStorm3.draw(aCamera);
};

Storm.prototype.drawForMap = function (aCamera)
{
    this.mMapRenderable.draw(aCamera);
//    this.mStorm2.draw(aCamera);
//    this.mStorm3.draw(aCamera);
};

Storm.prototype.isDead = function() 
{
    return (this.mLifespan >= this.mTotalLifeSpan);    
};

Storm.prototype.isOutOfBnds = function() {
    //If the entire object is out of bounds, then yeah it needs to die
    return (this.mPatrolHead.getXform().getXPos() >= 103.75);
};