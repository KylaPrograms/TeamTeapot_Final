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

function StartMenu() {
    this.kUIButton = "assets/UI/button.png";
    
    // The camera to view the scene
    this.mCamera = null;
    
    this.UIText = null;
    
    this.mPlayButton = null;
    this.mControlsButton = null;
    this.mCreditsButton = null;
    
    this.LevelSelect = null;
}
gEngine.Core.inheritPrototype(StartMenu, Scene);


StartMenu.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kUIButton);
};

StartMenu.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kUIButton);
    if(this.LevelSelect==="Play"){
        gEngine.Core.startScene(new MainGame());
    }
    else if(this.LevelSelect==="Controls"){
        //gEngine.Core.startScene(new RigidShapeDemo());
    }
    else if(this.LevelSelect==="Credits"){
        //gEngine.Core.startScene(new UIDemo());
    }
};

StartMenu.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
    this.UIText = new UIText("Game Engine Tech Demo",[400,600],8,1,0,[0,0,0,1]);
    
    this.mPlayButton = new UIButton(this.kUIButton,this.playSelect,this,[400,400],[600,100],"Play",8,[1,1,1,1],[0,0,0,1]);
    this.mControlsButton = new UIButton(this.kUIButton,this.controlsSelect,this,[400,300],[500,100],"Controls",8,[1,1,1,1],[0,0,0,1]);
    this.mCreditsButton =  new UIButton(this.kUIButton,this.creditsSelect,this,[400,200],[320,100],"Credits",8,[1,1,1,1],[0,0,0,1]);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
StartMenu.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    
    this.mCamera.setupViewProjection();
    this.mPlayButton.draw(this.mCamera);
    this.mControlsButton.draw(this.mCamera);
    this.mCreditsButton.draw(this.mCamera);
    this.UIText.draw(this.mCamera);
};

StartMenu.prototype.update = function () {
    this.mPlayButton.update();
    this.mControlsButton.update();
    this.mCreditsButton.update();
};

StartMenu.prototype.playSelect = function(){
    this.LevelSelect="Play";
    gEngine.GameLoop.stop();
};

StartMenu.prototype.controlsSelect = function(){
    this.LevelSelect="Controls";
    gEngine.GameLoop.stop();
};

StartMenu.prototype.creditsSelect= function(){
    this.LevelSelect="Credits";
    gEngine.GameLoop.stop();
};