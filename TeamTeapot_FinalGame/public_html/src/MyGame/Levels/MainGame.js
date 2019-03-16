/*
 * File:        MainGame.js
 * Programmers: Kyla            March 13, 2019
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
    this.kShipTex = "assets/Ships.png";
    this.kShipCollisionTex = "assets/Ships128.png";
    this.kOceanNormal = "assets/OceanNormal.png";
    this.kOceanPlaceHolder = "assets/Ocean.png";
    this.kSpaceTex = "assets/Space.png";
    this.kHealthBar = "assets/UI/healthbar.png";
    
    this.kStormTex = "assets/Storm.png";
    this.kRocksTex = "assets/Rocks.png";
    this.kGemTex = "assets/Gems.png";
    this.kMiniMap = "assets/miniMap.png";
    
    this.kTreasureSpawnFile = "assets/JSON/TreasureSpawnPos.json";
    
    // The camera to view the scene
    this.mCamera = null;
    this.mMiniMap = null;
    this.mMiniMapTranslucent = null;
    this.mMiniMapXOffset = 74.375;
    this.mMiniMapYOffset = 55.625;
    
    this.mWorldBounds = [-150, 150, -150, 150];
    this.mWorldWCxRange = this.mWorldBounds[1]-this.mWorldBounds[0];
    this.mWorldWCyRange = this.mWorldBounds[3]-this.mWorldBounds[2];
    
    this.mTempBG = null;
    this.mSpaceBG = null;
    this.mHeroTest = null;
    this.mPirateTest = null;
    
    this.mTreasureSpawnPosSet = [];
    this.mTreasureSetTest = null;
    
    this.mRockSet = null;
    this.mStormSet = null;
    
    this.mHealthBar = null;
    this.mTreasureUI = null;
    
    this.mGameState = null;
}
gEngine.Core.inheritPrototype(MainGame, Scene);

MainGame.prototype.loadScene = function ()
{
    gEngine.Textures.loadTexture(this.kPlaceHolder);
    gEngine.Textures.loadTexture(this.kShipTex);
    gEngine.Textures.loadTexture(this.kShipCollisionTex);
    gEngine.Textures.loadTexture(this.kOceanPlaceHolder);
    gEngine.Textures.loadTexture(this.kOceanNormal);
    gEngine.Textures.loadTexture(this.kSpaceTex);
    gEngine.Textures.loadTexture(this.kHealthBar);
    
    gEngine.Textures.loadTexture(this.kStormTex);
    gEngine.Textures.loadTexture(this.kRocksTex);
    gEngine.Textures.loadTexture(this.kGemTex);
    gEngine.Textures.loadTexture(this.kMiniMap);
    
    gEngine.AudioClips.loadAudio(this.kBGMusic);
    
    gEngine.TextFileLoader.loadTextFile(this.kTreasureSpawnFile, gEngine.TextFileLoader.eTextFileType.eJSONFile);
};

MainGame.prototype.unloadScene = function ()
{
    gEngine.Textures.unloadTexture(this.kPlaceHolder);
    gEngine.Textures.unloadTexture(this.kShipTex);
    gEngine.Textures.unloadTexture(this.kShipCollisionTex);
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
    
    gEngine.ResourceMap.unloadAsset(this.kTreasureSpawnFile);

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
    //gEngine.AudioClips.playBackgroundAudio(this.kBGMusic);
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
    
    this.mMiniMapTranslucent = new UISpriteRenderable(this.kMiniMap);
    this.mMiniMapTranslucent.setElementPixelPositions(0, 256, 0, 192);
    this.mMiniMapTranslucent.getXform().setSize(400, 400);
    this.mMiniMapTranslucent.getXform().setPosition(0, 0);
//    for (var i = 0; i < this.mGlobalLightSet.numLights(); i++) {
//        this.mMiniMapTranslucent.addLight(this.mGlobalLightSet.getLightAt(i));   // all the lights
//    }
    
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
    
    this.mHeroTest = new PlayerShip(this.kShipTex, this.kShipCollisionTex, this.kPlaceHolder);
    this.mPirateTest = new PirateShip(this.kShipTex, this.kShipCollisionTex, this.kPlaceHolder, this.kPlaceHolder);
    
    this.mTreasureSetTest = new SunkenTreasureSet(this.kPlaceHolder, this.kTreasureSpawnFile);
    
    
    this.mStormSet = new StormSet(this.kStormTex, this.mWorldWCxRange, this.mWorldWCyRange,
                                                    this.mHeroTest);
    
        // Spawn the rocks
    this.mRockSet = new RockSet(this.kRocksTex);
    this.mGameState = new GameState(this.mHeroTest);
    
    this.mHealthBar = new UIHealthBar(this.kHealthBar, [100,580], [175,20], 0);
    
    this.mTreasureUI = new UIItemSlotSet([30, 540]);
    for(var i = 0; i < this.mTreasureSetTest.size(); i++)
    {
        this.mTreasureUI.addToSet(this.kGemTex, [30, 30], [0, 0.5, 0, 1], [0.5, 1, 0, 1]);
    }
    
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
    this.mTreasureSetTest.draw(this.mCamera);
    this.mHeroTest.draw(this.mCamera);
    
    this.mRockSet.draw(this.mCamera);
    
    this.mStormSet.draw(this.mCamera);
    
    this.mHealthBar.draw(this.mCamera);
    this.mTreasureUI.draw(this.mCamera);
    
    //Draw for the minimap
    this.mMiniMap.setupViewProjection();
    
    this.mMiniMapTranslucent.draw(this.mMiniMap);
    this.mPirateTest.drawForMap(this.mMiniMap);
    this.mTreasureSetTest.drawForMap(this.mMiniMap);
    this.mHeroTest.drawForMap(this.mMiniMap);
    this.mStormSet.drawForMap(this.mMiniMap);
    this.mRockSet.drawForMap(this.mMiniMap);
};

