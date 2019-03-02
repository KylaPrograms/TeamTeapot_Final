/*
 * File:        MyGame.js
 * Programmers: Kyla            March 1, 2019
 *              
 *
 */

/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    this.kPlaceHolder = "assets/PlaceHolder.png";
    this.kOceanPlaceHolder = "assets/OceanPlaceHolder.png";
    
    // The camera to view the scene
    this.mCamera = null;
    
    this.mTempBG = null;
    this.mHeroTest = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kPlaceHolder);
    gEngine.Textures.loadTexture(this.kOceanPlaceHolder);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kPlaceHolder);
    gEngine.Textures.unloadTexture(this.kOceanPlaceHolder);
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0, 0.79, 1, 1]);
            // sets the background to gray
    this.mCamera.configInterpolation(0, 1);
    
    this.mTempBG = new TextureRenderable(this.kOceanPlaceHolder);
    this.mTempBG.getXform().setPosition(0, 0);
    this.mTempBG.getXform().setSize(100, 100);
    
    this.mHeroTest = new Hero(this.kPlaceHolder);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    
    this.mTempBG.draw(this.mCamera);
    this.mHeroTest.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    this.mHeroTest.update();
    
    var heroPos = this.mHeroTest.getXform().getPosition();
    this.mCamera.setWCCenter(heroPos[0], heroPos[1]);
    
    this.mCamera.update();
};
