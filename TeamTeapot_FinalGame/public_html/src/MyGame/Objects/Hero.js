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
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.W))
    {
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.S))
    {
    }
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.A))
    {
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.D))
    {
    }
    
};
