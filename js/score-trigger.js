/*
    Copyright 2021. Futurewei Technologies Inc. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http:  www.apache.org/licenses/LICENSE-2.0
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
import { Component, Type } from "@wonderlandengine/api";
import { state } from "./game";
/**
@brief Score trigger

Check overlap with bullet objects to spawn confetti particles and
update the score.

This component is automatically attached to newly spawned mouse 
objects, see `mouse-spawner`.
*/

const tempQuat2 = new Float32Array(8);

export class ScoreTrigger extends Component {
    static TypeName = "score-trigger";
    static Properties = {
        particles: { type: Type.Object },
    };

    init() {
        this.collision = this.object.getComponent('collision');
        this.soundHit = this.object.addComponent("howler-audio-source", {
            src: "sfx/high-pitched-aha-103125.mp3",
            volume: 1.9,
        });
        this.soundPop = this.object.addComponent("howler-audio-source", {
            src: "sfx/pop-94319.mp3",
            volume: 1.9,
        });
        state.victoryMusic = this.object.addComponent("howler-audio-source", {
            src: "music/level-win-6416.mp3",
            volume: 1.9,
        });
    }

    onHit() {
        this.particles.setTransformWorld(this.object.getTransformWorld(tempQuat2));
        this.particles.getComponent("confetti-particles").burst();
        // console.log("onHit ID: "+this.object.parent.objectId);
        // this.object.parent.destroy();

        state.despawnTarget(this.object.parent);
        state.incrementScore();

        this.soundHit.play();
        this.soundPop.play();
    }
};
