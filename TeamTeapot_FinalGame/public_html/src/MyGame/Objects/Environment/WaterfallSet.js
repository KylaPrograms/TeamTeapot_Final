/*
 * File:        WaterfallSet.js
 * Programmers: Emily           March 17, 2019
 *
 */

/* jslint node: true, vars: true */
/* global gEngine: false, GameObject: false, GameObjectSet: false,
 * SpriteAnimateRenderable: false, Storm: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function WaterfallSet(spriteTexture)
{
    this.mSpriteTex = spriteTexture;
    
    GameObjectSet.call(this);
}
gEngine.Core.inheritPrototype(WaterfallSet, GameObjectSet);

WaterfallSet.prototype.createWaterfalls = function()
{
    for (var side = 0; side < 4; side++)
    {
        this._createSingularWaterfall(-300, -150, 90);
        this._createSingularWaterfall(-300, 0, 90);
        this._createSingularWaterfall(-300, 150, 90);
        
        var x = 0, y = 0, rot;
        if (side === 0)
        {
            x = -300;
            rot = 90;
            
            
        }
        else if (side === 1)
        {
            y = 300;
            rot = 0;
            
//            this._createSingularWaterfall(-50, y, rot);
//            this._createSingularWaterfall(0, y, rot);
//            this._createSingularWaterfall(50, y, rot);
        }
        else if (side === 2)
        {
            x = 300;
            rot = 90;
            
//            this._createSingularWaterfall(x, -50, rot);
//            this._createSingularWaterfall(x, 0, rot);
//            this._createSingularWaterfall(x, 50, rot);
        }
        else if (side === 3)
        {
            y = -300;
            rot = 180;
            
//            this._createSingularWaterfall(-50, y, rot);
//            this._createSingularWaterfall(0, y, rot);
//            this._createSingularWaterfall(50, y, rot);
        }
    }
};

WaterfallSet.prototype._createSingularWaterfall = function(x, y, rot)
{
    var waterfall = new Waterfall(this.mSpriteTex, x, y, rot);
    this.addToSet(waterfall);
};
