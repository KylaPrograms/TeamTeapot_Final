/*
 * File:        Ship.js
 * Programmers: Kyla            March 10, 2019
 *
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Ship(spriteTexture, position, size, maxDamage,
                currSpeed, minSpeed, maxSpeed,  turningDelta)
{
    this.mShip = new SpriteRenderable(spriteTexture);
    this.mShip.getXform().setPosition(position[0], position[1]);
    this.mShip.getXform().setSize(size[0], size[1]);
    
    this.mSpeed = (currSpeed === null) ? 0 : currSpeed;
    this.mMinSpeed = (minSpeed === null) ? 0 : minSpeed;
    this.mMaxSpeed = (maxSpeed === null) ? 100 : maxSpeed;
    this.mTurningDelta = (turningDelta === null) ? 1 : turningDelta;
    
    this.mDamage = 0;
    this.mMaxDamage = (maxDamage === null) ? 100 : maxDamage;
    
    GameObject.call(this, this.mShip);
}
gEngine.Core.inheritPrototype(Ship, GameObject);

Ship.prototype.getSpeed = function() { return this.mSpeed; };
Ship.prototype.setSpeed = function(value)
{
    var newSpeed = value;
    if(newSpeed < this.mMinSpeed)
    {
        newSpeed = this.mMinSpeed;
    }
    if(newSpeed > this.mMaxSpeed)
    {
        newSpeed = this.mMaxSpeed;
    }
    this.mSpeed = newSpeed;
};
Ship.prototype.incSpeedBy = function(value) { this.setSpeed(this.mSpeed+value); };

Ship.prototype.getTurningDelta = function() { return this.mTurningDelta; };
Ship.prototype.setTurningDelta = function(value) { this.mTurningDelta = value; };

Ship.prototype.setMinSpeed = function(value)
{
    if(value < this.mMaxSpeed)
    {
        this.mMinSpeed = value;
    }
    else
    {
        this.mMinSpeed = this.mMaxSpeed;
    }
};
Ship.prototype.setMaxSpeed = function(value)
{
    if(value > this.mMinSpeed)
    {
        this.mMaxSpeed = value;
    }
    else
    {
        this.mMaxSpeed = this.mMinSpeed;
    }
};

Ship.prototype.getDamage = function() { return this.mDamage; };
Ship.prototype.setDamage = function(value)
{
    var newDamage = value;
    
    if(newDamage < 0)
    {
        newDamage = 0;
    }
    if(newDamage > this.mMaxDamage)
    {
        newDamage = this.mMaxDamage;
    }
    
    this.mDamage = newDamage;
};
Ship.prototype.incDamageBy = function (value) { this.setDamage(this.mDamage+value); };

Ship.prototype.getShipRenderable = function() { return this.mShip; };

Ship.prototype.getPosition = function() { return this.getXform().getPosition(); };

