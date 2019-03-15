/*
 * File:        Cannonball.js
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

function Cannonball(spriteTexture, position, forwardDir)
{
    Projectile.call(this, spriteTexture, position, [2, 2], forwardDir, 2, 30);
}
gEngine.Core.inheritPrototype(Cannonball, Projectile);

Cannonball.prototype.update = function()
{
    Projectile.prototype.update.call(this);
};
