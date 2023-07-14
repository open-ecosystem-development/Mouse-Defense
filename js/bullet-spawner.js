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
import { BulletPhysics } from "./bullet-physics";
/**
@brief Spawns a new bullet object when the player depresses the trigger.
*/

const tempQuat2 = new Float32Array(8);

export class BulletSpawner extends Component {
    static TypeName = "bullet-spawner";
    static Properties = {
        bulletMesh: { type: Type.Mesh },
        bulletMaterial: { type: Type.Material },
        bulletSpeed: { type: Type.Float, default: 1.0 },
    };

    static onRegister(engine) {
        engine.registerComponent(HowlerAudioSource);
        engine.registerComponent(BulletPhysics);

    }

    init() {
        state.launch = function (dir) {
            let bullet = this.spawnBullet();

            bullet.object.setTransformLocal(this.object.getTransformWorld(tempQuat2));
            bullet.object.setDirty();
            bullet.physics.dir.set(dir);

            bullet.physics.scored = false;
            bullet.physics.active = true;

            state.shotCount++;
            state.updateCounter();

            if (!state.firstShot) {
                state.hideLogo();
                state.updateMoveDuration(true);
                state.firstShot = true;
            }
        }.bind(this);
    }

    start() {
        this.engine.onXRSessionStart.add(this.xrSessionStart.bind(this));
        this.start = new Float32Array(2);

        this.bullets = [];
        this.nextIndex = 0;
        this.lastShotTime = 0;

        state.bulletSpawner = this.object;
        this.soundClick = this.object.addComponent(HowlerAudioSource, {
            src: "sfx/9mm-pistol-shoot-short-reverb-7152.mp3",
            volume: 0.5,
        });
    }

    onTouchDown(e) {
        /** Prevent left trigger from firing */
        if (e.inputSource.handedness == "right") {
            /** Limit how fast player can shoot */
            let currentTime = Date.now();
            let lastShotTimeGap = Math.abs(currentTime - this.lastShotTime);

            if (lastShotTimeGap > 500) {
                const dir = [0, 0, 0];
                this.object.getComponent('cursor').cursorRayObject.getForward(dir);

                this.pulse(e.inputSource.gamepad);
                state.launch(dir);
                this.lastShotTime = currentTime;
                this.soundClick.play();
            }
        }
    }

    spawnBullet() {
        const obj = this.engine.scene.addObject();
        obj.scaleLocal([0.05, 0.05, 0.05]);

        obj.addComponent("mesh", {
            mesh: this.bulletMesh,
            material: this.bulletMaterial,
        });
        obj.addComponent("collision", {
            shape: WL.Collider.Sphere,
            extents: [0.05, 0, 0],
            group: 1 << 0,
        });

        const physics = obj.addComponent(BulletPhysics, {
            speed: this.bulletSpeed,
        });
        physics.active = true;

        return {
            object: obj,
            physics: physics
        };
    }

    //vibrates controller for haptic feedback
    pulse(gamepad) {
        let actuator;
        if (!gamepad || !gamepad.hapticActuators) { return; }
        actuator = gamepad.hapticActuators[0];
        if (!actuator) return;
        actuator.pulse(1, 100);
    }

    onActivate() {
        if (!this.engine.xr) return;
        this.engine.xr.session.addEventListener(
            "selectstart", this.onTouchDown.bind(this));
    }

    xrSessionStart(session) {
        if (!this.active) return;
        session.addEventListener("selectstart", this.onTouchDown.bind(this));
    }

};