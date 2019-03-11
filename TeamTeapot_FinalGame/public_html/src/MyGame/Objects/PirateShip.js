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

function PirateShip(spriteTexture, wakeTexture)
{    
    //GameObject.call(this, this.mPirateShip);
    
    this.kSpeedDelta = 0.05;
    this.mOriginalColor = [0.75, 0, 0, 1];
    
    Ship.call(this, spriteTexture, [50, 0], [5, 12], 10, 0, -15, 15, .02, wakeTexture);
    
    this.mOriginalColor = [1, 1, 1, 0];
    this.mShip.setColor(this.mOriginalColor);
    
    this.mShip.setElementPixelPositions(53, 256, 0, 512);
    
    this.mMapRenderable = new Renderable();
    this.mMapRenderable.setColor([0, 0, 0, 1.0]);
    this.mMapRenderable.getXform().setSize(8, 8);
    this.mMapRenderable.getXform().setPosition(this.getXform().getXPos(), 
                                                        this.getXform().getYPos());
                                                        
    this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(PirateShip, Ship);

PirateShip.prototype.update = function(heroPos)
{
    Ship.prototype.update.call(this);
    //console.log(this.getXform().getRotationInRad() + "\n" + this.getCurrentFrontDir());
    
    //this.getXform().setRotationInRad(Math.PI / 2)
    
    var direction = .1 * ((this.getRigidBody().getAngularVelocity() < 0) ? 1 : -1);
    this.getRigidBody().setAngularVelocityDelta(direction);
    
    if(vec2.distance(this.getXform().getPosition(), heroPos) < 50)
    {
        this.chase(heroPos);
    }
};

PirateShip.prototype.chase = function(heroPos)
{
    //console.log("Chasing Hero Ship");
    this.incSpeedBy(this.kSpeedDelta);
    
    var currXform = this.getXform();
    // get current pos of ship
    var pos = currXform.getPosition();
    
    // get vector between hero and pirateship
    var x = heroPos[0] - pos[0];
    var y = heroPos[1] - pos[1];
    

    
    // get direction pirateship is facing
    var curr = currXform.getRotationInRad() + Math.PI / 2;
    
    var facing = [Math.cos(curr), Math.sin(curr)];
    //console.log(facing, [x,y]);
    
    // get cross product to see which direction to turn
    vec2.cross(facing, [Math.cos(curr), Math.sin(curr)], [x,y]);
    
    //console.log(this.getTurningDelta());
    
    var rotateBy = this.getTurningDelta();
    if (facing[2] > 0)  // if pirate is on left side, rotate left;
        rotateBy *= -1;
  
    
    //this.setVelocity(this.mSpeed * Math.cos(theta), this.mSpeed * Math.sin(theta));
    //var dir = this.getCurrentFrontDir();
    //vec2.rotate(dir, dir, rotateBy);
    
    var r = this.getXform().getRotationInRad() + Math.PI / 2;
    this.setVelocity(-this.mSpeed * Math.cos(r), -this.mSpeed * Math.sin(r));
    //this.getRigidBody().incVelocity(-this.mSpeed * Math.cos(r) * .01, -this.mSpeed * Math.sin(r) * .01);
    
    this.getXform().setRotationInRad(curr + rotateBy - Math.PI / 2);
    //this.getXform().incRotationByRad(rotateBy);
    
    this.mMapRenderable.getXform().setPosition(currXform.getXPos(), currXform.getYPos());    
};

PirateShip.prototype.drawForMap = function(aCamera)
{
    this.mMapRenderable.draw(aCamera);
};