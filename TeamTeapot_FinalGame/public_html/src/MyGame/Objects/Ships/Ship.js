/*
 * File:        Ship.js
 * Programmers: Kyla            March 15, 2019
 *
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Ship(spriteTexture, collisionTexture, wakeTexture,
                position, size, maxHealth,
                currSpeed, minSpeed, maxSpeed,  turningDelta)
{
    this.mShip = new LightRenderable(spriteTexture);
    this.mShip.getXform().setPosition(position[0], position[1]);
    this.mShip.getXform().setSize(size[0], size[1]);
    
    this.mCollisionTex = new SpriteRenderable(collisionTexture);
    this.mCollisionTex.getXform().setPosition(position[0], position[1]);
    this.mCollisionTex.getXform().setSize(size[0], size[1]);
    
    this.mSpeed = (currSpeed === null) ? 0 : currSpeed;
    
    this.mMinSpeed = (minSpeed === null) ? 0 : minSpeed;
    this.mMaxSpeed = (maxSpeed === null) ? 100 : maxSpeed;
    this.mTurningDelta = (turningDelta === null) ? 1 : turningDelta;
    
    this.mHealth = maxHealth;
    this.mMaxHealth = maxHealth;
    
    this.kInvincibleTime = 120; // 120 frames aka 2 seconds
    
    this.mInvincible = false;
    this.mHitTimer = 0;                                 // Timer that tracks how much longer the player remains invincible after getting hit
    this.mHitCheckTimer = 0;                            // Timer that tracks when to check for rock collision again
    this.mOriginalColor = [0.75, 0, 0, 1];
    this.mShip.setColor(this.mOriginalColor);
    
    this.mWakeSet = new ProjectileSet();
    this.mWakeTimer = 0;
    this.mWakeTexture = wakeTexture;
    
    GameObject.call(this, this.mCollisionTex);
    
    var r = new RigidRectangle(this.getXform(), size[0], size[1]);
    r.setMass(0.7);
    r.setRestitution(1.05);
    r.setFriction(0);
    r.setVelocity(0, 0);
    this.setRigidBody(r);
    this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(Ship, GameObject);

Ship.prototype.draw = function(camera)
{
    GameObject.prototype.draw.call(this, camera);
    this.mWakeSet.draw(camera);
};

Ship.prototype.getSpeed = function() { return this.mSpeed; };
Ship.prototype.setSpeed = function(value)
{
    var newSpeed = value;
    if(newSpeed < this.mMinSpeed)
    {
        newSpeed = value + .1;
    }
    if(newSpeed > this.mMaxSpeed)
    {
        newSpeed = value - .1;
    }
    this.mSpeed = newSpeed;
};
Ship.prototype.incSpeedBy = function(value) { this.setSpeed(this.mSpeed + value); };

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

Ship.prototype.getHealth = function() { return this.mHealth; };
Ship.prototype.setHealth = function(value)
{
    var newHealth = value;
    
    if(newHealth < 0)
    {
        newHealth = 0;
    }
    if(newHealth > this.mMaxHealth)
    {
        newHealth = this.mMaxHealth;
    }
    
    this.mHealth = newHealth;
};
Ship.prototype.incHealthBy = function (value) { this.setHealth(this.mHealth+value); };

Ship.prototype.getShipRenderable = function() { return this.mShip; };

Ship.prototype.getPosition = function() { return this.getXform().getPosition(); };

// Check if collided with an object
Ship.prototype.checkHit = function(otherObj)
{
    var touchPos = [];
    var result = false;
    var FREQUENCY = 19;         // how often to check collision. Must be odd number
    if (this.mHitCheckTimer === 0)   
    {
        result = this.pixelTouches(otherObj, touchPos);
        if (result)
        {
            console.log("Hit rock");
            this.hit(otherObj, touchPos);
        }
            
    }
    this.mHitCheckTimer = (this.mHitCheckTimer + 1) % FREQUENCY;
    
    return result;
};

Ship.prototype.hit = function(obj)
{
    var otherPos = obj.getXform().getPosition();
    var pos = this.getXform().getPosition();
    
    this.getRigidBody().adjustPositionBy([pos[0] - otherPos[0], pos[1] - otherPos[1]], .1);
    
    if (this.mInvincible === false)
    {
        this.incHealthBy(-10);
        
        this.mInvincible = true;
        this.mSpeed *= -.5;
        
        var otherPos = obj.getXform().getPosition();
        var pos = this.getXform().getPosition();
        
        // angle to send at
        var theta = Math.atan2(pos[1] - otherPos[1], pos[0] - otherPos[0]);
        
        console.log("ship hit rock" + theta);
    }
};

Ship.prototype.setVelocity = function(x,y)
{
    this.getRigidBody().setVelocity(x,y);
};



Ship.prototype._createWake = function(sprite)
{
    var xform = this.getXform();
    
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
    
    var leftWake = new Wake(sprite, newPos, forward);
    leftWake.getXform().setRotationInRad(theta);
    
    this.mWakeSet.addToSet(leftWake);
    
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
    
    var rightWake = new Wake(sprite, newPos, forward);
    rightWake.getXform().setRotationInRad(theta);
    
    this.mWakeSet.addToSet(rightWake);
};
