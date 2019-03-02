/*
 * File:        MyGame.js
 * Programmers: Kyla            March 1, 2019
 *              
 *
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Hero(spriteTexture)
{
    this.kMinSpeed = 0.0;
    this.kMaxSpeed = 1.75;
    this.kSpeedDelta = 0.002;
    this.kTurningDelta = 0.02;
    
    this.mShip = new SpriteRenderable(spriteTexture);
    this.mShip.getXform().setPosition(0, 0);
    this.mShip.getXform().setSize(4, 8);
    
    // FOR PLACEHOLDER
    this.mShip.setColor([0.42, 0.2, 0, 1]);
    
    GameObject.call(this, this.mShip);
    
    this.mSpeed = 0;
}
gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.update = function()
{
    GameObject.prototype.update.call(this);
    
    var dir = this.getCurrentFrontDir();
    var pos = this.getXform().getPosition();
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.W))
    {
        this.mSpeed += this.kSpeedDelta;
        if(this.mSpeed > this.kMaxSpeed)
        {
            this.mSpeed = this.kMaxSpeed;
        }
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.S))
    {
        this.mSpeed -= this.kSpeedDelta;
        if(this.mSpeed < this.kMinSpeed)
        {
            this.mSpeed = this.kMinSpeed;
        }
    }
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.A))
    {
        vec2.rotate(dir, dir, this.kTurningDelta);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.D))
    {
        vec2.rotate(dir, dir, -this.kTurningDelta);
    }
    
    vec2.scaleAndAdd(pos, pos, dir, this.mSpeed);
    this.getXform().setRotationInRad(Math.atan2(dir[0], -dir[1]));
};

Hero.prototype.getPosition = function()
{
    return this.getXform().getPosition();
};
