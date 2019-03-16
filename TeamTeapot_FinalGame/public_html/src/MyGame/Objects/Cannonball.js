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

function Cannonball(spriteTexture, position, target)
{
    var x = target[0] - position[0];
    var y = target[1] - position[1];
    Projectile.call(this, spriteTexture, position, [2, 2], [x,y], 1, 60);
}
gEngine.Core.inheritPrototype(Cannonball, Projectile);

Cannonball.prototype.update = function()
{
    Projectile.prototype.update.call(this);
};
