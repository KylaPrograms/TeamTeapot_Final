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
    
    // The camera to view the scene
    this.mCamera = null;
    
    this.mBackButton = null;
    
    this.LevelSelect = null;
}
gEngine.Core.inheritPrototype(Controls, Scene);


Controls.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kUIButton);
};

Controls.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kUIButton);
    
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
    gEngine.DefaultResources.setGlobalAmbientIntensity(1);
    
    this.mBackButton = new UIButton(this.kUIButton,this.backSelect,this,[400,300],[600,100],"Back",8,[1,1,1,1],[0,0,0,1]);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Controls.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.mCamera.setupViewProjection();
    this.mBackButton.draw(this.mCamera);
};

Controls.prototype.update = function () {
    this.mBackButton.update();
};

Controls.prototype.backSelect = function(){
    gEngine.GameLoop.stop();
};