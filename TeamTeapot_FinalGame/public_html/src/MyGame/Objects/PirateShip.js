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
    
    Ship.call(this, spriteTexture, [50, 0], [8,4], 10, 0, 0, 20, 0.02);
    
//    var r = new RigidRectangle(this.getXform(), 4, 8);
//    r.setMass(1);
//    r.setVelocity(0, 0);
//    this.setRigidBody(r);
//    this.toggleDrawRigidShape();
    
}
gEngine.Core.inheritPrototype(PirateShip, Ship);

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
    
    // get current pos of ship
    var pos = this.getXform().getPosition();
    
    // get vector between hero and pirateship
    var x = heroPos[0] - pos[0];
    var y = heroPos[1] - pos[1];
    
    // get angle of rotation between pirateship and hero
    var theta = Math.atan2(y,x);
    
    // get direction pirateship is facing
    var curr = this.getXform().getRotationInRad();
    
    var facing = [];
    
    // get cross product to see which direction to turn
    vec2.cross(facing, [Math.cos(curr), Math.sin(curr)], [x,y]);
    
    //console.log(this.getTurningDelta());
    
    var rotateBy = this.getTurningDelta();
    if (facing[2] < 0)  // if pirate is on left side, rotate left;
        rotateBy *= -1;
    
    // rotate pirateship towards hero
    this.getXform().incRotationByRad(rotateBy);
    
    // move pirate ship forward in the new direction
    var moveTowards = [pos[0] +  Math.cos(curr), pos[1] + Math.sin(curr)];
    vec2.lerp(pos, pos, moveTowards, 0.2);
};