/*
 * File:        MainGame_Update.js
 * Programmers: Kyla            March 13, 2019
 *
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MainGame.prototype.update = function ()
{
    this.mHeroTest.update();
    if (!this.mHeroTest.getWithinBounds(this.mWorldBounds))
    {
        this.mGameState.setGameOver(true);
    }
    this.updateHeroLight(this.mHeroTest);
    
    this.mPirateTest.update(this.mHeroTest.getPosition());
    this.updatePirateLight(this.mPirateTest);
    
    this.mGameState.update();
    
    var heroPos = this.mHeroTest.getPosition();
    this.mCamera.setWCCenter(heroPos[0], heroPos[1]);
    this.mMiniMap.setWCCenter(heroPos[0], heroPos[1]);
    
    if(this.mTreasureSetTest.collectAt(heroPos[0], heroPos[1]))
    {
        this.mHeroTest.addTreasure();
        this.mGameState.addTreasure();
        this.mTreasureUI.fillSlot();
    }
    
    this.mTreasureSetTest.update();
    this.mCamera.update();
    this.mMiniMap.update();
    
    this.mStormSet.update();
    
    // Spawn the storms
    if(this.mAutoSpawnTimer <= 0)
    {
        this.mAutoSpawnTimer = Math.random() * 60 + 120;
        this.mStormSet.createStorm(this.kStormTex);
    }
    
    // cycle through all rocks
    for (var i = 0; i < this.mRockSet.size(); i++) 
    {
        var rock = this.mRockSet.mSet[i];

        // Check Collision with all rocks in Rock set 
        var isHit = this.mHeroTest.checkHit(rock);

        // if touching rock, then hit
        if (isHit)
        {
            // camera shake
            var displacement = 2;           // move camera by 2 units
            var frequency = 5;              // shake 5 times a second
            var duration = 30;              // half a second

            this.mCamera.setCameraShake(displacement, displacement, frequency, duration);

            this.mHealthBar.setCurrentHP(this.mHeroTest.getHealth());
            this.mHealthBar.update();
        }

        if (this.mPirateTest.checkHit(rock))
        {
            //this.mPirateTest.hit(rock);
        }
    }
    
    // check cannonball collision
    if (this.mPirateTest.isChasingPlayer())
    {
        var cannonballs = this.mPirateTest.getCannonballSet();
        if (cannonballs.size() > 0)
        {
            var cannonball = cannonballs.getObjectAt(0);
            if (cannonball.getBBox().intersectsBound(this.mHeroTest.getBBox()))
            {
                this.mHeroTest.hit(cannonball);
                cannonball.kill();
                
                                // camera shake
                var displacement = 2;           // move camera by 2 units
                var frequency = 5;              // shake 5 times a second
                var duration = 30;              // half a second

                this.mCamera.setCameraShake(displacement, displacement, frequency, duration);

                this.mHealthBar.setCurrentHP(this.mHeroTest.getHealth());
                this.mHealthBar.update();
            }
        }
    }
    
    // Hero previously collided
    // check whether or not to shake camera
    if (this.mHeroTest.mInvincible === true) 
    {
        var camShake = this.mCamera.getCameraShake();
        if (camShake !== null && !camShake.shakeDone())
            camShake.updateShakeState();
    }
    
    this.checkStormShipCollision();

    var c = new CollisionInfo();
    if (this.mHeroTest.getRigidBody().collisionTest(this.mPirateTest.getRigidBody(), c))
    {
        gEngine.Physics.resolveCollision(this.mHeroTest.getRigidBody(), this.mPirateTest.getRigidBody(), c);
        this.mHeroTest.getRigidBody().setAngularVelocity(0);
        this.mPirateTest.getRigidBody().setAngularVelocity(0);

    }

    //Pressing 'x' deals damage to the ship.
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.X))
    {
        this.mHeroTest.hit();
        //this.mHeroTest.incHealthBy(10);
    }
    
    //Manually lose the game
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.C))
    {
        this.mGameState.setGameOver(true);
    }
    
    //Manually win the game
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.V))
    {
        this.mGameState.setGameWin(true);
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.M))
    {
        if(gEngine.AudioClips.isBackgroundAudioPlaying())
        {
            gEngine.AudioClips.stopBackgroundAudio();
        } else {
            gEngine.AudioClips.playBackgroundAudio(this.kBGMusic);
        }
    }
    
    this.mMiniMapTranslucent.getXform().setPosition(this.mMiniMap.getWCCenter()[0], this.mMiniMap.getWCCenter()[1]);
    this.mSpaceBG.getXform().setPosition(this.mHeroTest.getXform().getPosition()[0], this.mHeroTest.getXform().getPosition()[1]);
};

MainGame.prototype.checkStormShipCollision = function()
{
    for (var i = 0; i < this.mStormSet.size(); i++)
    {
        var storm = this.mStormSet.getObjectAt(i);
        
        var maxDistance = storm.getXform().getHeight() * 2;
        var distance = vec2.distance(this.mHeroTest.getPosition(), storm.getXform().getPosition());
        var distanceRatio = (maxDistance - distance) / maxDistance; 
        
        if (distanceRatio > 0)
        {   
            var speedRatio = storm.getRotSpeed() / 10;
            var sizeRatio = storm.getSize() / 15;

            console.log("suck " + distance);
            console.log("ratio " + distanceRatio);

            this.mHeroTest.moveTowards(storm.getXform().getPosition(), this.mHeroTest.getTurningDelta() * distanceRatio * speedRatio * sizeRatio);
            this.mHeroTest.incSpeedBy(this.mHeroTest.getSpeedDelta() + this.mHeroTest.getSpeedDelta() * distanceRatio * speedRatio * sizeRatio);
        }    
    }
    

}
