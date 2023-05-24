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
import { HowlerAudioSource } from "@wonderlandengine/components";
import { state } from "./game";
import { MouseMover } from "./mouse-mover";
import { ScoreTrigger } from "./score-trigger";
/**
@brief Spawns in mice at set intervals until maxTargets is reached.
*/

const tempQuat2 = new Float32Array(8);

export class MouseSpawner extends Component {
    static TypeName = "mouse-spawner";
    static Properties = {
        targetMesh: { type: Type.Mesh },
        targetMaterial: { type: Type.Material },
        spawnAnimation: { type: Type.Animation },
        maxTargets: { type: Type.Int, default: 20 },
        particles: { type: Type.Object },
        spawnIntervalCeiling: { type: Type.Float, default: 3.0 },
        spawnIntervalFloor: { type: Type.Float, default: 1.0 },
        bulletMesh: { type: Type.Mesh },
        bulletMaterial: { type: Type.Material },
    };

    static onRegister(engine) {
        engine.registerComponent(ScoreTrigger);
        engine.registerComponent(HowlerAudioSource);
        engine.registerComponent(MouseMover);
    }

    time = 0;
    spawnInterval = 3;
    targets = [];

    init() {
        state.despawnTarget = function (obj) {
            console.log("despawnTarget ID: " + obj.objectId);
            for (let i = 0; i < this.targets.length; i++) {
                if (obj.objectId == this.targets[i].objectId) {
                    this.targets.splice(i,1);
                    break;
                }
            }
            obj.destroy();
        }.bind(this);
    }

    start() {
        state.mouseSpawner = this;
        state.mouseSound = this.object.addComponent(HowlerAudioSource, {
            src: "sfx/critter-40645.mp3",
            loop: true,
            volume: 1.0,
        });

        this.maxTargets = 2;
        state.maxTargets = this.maxTargets;
        this.spawnInterval = this.spawnIntervalCeiling;
        this.spawnTarget();
    }

    update(dt) {
        this.time += dt;
        if (state.targetsSpawned >= this.maxTargets) return;

        if (this.time >= this.spawnInterval) {
            this.time = 0;
            this.spawnTarget();
            //gradually increases spawn interval until it hits the floor
            if (this.spawnInterval > this.spawnIntervalFloor) {
                this.spawnInterval *= .8;
            }
        }
    }

    reset() {
        for (let i = 0; i < this.targets.length; i++) {
            this.targets[i].destroy();
        }
        this.targets = [];
        this.object.resetPosition();
    }

    spawnTarget() {
        const obj = this.engine.scene.addObject();
        obj.setTransformLocal(this.object.getTransformWorld(tempQuat2));

        obj.scaleLocal([0.1, 0.1, 0.1]);
        const mesh = obj.addComponent('mesh');
        mesh.mesh = this.targetMesh;
        mesh.material = this.targetMaterial;
        mesh.active = true;
        obj.addComponent(MouseMover);

        if (this.spawnAnimation) {
            const anim = obj.addComponent("animation");
            anim.playCount = 1;
            anim.animation = this.spawnAnimation;
            anim.active = true;
            anim.play();
        }

        /* Add scoring trigger */
        const trigger = this.engine.scene.addObject(obj);
        trigger.addComponent("collision", {
            collider: WL.Collider.Sphere,
            extents: [0.6, 0, 0],
            group: 1 << 0,
            active: true,
        });

        trigger.translateLocal([0, 0.7, 0]);
        trigger.addComponent(ScoreTrigger, {
            particles: this.particles
        });

        obj.setDirty();

        state.targetsSpawned++;
        this.targets.push(obj);
        console.log("spawnTarget ID: " + obj.objectId);
        state.mouseSound.play();
    }
};
