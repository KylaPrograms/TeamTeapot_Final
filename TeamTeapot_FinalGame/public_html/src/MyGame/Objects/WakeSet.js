/*
 * File:        WakeSet.js
 * Programmers: Kyla            March 10, 2019
 *
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function WakeSet()
{
    GameObjectSet.call(this);
}
gEngine.Core.inheritPrototype(WakeSet, GameObjectSet);

WakeSet.prototype.update = function()
{
    for(var i = 0; i < this.size(); i++)
    {
        this.mSet[i].update();
        if(this.mSet[i].isDead())
        {
            this.mSet.splice(i, 1);
            console.log("wake died");
        }
    }
};

WakeSet.prototype.createWakeFromShip = function(ship, sprite, size, speed)
{
    var xform = ship.getXform();
    
    ///////////////
    // LEFT WAKE //
    ///////////////
    
    var xPos = xform.getPosition()[0]-(xform.getSize()[0]/2);
    var yPos = xform.getPosition()[1]-(xform.getSize()[1]/2);
    
    // Get vector
    var newPos = [xPos - xform.getPosition()[0], yPos - xform.getPosition()[1]];
    
    // Get current rotation of ship
    var theta = xform.getRotationInRad() - Math.PI;
    
    // Rotate to correct spot
    vec2.rotateWRT(newPos, newPos, theta , [0,0]);

    // move vector to behind ship
    vec2.add(newPos, newPos, xform.getPosition());
    theta += Math.PI / 4;
    var forward = [-Math.cos(theta), -Math.sin(theta)];
    
    var leftWake = new Wake(sprite, newPos, size, forward, speed);
    leftWake.getXform().setRotationInRad(theta);
    
    this.addToSet(leftWake);
    
    ////////////////
    // RIGHT WAKE //
    ////////////////
    
    xPos = xform.getPosition()[0]+(xform.getSize()[0]/2);
    yPos = xform.getPosition()[1]-(xform.getSize()[1]/2);
    
    // Get vector
    newPos = [xPos - xform.getPosition()[0], yPos - xform.getPosition()[1]];
    theta = xform.getRotationInRad() - Math.PI;
    
    // Rotate to current spot
    vec2.rotateWRT(newPos, newPos, theta, [0,0]);
    
    // move vector to behind ship
    vec2.add(newPos, newPos, xform.getPosition());
    
    theta -= Math.PI / 4;
    forward = [-Math.cos(theta), -Math.sin(theta)];
    
    var rightWake = new Wake(sprite, newPos, size, forward, speed);
    rightWake.getXform().setRotationInRad(theta);
    
    this.addToSet(rightWake);
};