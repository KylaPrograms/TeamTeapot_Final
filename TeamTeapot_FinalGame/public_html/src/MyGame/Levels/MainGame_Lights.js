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

    var l = this._createALight(
        [0, 0, 5],       // Hero
        [0.2, 0.2, 0.2, 0.5],  // some color
        0, 20,             // Near and Far
        3.5                // intensity
    );
    this.mGlobalLightSet.addToSet(l);
    
    l = this._createALight(
        [0, 3, 8],       // pirate
        [0.2, 0.2, 0.2, 0.5],  // some color
        0, 15,             // Near and Far
        2.75               // intensity
    );
    this.mGlobalLightSet.addToSet(l);
};

MainGame.prototype.updateHeroLight = function(hero)
{
    var heroPos = hero.getXform().getPosition();
    this.mGlobalLightSet.getLightAt(0).setXPos(heroPos[0]);
    this.mGlobalLightSet.getLightAt(0).setYPos(heroPos[1]);
};

MainGame.prototype.updatePirateLight = function(pirate)
{
    var piratePos = pirate.getXform().getPosition();
    this.mGlobalLightSet.getLightAt(1).setXPos(piratePos[0]);
    this.mGlobalLightSet.getLightAt(1).setYPos(piratePos[1]);
};