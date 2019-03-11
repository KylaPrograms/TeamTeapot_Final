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
    var currXform = this.mPirateShip.getXform();
    currXform.setPosition(50, 0);
    currXform.setSize(8, 4);
    
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
            new InterpolateVec2(this.getXform().getPosition(), 200, 0.005);
    this.mRotateInterpolate =
            new InterpolateVec2(this.getCurrentFrontDir(), 120, 0.5);
    
    this.mMapRenderable = new Renderable();
    this.mMapRenderable.setColor([0, 0, 0, 1.0]);
    this.mMapRenderable.getXform().setSize(8, 8);
    this.mMapRenderable.getXform().setPosition(currXform.getXPos(), 
                                                        currXform.getYPos());
}
gEngine.Core.inheritPrototype(PirateShip, GameObject);

PirateShip.prototype.update = function(heroPos)
{
    if(vec2.distance(this.getXform().getPosition(), heroPos) < 50)
    {
        this.chase(heroPos);
    }
};

PirateShip.prototype.chase = function(heroPos)
{
    //console.log("Chasing Hero Ship");
    var currXform = this.mPirateShip.getXform();
    // get current pos of ship
    var pos = currXform.getPosition();
    
    // get vector between hero and pirateship
    var x = heroPos[0] - pos[0];
    var y = heroPos[1] - pos[1];
    
    // get angle of rotation between pirateship and hero
    var theta = Math.atan2(y,x);
    
    // get direction pirateship is facing
    var curr = currXform.getRotationInRad();
    
    var facing = [];
    
    // get cross product to see which direction to turn
    vec2.cross(facing, [Math.cos(curr), Math.sin(curr)], [x,y]);
    
    var rotateBy = .02;
    if (facing[2] < 0)  // if pirate is on left side, rotate left;
        rotateBy *= -1;
    
    // rotate pirateship towards hero
    currXform.incRotationByRad(rotateBy);
    
    // move pirate ship forward in the new direction
    var moveTowards = [pos[0] +  Math.cos(curr), pos[1] + Math.sin(curr)];
    vec2.lerp(pos, pos, moveTowards, 0.2);
    
    this.mMapRenderable.getXform().setPosition(currXform.getXPos(), currXform.getYPos());
    
};

PirateShip.prototype.drawForMap = function(aCamera)
{
    this.mMapRenderable.draw(aCamera);
};