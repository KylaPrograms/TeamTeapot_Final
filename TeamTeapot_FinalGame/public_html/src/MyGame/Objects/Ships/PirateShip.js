/*
 * File:        PirateShip.js
 * Programmers: Kyla            March 13, 2019
 *              
 *
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function PirateShip(spriteTexture, collisionTexture, wakeTexture, cannonballTexture)
{    
    //GameObject.call(this, this.mPirateShip);
    
    this.kSpeedDelta = 0.05;
    this.mOriginalColor = [0.75, 0, 0, 1];
    
    Ship.call(this, spriteTexture, collisionTexture, wakeTexture, [50, 0], [5, 12], 10, 0, -15, 15, .02);
    
    this.mCannonballTex = cannonballTexture;
    this.mCannonballSet = new ProjectileSet();
    this.mCbSpawnRate = 150;
    this.mCbTimer = 0;
    
    this.mOriginalColor = [1, 1, 1, 0];
    this.mShip.setColor(this.mOriginalColor);
    
    this.mShip.setElementPixelPositions(20, 284, 0, 1024);
    this.mCollisionTex.setElementPixelPositions(13, 64, 0, 128);
    
    this.mMapRenderable = new UIRenderable();
    this.mMapRenderable.setColor([0, 0, 0, 1.0]);
    this.mMapRenderable.getXform().setSize(8, 8);
    this.mMapRenderable.getXform().setPosition(this.getXform().getXPos(), 
                                                        this.getXform().getYPos());
                                                        
    this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(PirateShip, Ship);

PirateShip.prototype.update = function(heroPos)
{
    Ship.prototype.update.call(this);
    this.mCannonballSet.update();
    
    var direction = .1 * ((this.getRigidBody().getAngularVelocity() < 0) ? 1 : -1);
    this.getRigidBody().setAngularVelocityDelta(direction);
    
    if(vec2.distance(this.getXform().getPosition(), heroPos) < 50)
    {
        this._chase(heroPos);
        
        if(this.mCbTimer >= this.mCbSpawnRate)
        {
            this._shoot(heroPos);
            this.mCbTimer = 0;
        }
        
        this.mCbTimer++;
    }
    else
    {
        this.mCbTimer = this.mCbSpawnRate;
    }
    
    this.mMapRenderable.getXform().setPosition(this.getXform().getXPos(), 
                                                        this.getXform().getYPos());
};

PirateShip.prototype._chase = function(target)
{
    this.incSpeedBy(this.kSpeedDelta);
    
    var currXform = this.getXform();
    // get current pos of ship
    var pos = currXform.getPosition();
    
    // get vector between hero and pirateship
    var x = target[0] - pos[0];
    var y = target[1] - pos[1];
    
    // get direction pirateship is facing
    var curr = currXform.getRotationInRad() + Math.PI / 2;
    
    var facing = [Math.cos(curr), Math.sin(curr)];
    
    // get cross product to see which direction to turn
    vec2.cross(facing, [Math.cos(curr), Math.sin(curr)], [x,y]);
    
    var rotateBy = this.getTurningDelta();
    if (facing[2] > 0)  // if pirate is on left side, rotate left;
        rotateBy *= -1;

    var r = this.getXform().getRotationInRad() + Math.PI / 2;
    this.setVelocity(-this.mSpeed * Math.cos(r), -this.mSpeed * Math.sin(r));
    
    this.getXform().setRotationInRad(curr + rotateBy - Math.PI / 2);
    
    this.mMapRenderable.getXform().setPosition(currXform.getXPos(), currXform.getYPos());    
};

PirateShip.prototype._shoot = function(target)
{
    var newCb = new Cannonball(this.mCannonballTex, this.getXform().getPosition(), target);
    this.mCannonballSet.addToSet(newCb);
};

PirateShip.prototype.draw = function(camera)
{
    Ship.prototype.draw.call(this, camera);
    this.mCannonballSet.draw(camera);
}

PirateShip.prototype.drawForMap = function(aCamera)
{
    this.mMapRenderable.draw(aCamera);
};