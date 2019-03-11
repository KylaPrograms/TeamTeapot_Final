/*
 * File: WinScreen.js 
 * This is the logic of our game. 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, MyGame: false, SceneFileParser: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function WinScreen() 
{    
    //Camera to view the scene
    this.mCamera = null;
    this.mCursor = null;
    this.mWinMessage = null;
    this.mMessage = null;
    this.mDirections = null;
    // The camera to view the scene
}
gEngine.Core.inheritPrototype(WinScreen, Scene);

WinScreen.prototype.loadScene = function () {

};

WinScreen.prototype.unloadScene = function () {
    var nextLevel = new StartMenu();
    gEngine.Core.startScene(nextLevel);
};

WinScreen.prototype.initialize = function () {
    //Define Camera with a black background
    this.mCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    
    //Define a cursor with a white background
    this.mCursor = new Renderable();
    this.mCursor.getXform().setSize(4, 4);
    this.mCursor.getXform().setPosition(0, -5);
    this.mCursor.setColor([1, 0, 0, 1]);
    
    //Define the status message to Display
    this.mWinMessage = new FontRenderable("Congratulations!");
    this.mWinMessage.setColor([0, 0.7, 0.7, 1]);
    this.mWinMessage.getXform().setPosition(-20, 10);
    this.mWinMessage.setTextHeight(5);
    
    this.mMessage = new FontRenderable("You finished the demo.");
    this.mMessage.setColor([0, 0.7, 0.7, 1]);
    this.mMessage.getXform().setPosition(-17, 5);
    this.mMessage.setTextHeight(2.5);
    
    this.mDirections = new FontRenderable("Press SPACE to restart the game or " + 
                                "press D to move the cursor");
    this.mDirections.setColor([0, 0.7, 0.7, 1]);
    this.mDirections.getXform().setPosition(-46, 0);
    this.mDirections.setTextHeight(2.5);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
WinScreen.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.mCursor.draw(this.mCamera);
    this.mWinMessage.draw(this.mCamera);
    this.mMessage.draw(this.mCamera);
    this.mDirections.draw(this.mCamera);
};

// The update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
WinScreen.prototype.update = function () {
    // For this very simple game, let's move the first square
    var deltaX = 1;
    var xForm = this.mCursor.getXform();
    
    //Move Cursor to the right. If it goes off screen then loads MyGame
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        xForm.incXPosBy(deltaX);
        if(xForm.getXPos() >= 50) {
            gEngine.GameLoop.stop();
        }
    }    
    //Switch back to MyGame
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        gEngine.GameLoop.stop();
    }
};