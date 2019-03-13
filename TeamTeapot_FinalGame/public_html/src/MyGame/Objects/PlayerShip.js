/*
 * File:        PlayerShip.js
 * Programmers: Kyla            March 13, 2019
 *              Emily           March 5, 2019
 *
 */

/* jslint node: true, vars: true */
/* global gEngine: false, GameObject: false, GameObjectSet: false,
 * SpriteAnimateRenderable: false, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function PlayerShip(spriteTexture, collisionTexture, wakeTexture)
{
    this.kSpeedDelta = 0.1; 
    this.kInvincibleTime = 120;
    this.mInvincible = false;
    
    this.mHitTimer = 0;                                 // Timer that tracks how much longer the player remains invincible after getting hit
    this.mHitCheckTimer = 0;                            // Timer that tracks when to check for rock collision again
    Ship.call(this, spriteTexture,collisionTexture, wakeTexture, [0, 0], [5, 12], 100, 0, -25, 25, 0.02);

    console.log(this);
    
    this.mOriginalColor = [1, 1, 1, 0];
    this.mShip.setColor(this.mOriginalColor);

    this.mShip.setElementPixelPositions(53, 256, 0, 512);
    this.mCollisionTex.setElementPixelPositions(64, 115, 0, 128);
    
    var r = new RigidRectangle(this.getXform(), 4, 8);
    r.setMass(1);
    r.setVelocity(0, 0);
    this.setRigidBody(r);
    this.toggleDrawRigidShape();

    this.mTreasureCollected = 0;
        
    //The renderable for the minimap    
    this.mMapRenderable = new Renderable();
    this.mMapRenderable.setColor([1, 0, 0, 1.0]);
    this.mMapRenderable.getXform().setSize(8, 8);
    this.mMapRenderable.getXform().setPosition(this.getXform().getXPos(), 
                                                        this.getXform().getYPos());
}
gEngine.Core.inheritPrototype(PlayerShip, Ship);

PlayerShip.prototype.update = function()
{
    Ship.prototype.update.call(this);
    
    var currXform = this.mShip.getXform();
    
    // get direction ship is facing
    var dir = this.getCurrentFrontDir();
    
    // check for input
    var noPress = true;
    
    // Move forward
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.W))
    {
        noPress = false;
        this.incSpeedBy(this.kSpeedDelta);
    }
    // slow down
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.S))
    {
        // only slow down if moving forward
        if (this.mSpeed > 0)
        {
            noPress = false;
            this.incSpeedBy(-this.kSpeedDelta);
        }
    }
    // Turn left
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.A))
    {
        vec2.rotate(dir, dir, this.getTurningDelta());
    }
    // turn right
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.D))
    {
        vec2.rotate(dir, dir, -this.getTurningDelta());
    }
    // slow down if no input
    if (noPress)
    {
        var decay = this.kSpeedDelta;
        if (this.mSpeed > 0)
            decay *= -1;
            
        this.incSpeedBy(decay);
    }
    
    // temp code
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space))
    {
        this.hit();
    }
    
    // rotate ship sprite
    this.getXform().setRotationInRad(Math.atan2(dir[0], -dir[1]));
    
    // set ship velocity in new direction
    var theta = Math.atan2(dir[1], dir[0]);
    this.setVelocity(this.mSpeed * Math.cos(theta), this.mSpeed * Math.sin(theta));
    
    //Update the renderable's position on the map
    this.mMapRenderable.getXform().setPosition(this.getXform().getXPos(), 
                                                        this.getXform().getYPos());
};

PlayerShip.prototype.drawForMap = function (aCamera)
{
    this.mMapRenderable.draw(aCamera);
};

PlayerShip.prototype.updateInvincibility = function()
{
    // check if invincible
    if (this.mInvincible === true)
    {
        // disable invincibility if duration is over
        if (this.mHitTimer > this.kInvincibleTime)
        {
            this.mShip.setColor([0.42, 0.2, 0, 1]);
            this.mInvincible = false;
            this.mHitTimer = 0;
        }
        // increment timer
        else
        {
            this.mShip.setColor([0.42, 0.2, 0, 1 * this.mHitTimer % 4]);
            this.mHitTimer++;
        } 
    } else {
        this.mShip.setColor(this.mOriginalColor);
    }
};

PlayerShip.prototype.addTreasure = function()
{
    this.mTreasureCollected++;
};

PlayerShip.prototype.getTreasureAmount = function()
{
    return this.mTreasureCollected;
};

PlayerShip.prototype.changeSpeed = function(speed)
{
    var pos = this.getXform().getPosition();
    var dir = this.getCurrentFrontDir();
    
    vec2.scaleAndAdd(pos,pos,dir, speed);
};

PlayerShip.prototype.regenDamage = function()
{
    if(this.mDamage > 0) {
        this.mDamage -=1 ;   
    }
};

// bounds = [left, right, bottom, top]
PlayerShip.prototype.getWithinBounds = function(bounds)
{
    var pos = this.getXform().getPosition();
    if(pos[0] < bounds[0] ||
            pos[0] > bounds[1] ||
            pos[1] < bounds[2] ||
            pos[1] > bounds[3])
    {
        return false;
    }
    return true;
};
