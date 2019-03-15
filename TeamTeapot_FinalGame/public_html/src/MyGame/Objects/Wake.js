/*
 * File:        Wake.js
 * Programmers: Kyla            March 10, 2019
 *
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Wake(spriteTexture, position, forwardDir)
{
    this.mWake = new LightRenderable(spriteTexture);
    this.mWake.getXform().setPosition(position[0], position[1]);
    this.mWake.getXform().setSize(2, 1);
    
    this.mSpeed = 0.01;
    
    this.mLifeSpan = 60;
    this.mLifeTimer = 0;
    
    GameObject.call(this, this.mWake);
    
    this.mCurrentFrontDir = vec2.fromValues(forwardDir[0], forwardDir[1]);
}
gEngine.Core.inheritPrototype(Wake, GameObject);

Wake.prototype.update = function()
{
    GameObject.prototype.update.call(this);
    
    var pos = this.getXform().getPosition();
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.mSpeed);
    
    this.mLifeTimer++;
};

Wake.prototype.isDead = function()
{
    return this.mLifeTimer > this.mLifeSpan;
};
