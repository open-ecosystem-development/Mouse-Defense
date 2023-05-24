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
@brief Spawns a new bullet object when the player presses the spacebar.
*/
var bulletSpawnerKeyboard = null;
var firstShot = false;

export class BulletSpawnerKeyboard extends Component {
    static TypeName = "bullet-spawner-keyboard";
    static Properties = {
        bulletMesh: { type: Type.Mesh },
        bulletMaterial: { type: Type.Material },
        bulletSpeed: { type: Type.Float, default: 1.0 },
    }

    init() {
        this.spacebar = false;

        window.addEventListener('keydown', this.press.bind(this));
        window.addEventListener('keyup', this.release.bind(this));
    }

    start() {
        this.bullets = [];
        this.nextIndex = 0;
        this.lastShotTime = 0;

        bulletSpawner = this.object;
        this.soundClick = this.object.addComponent('howler-audio-source', { src: 'sfx/9mm-pistol-shoot-short-reverb-7152.mp3', volume: 0.5 });
    }

    update() {
        if (this.spacebar) {
            let currentTime = Date.now();
            let lastShotTimeGap = Math.abs(currentTime - this.lastShotTime);

            if (lastShotTimeGap > 500) {
                try {
                    const dir = [0, 0, 0];
                    this.object.getForward(dir);

                    this.launch(dir);
                    this.lastShotTime = currentTime;
                    this.soundClick.play();
                } catch (e) {
                    console.log("keyboard shoot >> ", e);
                }

            }
        }
    }

    launch(dir) {
        let bullet = this.spawnBullet();

        bullet.object.transformLocal.set(this.object.transformWorld);
        bullet.object.setDirty();
        bullet.physics.dir.set(dir);

        bullet.physics.scored = false;
        bullet.physics.active = true;

        state.shotCount++;
        state.updateCounter();

        if (!firstShot) {
            state.hideLogo();
            state.updateMoveDuration(true);
            firstShot = true;
        }
    }

    spawnBullet() {
        const obj = this.engine.scene.addObject();

        const mesh = obj.addComponent('mesh');
        mesh.mesh = this.bulletMesh;
        mesh.material = this.bulletMaterial;

        obj.scale([0.05, 0.05, 0.05]);

        mesh.active = true;

        const col = obj.addComponent('collision');
        col.shape = this.engine.Collider.Sphere;
        col.extents[0] = 0.05;
        col.group = (1 << 0);
        col.active = true;

        const physics = obj.addComponent('bullet-physics', {
            speed: this.bulletSpeed,
        });
        physics.active = true;

        return {
            object: obj,
            physics: physics
        };
    }

    press(e) {
        if (e.keyCode === 32 /* spacebar */) {
            this.spacebar = true;
        }
    }

    release(e) {
        if (e.keyCode === 32 /* spacebar */) {
            this.spacebar = false;
        }
    }

};