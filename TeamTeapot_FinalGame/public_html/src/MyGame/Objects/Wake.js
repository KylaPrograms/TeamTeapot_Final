/*
 * File:        Wake.js
 * Programmers: Kyla            March 15, 2019
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
    this.mRenderable = new LightRenderable(spriteTexture);
    this.mRenderable.getXform().setPosition(position[0], position[1]);
    this.mRenderable.getXform().setSize(2, 1);
    
    Projectile.call(this, this.mRenderable, forwardDir, 0.01, 90);
}
gEngine.Core.inheritPrototype(Wake, Projectile);

Wake.prototype.update = function()
{
    Projectile.prototype.update.call(this);
};
