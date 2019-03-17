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
            {
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
            }
            // Hero previously collided
            // check whether or not to shake camera
            if (this.mHeroTest.mInvincible === true) 
            {
                var camShake = this.mCamera.getCameraShake();
                if (camShake !== null && !camShake.shakeDone())
                    camShake.updateShakeState();
            }
            
            if (this.mPirateTest.checkHit(rock))
            {
                //this.mPirateTest.hit(rock);
            }
        }
        
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
        this.mHeroTest.incHealthBy(10);
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

