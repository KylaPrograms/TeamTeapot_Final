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

function PlayMenu() {
    this.kUIButton = "assets/UI/button.png";
    this.kEasy = "assets/Play.png";
    this.kNormal = "assets/ControlsButton.png";
    this.kHard = "assets/CreditsButton.png";
    
    this.kBG = "assets/NightOcean2.png";
    this.kBack = "assets/Back.png";
    
    // The camera to view the scene
    this.mCamera = null;
    
    this.mBG = null;
    
    this.mPlayButtonEasy = null;
    this.mPlayButtonNormal = null;
    this.mPlayButtonHard = null;
    this.mBackButton = null;
    
    this.LevelSelect = null;
}
gEngine.Core.inheritPrototype(PlayMenu, Scene);


PlayMenu.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kUIButton);
    gEngine.Textures.loadTexture(this.kBG);
    gEngine.Textures.loadTexture(this.kEasy);
    gEngine.Textures.loadTexture(this.kNormal);
    gEngine.Textures.loadTexture(this.kHard);
    gEngine.Textures.loadTexture(this.kBack);
};

PlayMenu.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kUIButton);
    gEngine.Textures.unloadTexture(this.kBG);
    gEngine.Textures.unloadTexture(this.kEasy);
    gEngine.Textures.unloadTexture(this.kNormal);
    gEngine.Textures.unloadTexture(this.kHard);
    gEngine.Textures.unloadTexture(this.kBack);
    
    if(this.LevelSelect==="PlayEasy"){
        gEngine.Core.startScene(new MainGame("easy"));
    }
    else if(this.LevelSelect==="PlayNormal"){
        gEngine.Core.startScene(new MainGame("normal"));
    }
    else if(this.LevelSelect==="PlayHard"){
        gEngine.Core.startScene(new MainGame("hard"));
    }
    else if (this.LevelSelect==="Back"){
        gEngine.Core.startScene(new StartMenu());
    }
};

PlayMenu.prototype.initialize = function () {
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
    
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
    var uvs = [(15/1024), (995/1024), (330/1024), (690/1024)];
    //this.mGameTitle = new UISprite(this.kGameTitle, [400, 500], [500, 184], uvs);
    
    this.mPlayButtonEasy = new UIButton(this.kEasy,this.playSelectEasy,this,[400,325],[250,125],"",0,[1,1,1,1],[0,0,0,1]);
    this.mPlayButtonNormal = new UIButton(this.kNormal,this.playSelectNormal,this,[400,200],[250,125],"",0,[1,1,1,1],[0,0,0,1]);
    this.mPlayButtonHard = new UIButton(this.kHard,this.playSelectHard,this,[400,75],[250,125],"",0,[1,1,1,1],[0,0,0,1]);
    
    this.mBackButton = new UIButton(this.kBack,this.backSelect,this,[100,50],[200,100],"",0,[1,1,1,1],[0,0,0,1]);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
PlayMenu.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.mCamera.setupViewProjection();
    this.mBG.draw(this.mCamera);
    //this.mGameTitle.draw(this.mCamera);
    this.mPlayButtonEasy.draw(this.mCamera);
    this.mPlayButtonNormal.draw(this.mCamera);
    this.mPlayButtonHard.draw(this.mCamera);
    this.mBackButton.draw(this.mCamera);
};

PlayMenu.prototype.update = function () {
    this.mPlayButtonEasy.update();
    this.mPlayButtonNormal.update();
    this.mPlayButtonHard.update();
    this.mBackButton.update();
};

PlayMenu.prototype.playSelectEasy = function(){
    this.LevelSelect="PlayEasy";
    gEngine.GameLoop.stop();
};

PlayMenu.prototype.playSelectNormal = function(){
    this.LevelSelect="PlayNormal";
    gEngine.GameLoop.stop();
};

PlayMenu.prototype.playSelectHard = function(){
    this.LevelSelect="PlayHard";
    gEngine.GameLoop.stop();
};

PlayMenu.prototype.backSelect = function(){
    this.LevelSelect="Back";
    gEngine.GameLoop.stop();
};
