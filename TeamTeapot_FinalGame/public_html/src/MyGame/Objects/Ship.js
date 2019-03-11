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

function Ship(spriteTexture, position, size, currSpeed, minSpeed, maxSpeed,
                speedDelta, turningDelta)
{
    this.mShip = new SpriteRenderable(spriteTexture);
    this.mShip.getXform().setPosition(position[0], position[1]);
    this.mShip.getXform().setSize([size[0], size[1]]);
    
    this.mSpeed = (currSpeed === null) ? 0 : currSpeed;
    this.mMinSpeed = (minSpeed === null) ? 0 : minSpeed;
    this.mMaxSpeed = (maxSpeed === null) ? 100 : maxSpeed;
    this.mSpeedDelta = (speedDelta === null) ? 1 : turningDelta;
    this.mTurningDelta = (turningDelta === null) ? 1 : maxSpeed;
    
    this.mDamage = 0;
    
    GameObject.call(this, this.mShip);
}
gEngine.Core.inheritPrototype(Ship, GameObject);

Ship.prototype.getSpeed = function() { return this.mSpeed; };
Ship.prototype.setSpeed = function(value) { this.mSpeed = value; };
Ship.prototype.incSpeed = function(value) { this.mSpeed += value; };

Ship.prototype.setSpeedDelta = function(value) { this.mSpeedDelta = value; };
Ship.prototype.setTurningDelta = function(value) { this.mTurningDelta = value; };

Ship.prototype.setMinSpeed = function(value) { this.mMinSpeed = value; };
Ship.prototype.setMaxSpeed = function(value) { this.mMaxSpeed = value; };

Ship.prototype.getDamage = function() { return this.mDamage; };
Ship.prototype.setDamage = function(value) { this.mDamage = value; };
Ship.prototype.incDamage = function (value) { this.mDamage += value; };

Ship.prototype.getShipRenderable = function() { return this.mShip; };
