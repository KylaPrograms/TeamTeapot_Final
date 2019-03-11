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
    //this.kInvincibleTime = 120; // 120 frames aka 2 seconds
    
//    this.mShip = new SpriteRenderable(spriteTexture);
//    this.mShip.getXform().setPosition(0, 0);
//    this.mShip.getXform().setSize(4, 8);

    
    Ship.call(this, spriteTexture, [0, 0], [4, 8], 100, 0, -25, 25, 0.02);
    console.log(this);
    // FOR PLACEHOLDER
    this.mOriginalColor = [1, 1, 1, 0];
    this.mShip.setColor(this.mOriginalColor);

    // FOR PLACEHOLDER
    this.mShip.setElementPixelPositions(53, 256, 0, 512);
    
    this.mTreasureCollected = 0;
        
    this.mMapRenderable = new Renderable();
    this.mMapRenderable.setColor([1, 0, 0, 1.0]);
    this.mMapRenderable.getXform().setSize(8, 8);
    this.mMapRenderable.getXform().setPosition(0, 0);
}
gEngine.Core.inheritPrototype(Hero, Ship);

Hero.prototype.update = function()
{
    if (this.getXform().getPosition()[1] >= this.wWorldBounds/2 ||
            this.getXform().getPosition()[1] <= -this.wWorldBounds/2 ||
            this.getXform().getPosition()[0] <= -this.wWorldBounds/2 ||
            this.getXform().getPosition()[0] >= this.wWorldBounds/2)
    {
        this.mWithinWorldBounds = false;
    }
    
//    GameObject.prototype.update.call(this);
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
    //this.getRigidBody().incVelocity(.1 * Math.cos(theta), .1 * Math.sin(theta));
    
    this.mMapRenderable.getXform().setPosition(currXform.getXPos(), 
                                                currXform.getYPos());
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

Hero.prototype.regenDamage = function()
{
    if(this.mDamage > 0) {
        this.mDamage -=1 ;   
    }
};

Hero.prototype.drawForMap = function (aCamera)
{
    this.mMapRenderable.draw(aCamera);
};

Hero.prototype.getWithinWorldBounds = function() { return this.mWithinWorldBounds; };
