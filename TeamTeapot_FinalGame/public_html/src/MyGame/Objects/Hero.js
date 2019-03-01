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
    this.mShip = new SpriteRenderable(spriteTexture);
    this.mShip.getXform().setPosition(0, 0);
    this.mShip.getXform().setSize(4, 8);
    
    // FOR PLACEHOLDER
    this.mShip.setColor([0.42, 0.2, 0, 1]);
    
    GameObject.call(this, this.mShip);
    
    var r = new RigidRectangle(this.getXform(), 4, 8);
    this.setRigidBody(r);
    r.setMass(10);
    r.setVelocity(0, 0);
}
gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.update = function()
{
    GameObject.prototype.update.call(this);
    
    var rb = this.getRigidBody();
    var forward = this.getCurrentFrontDir();
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.W))
    {
        forward = [forward[0], forward[1] + Math.sin(90)];
        rb.incVelocity(0, Math.sin(forward[1]) * 0.1);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.S))
    {
        forward = [forward[0], forward[1] + Math.sin(270)];
        rb.incVelocity(0, -Math.sin(forward[1]) * 0.1);
    }
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.A))
    {
        forward = [forward[0] + Math.cos(90), forward[1]];
        rb.incVelocity(-Math.cos(forward[0]) * 0.1, 0);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.D))
    {
        forward = [forward[0] - Math.cos(90), forward[1]];
        rb.incVelocity(Math.cos(forward[0]) * 0.1, 0);
    }
    
    this.setCurrentFrontDir(forward[0], forward[1]);
    var f = this.getCurrentFrontDir();
    var rot = Math.atan2(f[0], f[1]);
    console.log(f);
    this.getXform().setRotationInRad(rot);
};
