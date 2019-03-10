/*
 * File:        MyGame.js
 * Programmers: Kyla            March 1, 2019
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

function MyGame() {
    this.mAmbientLight = null;
    this.mGlobalLightSet = null;
    
    this.kPlaceHolder = "assets/PlaceHolder.png";
    this.kOceanPlaceHolder = "assets/OceanPlaceHolder.png";
    
    this.kStormTex = "assets/Storm.png";
    this.kRocksTex = "assets/Rocks.png";
    
    // The camera to view the scene
    this.mCamera = null;
    this.mMiniMap = null;
    
    this.mTreasureStatusTest = null;
    
    this.mTempBG = null;
    this.mHeroTest = null;
    this.mPirateTest = null;
    this.mSunkenTreasureTest = null;
    this.mSunkenTreasureTest1 = null;
    this.mSunkenTreasureTest2 = null;
    this.mSunkenTreasureSetTest = null;
    
    this.mRockSet = null;
    
    this.mStormSet = null;
    this.mAutoSpawnTimer = null;
    
    this.mGameState = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function ()
{
    gEngine.Textures.loadTexture(this.kPlaceHolder);
    gEngine.Textures.loadTexture(this.kOceanPlaceHolder);
    
    gEngine.Textures.loadTexture(this.kStormTex);
    gEngine.Textures.loadTexture(this.kRocksTex);
};

MyGame.prototype.unloadScene = function ()
{
    gEngine.Textures.unloadTexture(this.kPlaceHolder);
    gEngine.Textures.unloadTexture(this.kOceanPlaceHolder);
    
    gEngine.Textures.unloadTexture(this.kStormTex);
    gEngine.Textures.unloadTexture(this.kRocksTex);

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

MyGame.prototype.initialize = function ()
{
    this.mAmbientLight = gEngine.DefaultResources.getGlobalAmbientColor();
    this.mAmbientLight[0] = 0.8;
    this.mAmbientLight[1] = 0.8;
    this.mAmbientLight[2] = 0.8;
    
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
    
    
    // Create the ocean background
    var mTempBGR = new LightRenderable(this.kOceanPlaceHolder);
    mTempBGR.setElementPixelPositions(0, 256, 0, 256);
    mTempBGR.getXform().setPosition(0, 0);
    mTempBGR.getXform().setSize(100, 100);
    for (var i = 0; i < this.mGlobalLightSet.numLights(); i++) {
        mTempBGR.addLight(this.mGlobalLightSet.getLightAt(i));   // all the lights
    }
    this.mTempBG = new GameObject(mTempBGR);
    
    this.mTreasureStatusTest = new FontRenderable("Treasure Collected");
    this.mTreasureStatusTest.setColor([1, 1, 0, 1]);
    this.mTreasureStatusTest.getXform().setPosition(-48, 35);
    this.mTreasureStatusTest.setTextHeight(2.5);
    
    this.mHeroTest = new Hero(this.kPlaceHolder);
    this.mPirateTest = new PirateShip(this.kPlaceHolder);
    
    this.mSunkenTreasureTest = new SunkenTreasure(this.kPlaceHolder, -5, 5);
    this.mSunkenTreasureTest1 = new SunkenTreasure(this.kPlaceHolder, -90, 50);
    this.mSunkenTreasureTest2 = new SunkenTreasure(this.kPlaceHolder, 85, -40);
    this.mSunkenTreasureSetTest = new SunkenTreasureSet();
    this.mSunkenTreasureSetTest.addToSet(this.mSunkenTreasureTest);
    this.mSunkenTreasureSetTest.addToSet(this.mSunkenTreasureTest1);
    this.mSunkenTreasureSetTest.addToSet(this.mSunkenTreasureTest2);
    
    this.mStormSet = new StormSet();
    this.mAutoSpawnTimer = Math.random() + 2;
    
    
    // Spawn the rocks
    this.mRockSet = new RockSet();
    for (var i = 0; i < 10; i++)
    {
        this.mRockSet.createRock(this.kRocksTex);
    }
    
    this.mGameState = new GameState(this.mHeroTest);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function ()
{
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    //Draw for the main camera
    this.mCamera.setupViewProjection();
    this.mTempBG.draw(this.mCamera);
    this.mPirateTest.draw(this.mCamera);
    this.mSunkenTreasureSetTest.draw(this.mCamera);
    this.mHeroTest.draw(this.mCamera);
    
    this.mRockSet.draw(this.mCamera);
    
    this.mStormSet.draw(this.mCamera);
    
    this.mTreasureStatusTest.draw(this.mCamera);
    
    //Draw for the minimap
    this.mMiniMap.setupViewProjection();
    this.mTempBG.draw(this.mMiniMap);
    this.mPirateTest.draw(this.mMiniMap);
    this.mSunkenTreasureSetTest.draw(this.mMiniMap);
    this.mHeroTest.draw(this.mMiniMap);
    this.mStormSet.draw(this.mMiniMap);
    this.mRockSet.draw(this.mMiniMap);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function ()
{
    this.mHeroTest.update();
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
    }
    
    this.mSunkenTreasureSetTest.update();
    this.mCamera.update();
    this.mMiniMap.update();
    
    var currMsg = "Treasure Count: " + this.mHeroTest.getTreasureAmount();
    this.mTreasureStatusTest.setText(currMsg);
    
    //Test GameState update text
    this.mTreasureStatusTest.setText(this.mGameState.displayStatus());
    var camPos = this.mCamera.getWCCenter();
    this.mTreasureStatusTest.getXform().setPosition(camPos[0]-48, camPos[1]+35);
    
    this.mAutoSpawnTimer--;
    this.mStormSet.update();
    
    // Spawn the storms
    if(this.mAutoSpawnTimer <= 0)
    {
        this.mAutoSpawnTimer = Math.random() * 60 + 120;
        this.mStormSet.createStorm(this.kStormTex);
    }
    
    // Check Collision with all rocks in Rock set 
    // if hero is invincible, don't bother checking 
    if (this.mHeroTest.mInvincible === false)
    {
        
        // cycle through all rocks
        for (var i = 0; i < this.mRockSet.mRockSize; i++) 
        {
            var rock = this.mRockSet.mSet[i];
            var isHit = this.mHeroTest.checkHit(rock);
            
            // if touching rock, then hit
            if (isHit)
            {
                // update hero
                this.mHeroTest.hit();
                this.mHeroTest.incDamageBy(10);
                
                // camera shake
                var displacement = 2;           // move camera by 2 units
                var frequency = 5;              // shake 5 times a second
                var duration = 30;              // half a second
                this.mCamera.setCameraShake(displacement, displacement, frequency, duration);
            }
        }
    }
    // Hero previously collided
    // check whether or not to shake camera
    else 
    {
        var camShake = this.mCamera.getCameraShake();
        if (camShake !== null && !camShake.shakeDone())
            camShake.updateShakeState();
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
    
    //console.log(this.mStormSet);
};
