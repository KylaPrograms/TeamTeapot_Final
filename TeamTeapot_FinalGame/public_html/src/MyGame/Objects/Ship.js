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
                currSpeed, minSpeed, maxSpeed,  turningDelta, wakeTexture)
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
    
    this.kInvincibleTime = 120; // 120 frames aka 2 seconds
    
    this.mInvincible = false;
    this.mHitTimer = 0;                                 // Timer that tracks how much longer the player remains invincible after getting hit
    this.mHitCheckTimer = 0;                            // Timer that tracks when to check for rock collision again
    this.mOriginalColor = [0.75, 0, 0, 1];
    this.mShip.setColor(this.mOriginalColor);
    
    this.mWakeSet = new WakeSet();
    this.mWakeTimer = 0;
    this.mWakeTexture = wakeTexture;
    
    GameObject.call(this, this.mShip);
    
    var r = new RigidRectangle(this.getXform(), size[0], size[1]);
    r.setMass(.7);
    r.setRestitution(30);
    r.setFriction(0);
    r.setVelocity(0, 0);
    this.setRigidBody(r);
    this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(Ship, GameObject);

Ship.prototype.update = function()
{
    
    GameObject.prototype.update.call(this);
    this.updateInvincibility();
    //console.log(this.mSpeed);
    
    this.mWakeSet.update();
    if(this.mWakeTimer >= 20)
    {
        this.mWakeSet.createWakeFromShip(this, this.mWakeTexture, [2, 1], 0.01);
        this.mWakeTimer = 0;
    }
 
    this.mWakeTimer++;
}

Ship.prototype.draw = function(camera)
{
    GameObject.prototype.draw.call(this, camera);
    this.mWakeSet.draw(camera);
}

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

Ship.prototype.hit = function(obj, touchPos)
{
    var otherPos = obj.getXform().getPosition();
    var pos = this.getXform().getPosition();
    
    this.getRigidBody().adjustPositionBy([pos[0] - otherPos[0], pos[1] - otherPos[1]], .1);
    
    if (this.mInvincible === false)
    {
        this.incDamageBy(10);
        
        this.mInvincible = true;
        this.mSpeed *= -.5;
        
        var otherPos = obj.getXform().getPosition();
        var pos = this.getXform().getPosition();
        
        // angle to send at
        var theta = Math.atan2(pos[1] - otherPos[1], pos[0] - otherPos[0]);
        //this.setVelocity(this.mSpeed * Math.cos(theta), this.mSpeed * Math.sin(theta));
        //this.getRigidBody().adjustPositionBy();
        
        console.log("ship hit rock" + theta);
    }
};

Ship.prototype.setVelocity = function(x,y)
{
    this.getRigidBody().setVelocity(x,y);
}

Ship.prototype.updateInvincibility = function()
{
    // check if invincible
    if (this.mInvincible === true)
    {
        // disable invincibility if duration is over
        if (this.mHitTimer > this.kInvincibleTime)
        {
            
            this.mShip.setColor(this.mOriginalColor);
            this.mInvincible = false;
            this.mHitTimer = 0;
        }
        // increment timer
        else
        {
            var freq = 16;
            var color = [this.mOriginalColor[0], this.mOriginalColor[1], this.mOriginalColor[2], this.mOriginalColor[3]];
            for (var i = 0; i < 4; i++)
            {
                if (this.mHitTimer % freq / freq > .5)
                    color[i] = this.mOriginalColor[i];
                else
                    color[i] = 1;
            }
            //console.log(color);
            this.mShip.setColor(color);
            this.mHitTimer++;
        } 
    }
};

