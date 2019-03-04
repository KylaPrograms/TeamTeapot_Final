/*
 * File:        Hero.js
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

function Hero(spriteTexture)
{
    this.kMinSpeed = 0.0;
    this.kMaxSpeed = 25; // use 25 when using rigid body, 1 when not
    this.kSpeedDelta = 0.1; // use 0.05 when using rigid body, 0.002 when not
    this.kTurningDelta = 0.02;
    
    this.mShip = new SpriteRenderable(spriteTexture);
    this.mShip.getXform().setPosition(0, 0);
    this.mShip.getXform().setSize(4, 8);
    
    // FOR PLACEHOLDER
    this.mShip.setColor([0.42, 0.2, 0, 1]);
    
    GameObject.call(this, this.mShip);
    
    var r = new RigidRectangle(this.getXform(), 4, 8);
    r.setMass(1);
    r.setVelocity(0, 0);
    this.setRigidBody(r);
    this.toggleDrawRigidShape();
    
    this.mSpeed = 0;
    
    this.mDamage = 0;
    this.mTreasureCollected = 0;
}
gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.update = function()
{
    GameObject.prototype.update.call(this);
    
    var v = this.getRigidBody().getVelocity();
    
    var dir = this.getCurrentFrontDir();
    
    var noPress = true;
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.W))
    {
        noPress = false;
        this.mSpeed += this.kSpeedDelta;
        if(this.mSpeed > this.kMaxSpeed)
        {
            this.mSpeed = this.kMaxSpeed;
        }
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.S))
    {
        noPress = false;
        this.mSpeed -= this.kSpeedDelta;
        if(this.mSpeed < this.kMinSpeed)
        {
            this.mSpeed = this.kMinSpeed;
        }
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.A))
    {
        //noPress = false;
        vec2.rotate(dir, dir, this.kTurningDelta);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.D))
    {
        //noPress = false;
        vec2.rotate(dir, dir, -this.kTurningDelta);
    }
    if (noPress)
    {
        this.mSpeed = ((this.mSpeed > 0) ? 1 : -1) * Math.max(Math.abs(this.mSpeed) - this.kSpeedDelta, 0);
    }
    
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space))
    {
        this.hit();
    }
        
    // first working attempt
    //var pos = this.getXform().getPosition();
    //vec2.scaleAndAdd(pos, pos, dir, this.mSpeed);
    //this.getRigidBody().adjustPositionBy(dir, this.mSpeed);
    var theta = Math.atan2(dir[1], dir[0]);
    
    this.getRigidBody().setVelocity(this.mSpeed * Math.cos(theta), this.mSpeed * Math.sin(theta));
    console.log(this.getRigidBody().getVelocity());
    // second working attempt
//    vec2.scale(v, dir, this.mSpeed);
    
    // so will face the direction it is heading and
    // doesn't snap to facing up when stopping
    this.getXform().setRotationInRad(Math.atan2(dir[0], -dir[1]));
};

Hero.prototype.addTreasure = function()
{
    this.mTreasureCollected++;
    console.log(this.mTreasureCollected);
};

Hero.prototype.getTreasureAmount = function()
{
    return this.mTreasureCollected;
};

Hero.prototype.getPosition = function()
{
    return this.getXform().getPosition();
};

Hero.prototype.changeSpeed = function(speed)
{
    var pos = this.getXform().getPosition();
    var dir = this.getCurrentFrontDir();
    
    vec2.scaleAndAdd(pos,pos,dir, speed);
}

Hero.prototype.hit = function(obj)
{
    //this.getRigidBody().setVelocity(0,5);
    this.getRigidBody().flipVelocity();
    this.mSpeed *= -1;
}
Hero.prototype.getDamage = function()
{
    return this.mDamage;
};

Hero.prototype.incDamageBy = function(deltaD)
{
    this.mDamage += deltaD;
};

Hero.prototype.regenDamage = function()
{
    if(this.mDamage > 0) {
        this.mDamage -=1 ;   
    }
};
