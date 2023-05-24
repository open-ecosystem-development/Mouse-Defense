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
import { BulletPhysics } from "./bullet-physics";
/**
@brief Spawns a new bullet object when the player depresses the trigger.
*/

var firstShot = false;

export class BulletSpawner extends Component {
    static TypeName = "bullet-spawner";
    static Properties = {
        bulletMesh: { type: Type.Mesh },
        bulletMaterial: { type: Type.Material },
        bulletSpeed: { type: Type.Float, default: 1.0 },
    };

    static onRegister(engine) {
        engine.registerComponent(BulletPhysics);

    }

    start() {
        this.engine.onXRSessionStart.push(this.xrSessionStart.bind(this));

        this.bullets = [];
        this.nextIndex = 0;
        this.lastShotTime = 0;

        state.bulletSpawner = this.object;
        this.soundClick = this.object.addComponent('howler-audio-source', { src: 'sfx/9mm-pistol-shoot-short-reverb-7152.mp3', volume: 0.5 });
    }

    onTouchDown(e) {
        /** Prevent left trigger from firing */
        if (e.inputSource.handedness == "right") {
            /** Limit how fast player can shoot */
            let currentTime = Date.now();
            let lastShotTimeGap = Math.abs(currentTime - this.lastShotTime);

            if (lastShotTimeGap > 500) {
                const dir = [0, 0, 0];
                this.object.getComponent('cursor-custom').cursorRayObject.getForward(dir);

                this.pulse(e.inputSource.gamepad);
                this.launch(dir);
                this.lastShotTime = currentTime;
                this.soundClick.play();
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
        if (this.engine.xrSession) {
            this.engine.xrSession.addEventListener('selectstart', this.onTouchDown.bind(this));
        }
    }

    xrSessionStart(session) {
        if (this.active) {
            session.addEventListener('selectstart', this.onTouchDown.bind(this));
        }
    }
    
};