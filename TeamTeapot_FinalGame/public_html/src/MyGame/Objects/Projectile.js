/*
 * File:        Projectile.js
 * Programmers: Kyla            March 14, 2019
 *              
 *
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Projectile(spriteTexture, position, size, forwardDir, speed, lifeSpan)
{
    this.mRenderable = new LightRenderable(spriteTexture);
    this.mRenderable.getXform().setPosition(position[0], position[1]);
    this.mRenderable.getXform().setSize(size[0], size[1]);
    
    this.mSpeed = speed;
    
    this.mLifeSpan = lifeSpan;
    this.mLifeTimer = 0;
    
    GameObject.call(this, this.mRenderable);
    
    this.mCurrentFrontDir = vec2.fromValues(forwardDir[0], forwardDir[1]);
}
gEngine.Core.inheritPrototype(Projectile, GameObject);

Projectile.prototype.update = function()
{
    GameObject.prototype.update.call(this);
    
    var pos = this.getXform().getPosition();
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.mSpeed);
    
    this.mLifeTimer++;
};

Projectile.prototype.isDead = function()
{
    return this.mLifeTimer > this.mLifeSpan;
};