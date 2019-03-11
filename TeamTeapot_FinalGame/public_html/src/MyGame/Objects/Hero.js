/*
 * File:        Hero.js
 * Programmers: Kyla            March 1, 2019
 *              Emily           March 5, 2019
 *
 */

/* jslint node: true, vars: true */
/* global gEngine: false, GameObject: false, GameObjectSet: false,
 * SpriteAnimateRenderable: false, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Hero(spriteTexture)
{
    this.mWithinWorldBounds = true;
//    this.kMinSpeed = 0.0;
//    this.kMaxSpeed = 25; // use 25 when using rigid body, 1 when not
    this.kSpeedDelta = 0.1; // use 0.05 when using rigid body, 0.002 when not
//    this.kTurningDelta = 0.02;
    this.kInvincibleTime = 120; // 120 frames aka 2 seconds
    
//    this.mShip = new SpriteRenderable(spriteTexture);
//    this.mShip.getXform().setPosition(0, 0);
//    this.mShip.getXform().setSize(4, 8);
    this.mInvincible = false;
    this.mHitTimer = 0;                                 // Timer that tracks how much longer the player remains invincible after getting hit
    this.mHitCheckTimer = 0;                            // Timer that tracks when to check for rock collision again
    
    Ship.call(this, spriteTexture, [0, 0], [5, 12], 100, 0, 0, 25, 0.02);
    console.log(this);
    // FOR PLACEHOLDER
    this.mShip.setElementPixelPositions(107, 507, 1024, 0);
    
    
    
    
    var r = new RigidRectangle(this.getXform(), 4, 8);
    r.setMass(1);
    r.setVelocity(0, 0);
    this.setRigidBody(r);
//    this.toggleDrawRigidShape();
    
//    this.mSpeed = 0;
//    
//    this.mDamage = 0;
    this.mTreasureCollected = 0;
        
    this.mMapRenderable = new Renderable();
    this.mMapRenderable.setColor([1, 0, 0, 1.0]);
    this.mMapRenderable.getXform().setSize(8, 8);
    this.mMapRenderable.getXform().setPosition(0, 0);
}
gEngine.Core.inheritPrototype(Hero, Ship);

Hero.prototype.update = function()
{
    if (this.getXform().getPosition()[1] >= wWorldBounds/2 ||
            this.getXform().getPosition()[1] <= -wWorldBounds/2 ||
            this.getXform().getPosition()[0] <= -wWorldBounds/2 ||
            this.getXform().getPosition()[0] >= wWorldBounds/2)
    {
        this.mWithinWorldBounds = false;
    }
    
    GameObject.prototype.update.call(this);
    
    var currXform = this.mShip.getXform();
    var v = this.getRigidBody().getVelocity();
    
    var dir = this.getCurrentFrontDir();
    
    var noPress = true;
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.W))
    {
        noPress = false;
        this.incSpeedBy(this.kSpeedDelta);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.S))
    {
        noPress = false;
        this.incSpeedBy(-this.kSpeedDelta);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.A))
    {
        vec2.rotate(dir, dir, this.getTurningDelta());
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.D))
    {
        vec2.rotate(dir, dir, -this.getTurningDelta());
    }
    if (noPress)
    {
        this.mSpeed = ((this.mSpeed > 0) ? 1 : -1) * Math.max(Math.abs(this.mSpeed) - this.kSpeedDelta, 0);
    }
    
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space))
    {
        this.hit();
    }
    
    this.updateInvincibility();
        
    // first working attempt
    //var pos = this.getXform().getPosition();
    //vec2.scaleAndAdd(pos, pos, dir, this.mSpeed);
    //this.getRigidBody().adjustPositionBy(dir, this.mSpeed);
    var theta = Math.atan2(dir[1], dir[0]);
    
    this.getRigidBody().setVelocity(this.mSpeed * Math.cos(theta), this.mSpeed * Math.sin(theta));
    //console.log(this.getRigidBody().getVelocity());
    // second working attempt
//    vec2.scale(v, dir, this.mSpeed);
    
    // so will face the direction it is heading and
    // doesn't snap to facing up when stopping
    this.getXform().setRotationInRad(Math.atan2(dir[0], -dir[1]));
    
    this.mMapRenderable.getXform().setPosition(currXform.getXPos(), 
                                                currXform.getYPos());
};

Hero.prototype.drawForMap = function (aCamera)
{
    this.mMapRenderable.draw(aCamera);
};

Hero.prototype.updateInvincibility = function()
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
    }
};

Hero.prototype.addTreasure = function()
{
    this.mTreasureCollected++;
    //console.log(this.mTreasureCollected);
};

Hero.prototype.getTreasureAmount = function()
{
    return this.mTreasureCollected;
};

Hero.prototype.changeSpeed = function(speed)
{
    var pos = this.getXform().getPosition();
    var dir = this.getCurrentFrontDir();
    
    vec2.scaleAndAdd(pos,pos,dir, speed);
};

// Check if collided with an object
Hero.prototype.checkHit = function(otherObj)
{
    var touchPos = [];
    var result = false;
    var FREQUENCY = 11;         // how often to check collision. Must be odd number
    if (this.mHitCheckTimer === 0)   
    {
        result = this.pixelTouches(otherObj, touchPos);
    }
    this.mHitCheckTimer = (this.mHitCheckTimer + 1) % FREQUENCY;
    
    return result;
};

Hero.prototype.hit = function()
{
    if (this.mInvincible === false)
    {
        console.log("ship hit rock");
        this.mInvincible = true;
        this.getRigidBody().flipVelocity();
        this.mSpeed *= -.5;
    }
    
};

Hero.prototype.regenDamage = function()
{
    if(this.mDamage > 0) {
        this.mDamage -=1 ;   
    }
};

Hero.prototype.getWithinWorldBounds = function() { return this.mWithinWorldBounds; };
