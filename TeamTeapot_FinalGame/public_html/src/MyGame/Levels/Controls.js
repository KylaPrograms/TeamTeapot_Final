/*
 * File:        StartMenu.js
 * Programmers: Kyla            March 9, 2019
 *
 * This is the first scene that the player should encounter
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Controls() {
    this.kUIButton = "assets/UI/button.png";
    this.kW = "assets/W.png";this.kW = "assets/W.png";
    this.kA = "assets/A.png";
    this.kS = "assets/S.png";
    this.kD = "assets/D.png";
    this.kBack = "assets/Back.png";
    
    this.kBG = "assets/NightOcean2.png";
    
    // The camera to view the scene
    this.mCamera = null;
    
    this.mW = null;
    this.mA = null;
    this.mS = null;
    this.mD = null;
    
    this.mBackButton = null;
    
    this.LevelSelect = null;
}
gEngine.Core.inheritPrototype(Controls, Scene);


Controls.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kUIButton);
    gEngine.Textures.loadTexture(this.kW);
    gEngine.Textures.loadTexture(this.kA);
    gEngine.Textures.loadTexture(this.kS);
    gEngine.Textures.loadTexture(this.kD);
    gEngine.Textures.loadTexture(this.kBack);
    gEngine.Textures.loadTexture(this.kBG);
};

Controls.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kUIButton);
    gEngine.Textures.unloadTexture(this.kW);
    gEngine.Textures.unloadTexture(this.kA);
    gEngine.Textures.unloadTexture(this.kS);
    gEngine.Textures.unloadTexture(this.kD);
    gEngine.Textures.unloadTexture(this.kBack);
    gEngine.Textures.unloadTexture(this.kBG);
    
    gEngine.Core.startScene(new StartMenu());
};

Controls.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
            
    this.mBG = new SpriteRenderable(this.kBG);
    this.mBG.setElementPixelPositions(0, 2048, 0, 2048);
    this.mBG.getXform().setPosition(0, 0);
    this.mBG.getXform().setSize(100, 75);
    
    this.mW = new UISprite(this.kW, [400, 300], [610, 610], [0, 1, 0, 1]);
    
    this.mBackButton = new UIButton(this.kBack,this.backSelect,this,[100,50],[200,100],"",0,[1,1,1,1],[0,0,0,1]);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Controls.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.mCamera.setupViewProjection();
    this.mBG.draw(this.mCamera);
    this.mW.draw(this.mCamera);
//    this.mA.draw(this.mCamera);
//    this.mS.draw(this.mCamera);
//    this.mD.draw(this.mCamera);
    this.mBackButton.draw(this.mCamera);
};

Controls.prototype.update = function () {
    this.mBackButton.update();
};

Controls.prototype.backSelect = function(){
    gEngine.GameLoop.stop();
};