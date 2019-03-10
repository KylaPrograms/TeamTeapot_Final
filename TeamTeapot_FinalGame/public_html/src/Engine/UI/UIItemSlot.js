/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function UIItemSlot (sprite, position, size, UVempty, UVfull)
{
    this.mUVempty = UVempty;
    this.mUVfull = UVfull;
    this.mFull = false;
    
    UISprite.call(this, sprite, position, size, UVempty);
}
gEngine.Core.inheritPrototype(UIItemSlot, UISprite);

UIItemSlot.prototype.isFull = function()
{
    return this.mFull;
};

UIItemSlot.prototype.setToFull = function()
{
    this.mFull = true;
    this.mSprite.setElementUVCoordinate(this.mUVfull[0], this.mUVfull[1],
                                        this.mUVfull[2], this.mUVfull[3]);
};