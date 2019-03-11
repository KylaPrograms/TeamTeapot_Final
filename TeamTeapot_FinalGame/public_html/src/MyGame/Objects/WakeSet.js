/*
 * File:        WakeSet.js
 * Programmers: Kyla            March 10, 2019
 *
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function WakeSet()
{
    GameObjectSet.call(this);
}
gEngine.Core.inheritPrototype(WakeSet, GameObjectSet);

WakeSet.prototype.update = function()
{
    for(var i = 0; i < this.size(); i++)
    {
        this.mSet[i].update();
        if(this.mSet[i].isDead())
        {
            this.mSet.splice(i, 1);
            console.log("wake died");
        }
    }
};