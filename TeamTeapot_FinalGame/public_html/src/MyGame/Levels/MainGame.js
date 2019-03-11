/*
 * File:        MainGame.js
 * Programmers: Kyla            March 10, 2019
 *              Emily           March 2, 2019
 *
 */

/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectSet, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject, Storm, StormSet, Rock, RockSet, Light, LightSet */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MainGame() {
    this.mAmbientLight = null;
    this.mGlobalLightSet = null;
    
    this.kBGMusic = "assets/Sounds/GameBackground.mp3";
    
    this.kPlaceHolder = "assets/PlaceHolder.png";
    this.kShipTex = "assets/Ships512.png";
    this.kOceanNormal = "assets/OceanNormal.png";
    this.kOceanPlaceHolder = "assets/Ocean.png";
    this.kSpaceTex = "assets/Space.png";
    this.kHealthBar = "assets/UI/healthbar.png";
    
    this.kStormTex = "assets/Storm.png";
    this.kRocksTex = "assets/Rocks.png";
    this.kGemTex = "assets/Gems.png";
    this.kMiniMap = "assets/miniMap.png";
    
    // The camera to view the scene
    this.mCamera = null;
    this.mMiniMap = null;
    this.mMiniMapTranslucent = null;
    this.mMiniMapXOffset = 74.375;
    this.mMiniMapYOffset = 55.625;
    
    this.mWorldWCxRange = 300;
    this.mWorldWCyRange = 300;
    
    this.mTempBG = null;
    this.mSpaceBG = null;
    this.mHeroTest = null;
    this.mPirateTest = null;
    this.mSunkenTreasureTest = null;
    this.mSunkenTreasureTest1 = null;
    this.mSunkenTreasureTest2 = null;
    this.mSunkenTreasureSetTest = null;
    
    this.mRockSet = null;
    this.mStormSet = null;
    
    this.mDamageBar = null;
    this.mTreasureSet = null;
    this.mTreasureUITest = null;
    
    this.mWakeTest = null;
    this.mWakeTestTimer = 0;
    
    this.mGameState = null;
}
gEngine.Core.inheritPrototype(MainGame, Scene);

MainGame.prototype.loadScene = function ()
{
    gEngine.Textures.loadTexture(this.kPlaceHolder);
    gEngine.Textures.loadTexture(this.kShipTex);
    gEngine.Textures.loadTexture(this.kOceanPlaceHolder);
    gEngine.Textures.loadTexture(this.kOceanNormal);
    gEngine.Textures.loadTexture(this.kSpaceTex);
    gEngine.Textures.loadTexture(this.kHealthBar);
    
    gEngine.Textures.loadTexture(this.kStormTex);
    gEngine.Textures.loadTexture(this.kRocksTex);
    gEngine.Textures.loadTexture(this.kGemTex);
    gEngine.Textures.loadTexture(this.kMiniMap);
    
    gEngine.AudioClips.loadAudio(this.kBGMusic);
};

MainGame.prototype.unloadScene = function ()
{
    gEngine.Textures.unloadTexture(this.kPlaceHolder);
    gEngine.Textures.unloadTexture(this.kShipTex);
    gEngine.Textures.unloadTexture(this.kOceanPlaceHolder);
    gEngine.Textures.unloadTexture(this.kOceanNormal);
    gEngine.Textures.unloadTexture(this.kSpaceTex);
    gEngine.Textures.unloadTexture(this.kHealthBar);
    
    gEngine.Textures.unloadTexture(this.kStormTex);
    gEngine.Textures.unloadTexture(this.kRocksTex);
    gEngine.Textures.unloadTexture(this.kGemTex);
    gEngine.Textures.unloadTexture(this.kMiniMap);
    
    gEngine.AudioClips.stopBackgroundAudio();
    gEngine.AudioClips.unloadAudio(this.kBGMusic);

    //Check whether the player won or lost the game
    var nextLevel = null;
    if(this.mGameState.isGameWin()) 
    {
        nextLevel = new WinScreen();
    } else {
        nextLevel = new GameOver();
    }
    gEngine.Core.startScene(nextLevel);
};

MainGame.prototype.initialize = function ()
{
    gEngine.AudioClips.playBackgroundAudio(this.kBGMusic);
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
//    this.mAmbientLight = [];
//    this.mAmbientLight[0] = 0.8;
//    this.mAmbientLight[1] = 0.8;
//    this.mAmbientLight[2] = 0.8;
    
    this._initializeLights();
    
    // Set up the main camera
    this.mCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0, 0.79, 1, 1]);
    this.mCamera.configInterpolation(0, 1);
    
    // Create the minimap
    this.mMiniMap = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        200,                     // width of camera
        [595, 445, 200, 150]         // viewport (orgX, orgY, width, height)
    );
    this.mMiniMap.setBackgroundColor([0.8, 0.8, 0.8, 1.0]);
    this.mMiniMap.configInterpolation(0, 1);
    this.mMiniMap.setBGDraw(false);
    
    this.mMiniMapTranslucent = new LightRenderable(this.kMiniMap);
    this.mMiniMapTranslucent.setElementPixelPositions(0, 256, 0, 192);
    this.mMiniMapTranslucent.getXform().setSize(400, 400);
    //this.mMiniMapTranslucent.getXform().setPosition(this.mMiniMapXOffset, 
    //                                                this.mMiniMapYOffset);
    this.mMiniMapTranslucent.getXform().setPosition(0, 0);
    for (var i = 0; i < this.mGlobalLightSet.numLights(); i++) {
        this.mMiniMapTranslucent.addLight(this.mGlobalLightSet.getLightAt(i));   // all the lights
    }
    
    // Create the ocean background
    this.mTempBG = new IllumRenderable(this.kOceanPlaceHolder, this.kOceanNormal);
    this.mTempBG.setElementPixelPositions(0, 4096, 0, 4096);
    this.mTempBG.getXform().setPosition(0, 0);
    this.mTempBG.getXform().setSize(this.mWorldWCxRange, this.mWorldWCyRange);

    for (var i = 0; i < this.mGlobalLightSet.numLights(); i++) {
        this.mTempBG.addLight(this.mGlobalLightSet.getLightAt(i));   // all the lights
    }
    
    this.mSpaceBG = new SpriteRenderable(this.kSpaceTex);
    this.mSpaceBG.setElementPixelPositions(0, 2048, 0, 2048);
    this.mSpaceBG.getXform().setPosition(0, 0);
    this.mSpaceBG.getXform().setSize(100, 100);
    
    this.mHeroTest = new Hero(this.kShipTex, this.kPlaceHolder);
    this.mPirateTest = new PirateShip(this.kShipTex, this.kPlaceHolder);
    
    this.mSunkenTreasureTest = new SunkenTreasure(this.kPlaceHolder, -5, 5);
    this.mSunkenTreasureTest1 = new SunkenTreasure(this.kPlaceHolder, -90, 50);
    this.mSunkenTreasureTest2 = new SunkenTreasure(this.kPlaceHolder, 85, -40);
    this.mSunkenTreasureSetTest = new SunkenTreasureSet();
    this.mSunkenTreasureSetTest.addToSet(this.mSunkenTreasureTest);
    this.mSunkenTreasureSetTest.addToSet(this.mSunkenTreasureTest1);
    this.mSunkenTreasureSetTest.addToSet(this.mSunkenTreasureTest2);
    
    this.mStormSet = new StormSet(this.kStormTex, this.mWorldWCxRange, this.mWorldWCyRange,
                                                    this.mHeroTest);
    
        // Spawn the rocks
    this.mRockSet = new RockSet(this.kRocksTex);
    this.mGameState = new GameState(this.mHeroTest);
    
    this.mDamageBar = new UIDamageBar(this.kHealthBar,[100,580],[175,20],0);
    
    this.mTreasureSet = new UIItemSlotSet([30, 540]);
    for(var i = 0; i < 3; i++)
    {
        this.mTreasureSet.addToSet(this.kGemTex, [30, 30], [0, 0.5, 0, 1], [0.5, 1, 0, 1]);
    }
    
    this.mWakeTest = new WakeSet();
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MainGame.prototype.draw = function ()
{
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    //Draw for the main camera
    this.mCamera.setupViewProjection();
    this.mSpaceBG.draw(this.mCamera);
    this.mTempBG.draw(this.mCamera);
    this.mPirateTest.draw(this.mCamera);
    this.mSunkenTreasureSetTest.draw(this.mCamera);
    this.mHeroTest.draw(this.mCamera);
    
    this.mRockSet.draw(this.mCamera);
    
    this.mStormSet.draw(this.mCamera);
    
    //this.mWakeTest.draw(this.mCamera);
    
    this.mDamageBar.draw(this.mCamera);
    this.mTreasureSet.draw(this.mCamera);
    
    //Draw for the minimap
    this.mMiniMap.setupViewProjection();
    
    //this.mTempBG.draw(this.mMiniMap);
    this.mMiniMapTranslucent.draw(this.mMiniMap);
    this.mPirateTest.drawForMap(this.mMiniMap);
    this.mSunkenTreasureSetTest.drawForMap(this.mMiniMap);
    this.mHeroTest.drawForMap(this.mMiniMap);
    this.mStormSet.drawForMap(this.mMiniMap);
    this.mRockSet.drawForMap(this.mMiniMap);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MainGame.prototype.update = function ()
{
    this.mHeroTest.update();
    if (!this.mHeroTest.getWithinWorldBounds())
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
    
    if(this.mSunkenTreasureSetTest.collectAt(heroPos[0], heroPos[1]))
    {
        this.mHeroTest.addTreasure();
        this.mGameState.addTreasure();
        this.mTreasureSet.fillSlot();
    }
    
    this.mSunkenTreasureSetTest.update();
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
            // if hero is invincible, don't bother checking 
            //if (this.mHeroTest.mInvincible === false)
            {
                var isHit = this.mHeroTest.checkHit(rock);

                    // if touching rock, then hit
                    if (isHit)
                    {
                        // update herowddd
                        //this.mHeroTest.hit(rock);
                        //if (this.mHeroTest.mInvincible === false)
                            

                        // camera shake
                        var displacement = 2;           // move camera by 2 units
                        var frequency = 5;              // shake 5 times a second
                        var duration = 30;              // half a second

                        this.mCamera.setCameraShake(displacement, displacement, frequency, duration);

                                        // Update Damage barcode
                        this.mDamageBar.setCurrentHP(this.mHeroTest.getDamage());
                        this.mDamageBar.update();
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
            //this.mHeroTest.hit(this.mPirateTest);
            //this.mPirateTest.hit(this.mHeroTest);
            
        }

    
    
    //Pressing 'x' deals damage to the ship.
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.X))
    {
        this.mHeroTest.incDamageBy(10);
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
    
//    this.mWakeTest.update();
//    if(this.mWakeTestTimer >= 20)
//    {
//        this.mWakeTest.createWakeFromShip(this.mHeroTest, this.kPlaceHolder, [2, 1], 0.01);
//        this.mWakeTestTimer = 0;
//    }
// 
//    this.mWakeTestTimer++;
    
    this.mSpaceBG.getXform().setPosition(this.mHeroTest.getXform().getPosition()[0], this.mHeroTest.getXform().getPosition()[1]);
//    this.mWakeTest.update();
//    if(this.mWakeTestTimer >= 20)
//    {
//        this.mWakeTest.createWakeFromShip(this.mHeroTest, this.kPlaceHolder, [2, 1], 0.01);
//        this.mWakeTestTimer = 0;
//    }
//    this.mWakeTestTimer++;
};
