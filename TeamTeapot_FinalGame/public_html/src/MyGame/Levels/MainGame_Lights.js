/*
 * File:        MainGame_Lights.js
 * Programmers: Emily           March 4, 2019
 *
 */

/*
 * File: MyGame_Lights.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, MainGame, Light, LightSet */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

MainGame.prototype._createALight = function (pos, color, n, f, intensity) {
    var light = new Light();
    light.setColor(color);
    light.setXPos(pos[0]);
    light.setYPos(pos[1]);
    light.setZPos(pos[2]);
    light.setNear(n);
    light.setFar(f);
    light.setIntensity(intensity);

    return light;
};

MainGame.prototype._initializeLights = function () {
    this.mGlobalLightSet = new LightSet();

    this.mGlobalLightSet.addToSet(this.mHeroTest.mLight);

};

MainGame.prototype.updatePirateLight = function()
{
    var OnScreenPirates = this.mPirateSetTest.getShipsOnCamera(this.mCamera);

    this.mTempBG.removeAllLights();
    this.mTempBG.addLight(this.mHeroTest.mLight);
    for (var i = 0; i < this.mPirateSetTest.size(); i++)
    {
        var light = this.mPirateSetTest.getObjectAt(i).mLight
        this.mTempBG.addLight(light);
    }

};

MainGame.prototype.updateAmbientLighting = function()
{
    var newLight = this.kMaxBrightness - (this.kMaxBrightness - this.kMinBrightness) * this.mElapsedTime / this.kDarkestTime;
    
    newLight = Math.max(newLight, this.kMinBrightness)
    
    gEngine.DefaultResources.setGlobalAmbientIntensity(newLight);
};