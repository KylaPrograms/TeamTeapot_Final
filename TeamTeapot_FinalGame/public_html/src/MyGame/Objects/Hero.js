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
        this.mSpeed += 0.01;
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.S))
    {
        this.mSpeed -= 0.01;
        if(this.mSpeed < 0)
        {
            this.mSpeed = 0;
        }
    }
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.A))
    {
        vec2.rotate(dir, dir, 0.02);
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.D))
    {
        vec2.rotate(dir, dir, -0.02);
    }
    
    vec2.scaleAndAdd(pos, pos, dir, this.mSpeed);
    this.getXform().setRotationInRad(Math.atan2(dir[0], -dir[1]));
};
