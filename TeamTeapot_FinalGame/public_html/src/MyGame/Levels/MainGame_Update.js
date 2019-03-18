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
    this.mElapsedTime++;
    this.updateAmbientLighting();
    
    this.mWaterfallSet.update();
    
    this.mHeroTest.update();
    if (!this.mHeroTest.getWithinBounds(this.mWorldBounds))
    {
        this.mGameState.setGameOver(true);
    }
    this.updateHeroLight(this.mHeroTest);
    
    //this.updatePirateLight(this.mPirateTest);
    this.mPirateSetTest.update(this.mMiniMap, this.mHeroTest.getPosition());
    var shipsOnMainCam = this.mPirateSetTest.getShipsOnCamera(this.mCamera);
    
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
    
    this.mStormSet.update(this.mMiniMap);
    
    // Spawn the storms
    if(this.mAutoSpawnTimer <= 0)
    {
        this.mAutoSpawnTimer = Math.random() * 60 + 120;
        this.mStormSet.createStorm(this.kStormTex);
    }
    
    this.checkRockCollisions();
    
    this.checkCannonballCollision();
    
    // Hero previously collided
    // check whether or not to shake camera
    if (this.mHeroTest.mInvincible === true) 
    {
        var camShake = this.mCamera.getCameraShake();
        if (camShake !== null && !camShake.shakeDone())
            camShake.updateShakeState();
    }
    
    this.checkAllStormShipCollisions();
    this.checkPirateCollisionsWithPlayer();

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
    
    this.mSpaceBG.getXform().setPosition(this.mHeroTest.getXform().getPosition()[0], this.mHeroTest.getXform().getPosition()[1]);
};

MainGame.prototype.checkAllStormShipCollisions = function()
{
    this.checkStormShipCollision(this.mHeroTest);
    
    var OnScreenShips = this.mPirateSetTest.getShipsOnCamera(this.mCamera);
    for (var i = 0; i < OnScreenShips.length; i++)
    {
        var pShip = OnScreenShips[i];
        this.checkStormShipCollision(pShip);
    }
    
}

MainGame.prototype.checkStormShipCollision = function(ship)
{
    for (var i = 0; i < this.mStormSet.size(); i++)
    {
        var storm = this.mStormSet.getObjectAt(i);
        
        var maxDistance = storm.getXform().getHeight() * 2;
        var distance = vec2.distance(ship.getPosition(), storm.getXform().getPosition());
        var distanceRatio = (maxDistance - distance) / maxDistance; 
        
        if (distanceRatio > 0)
        {   
            var speedRatio = storm.getRotSpeed() / 10 + .25;
            var sizeRatio = storm.getSize() / 15 + .25;

            ship.moveTowards(storm.getXform().getPosition(), ship.getTurningDelta() * distanceRatio * speedRatio * sizeRatio);
            ship.incSpeedBy(ship.getSpeedDelta() + ship.getSpeedDelta() * distanceRatio * speedRatio * sizeRatio);
        }    
    }
}

MainGame.prototype.checkRockCollisions = function()
{
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

        var onScreenShips = this.mPirateSetTest.getShipsOnCamera(this.mCamera);
        
        for (var j = 0; j < onScreenShips.length; j++)
        {
            var pShip = onScreenShips[j];
            pShip.checkHit(rock);
        }
    }
}

MainGame.prototype.checkCannonballCollision = function()
{
    var onScreenShips = this.mPirateSetTest.getShipsOnCamera(this.mCamera);
    
    for (var i = 0; i < onScreenShips.length; i++)
    {
        var pShip = onScreenShips[i];
        // check cannonball collision
        if (pShip.isChasingPlayer())
        {
            var cannonballs = pShip.getCannonballSet();
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
    }
}

MainGame.prototype.checkPirateCollisionsWithPlayer = function()
{
    var onScreenShips = this.mPirateSetTest.getShipsOnCamera(this.mCamera);
    
    for (var i = 0; i < onScreenShips.length; i++)
    {    
        var pShip = onScreenShips[i];
        
        var c = new CollisionInfo();
        if (this.mHeroTest.getRigidBody().collisionTest(pShip.getRigidBody(), c))
        {
            gEngine.Physics.resolveCollision(this.mHeroTest.getRigidBody(), pShip.getRigidBody(), c);
            this.mHeroTest.getRigidBody().setAngularVelocity(0);
            pShip.getRigidBody().setAngularVelocity(0);

        }
    }
}
