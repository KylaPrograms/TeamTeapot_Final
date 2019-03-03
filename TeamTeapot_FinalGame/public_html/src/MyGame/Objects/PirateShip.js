/*
 * File:        PirateShip.js
 * Programmers: Kyla            March 1, 2019
 *              
 *
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function PirateShip(spriteTexture)
{
    this.mPirateShip = new SpriteRenderable(spriteTexture);
    this.mPirateShip.getXform().setPosition(100, 0);
    this.mPirateShip.getXform().setSize(4, 8);
    
    // FOR PLACEHOLDER
    this.mPirateShip.setColor([0.75, 0, 0, 1]);
    
    GameObject.call(this, this.mPirateShip);
    
//    var r = new RigidRectangle(this.getXform(), 4, 8);
//    r.setMass(1);
//    r.setVelocity(0, 0);
//    this.setRigidBody(r);
//    this.toggleDrawRigidShape();
    
    this.mSpeed = 30;
    
    this.mChaseInterpolate =
            new InterpolateVec2(this.getXform().getPosition(), 200, 0.05);
    this.mRotateInterpolate =
            new InterpolateVec2(this.getCurrentFrontDir(), 120, 0.5);
}
gEngine.Core.inheritPrototype(PirateShip, GameObject);

PirateShip.prototype.update = function(heroPos)
{
    if(vec2.distance(this.getXform().getPosition(), heroPos) < 20)
    {
        this.chase(heroPos);
    }
};

PirateShip.prototype.chase = function(heroPos)
{
    console.log("Chasing Hero Ship");
//    this.mChaseInterpolate.setFinalValue(heroPos);
//    var interpolateVal = this.mChaseInterpolate.getValue();
//    this.getXform().setPosition(interpolateVal[0], interpolateVal[1]);
//    this.mChaseInterpolate.updateInterpolation();
    var pos = this.getXform().getPosition();
    vec2.lerp(pos, pos, heroPos, 0.05);
};
