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
//    this.mPirateShip = new SpriteRenderable(spriteTexture);
//    this.mPirateShip.getXform().setPosition(50, 0);
//    this.mPirateShip.getXform().setSize(8, 4);
//    
//    // FOR PLACEHOLDER
//    this.mPirateShip.setColor([0.75, 0, 0, 1]);
    
    //GameObject.call(this, this.mPirateShip);
    
    this.kSpeedDelta = 0.05;
    this.mOriginalColor = [0.75, 0, 0, 1];
    
    Ship.call(this, spriteTexture, [50, 0], [8,4], 10, 0, -15, 15, 0.02);
    
}
gEngine.Core.inheritPrototype(PirateShip, Ship);

PirateShip.prototype.update = function(heroPos)
{
    Ship.prototype.update.call(this);
    //console.log(this.getXform().getRotationInRad() + "\n" + this.getCurrentFrontDir());
    
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
    
    // get current pos of ship
    var pos = this.getXform().getPosition();
    
    // get vector between hero and pirateship
    var x = heroPos[0] - pos[0];
    var y = heroPos[1] - pos[1];
    

    
    // get direction pirateship is facing
    var curr = this.getXform().getRotationInRad();
    
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
    
    var r = this.getXform().getRotationInRad();
    this.setVelocity(-this.mSpeed * Math.cos(r), -this.mSpeed * Math.sin(r));
    //this.getRigidBody().incVelocity(-this.mSpeed * Math.cos(r) * .01, -this.mSpeed * Math.sin(r) * .01);
    
    this.getXform().setRotationInRad(curr + rotateBy);
    //this.getXform().incRotationByRad(rotateBy);
    
    //vec2.lerp(pos, pos, moveTowards, 0.2);
};