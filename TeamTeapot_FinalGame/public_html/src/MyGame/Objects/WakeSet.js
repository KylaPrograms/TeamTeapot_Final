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
    var xPos = xform.getPosition()[0]-(xform.getSize()[0]/2);
    var yPos = xform.getPosition()[1]-(xform.getSize()[1]/2);
    var theta = Math.atan2(ship.getCurrentFrontDir()[1], ship.getCurrentFrontDir()[0]);
    theta -= 45;
    var forward = [-Math.cos(theta), -Math.sin(theta)];
    
    var leftWake = new Wake(sprite, [xPos, yPos], size, forward, speed);
    
    this.addToSet(leftWake);
    
    xPos = xform.getPosition()[0]+(xform.getSize()[0]/2);
    yPos = xform.getPosition()[1]-(xform.getSize()[1]/2);
    theta = Math.atan2(ship.getCurrentFrontDir()[1], ship.getCurrentFrontDir()[0]);
    theta += 45;
    forward = [-Math.cos(theta), -Math.sin(theta)];
    
    var rightWake = new Wake(sprite, [xPos, yPos], size, forward, speed);
    
    this.addToSet(rightWake);
};