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
var bulletSpawner = null;
var shotCount = 0;
/**
@brief Spawns a new bullet object when the player depresses the trigger.
*/
WL.registerComponent('bullet-spawner', {
    bulletMesh: {type: WL.Type.Mesh},
    bulletMaterial: {type: WL.Type.Material},
    bulletSpeed: {type: WL.Type.Float, default: 1.0},
    // maxBullets: {type: WL.Type.Int, default: 32},
}, {
    start: function() {
        WL.onXRSessionStart.push(this.xrSessionStart.bind(this));
        this.start = new Float32Array(2);

        this.bullets = [];
        this.nextIndex = 0;
        this.lastShotTime = 0;

        bulletSpawner = this.object;
        this.soundClick = this.object.addComponent('howler-audio-source', {src: 'sfx/9mm-pistol-shoot-short-reverb-7152.mp3', volume: 0.5 });
    },
    onTouchDown: function(e) {
        /** Limit how fast player can shoot */
        let currentTime = Date.now();
        let lastShotTimeGap = Math.abs(currentTime-this.lastShotTime);

        if(lastShotTimeGap>50){
            const dir = [0, 0, 0];
            this.object.getComponent('cursor').cursorRayObject.getForward(dir);

            this.pulse(e.inputSource.gamepad);
            this.launch(dir);
            this.lastShotTime=currentTime;
            this.soundClick.play();
        }
        
    },
    launch: function(dir) {
        // let bullet =
        //     this.bullets.length == this.maxBullets ?
        //     this.bullets[this.nextIndex] : this.spawnBullet();
        // this.bullets[this.nextIndex] = bullet;

        // this.nextIndex = (this.nextIndex + 1) % this.maxBullets;
        let bullet = this.spawnBullet();

        bullet.object.transformLocal.set(this.object.transformWorld);
        bullet.object.setDirty();
        bullet.physics.dir.set(dir);

        bullet.physics.scored = false;
        bullet.physics.active = true;

        shotCount++;
        updateCounter();
    },
    spawnBullet:function(){
        const obj = WL.scene.addObject();

        const mesh = obj.addComponent('mesh');
        mesh.mesh = this.bulletMesh;
        mesh.material = this.bulletMaterial;

        obj.scale([0.05,0.05,0.05]);

        mesh.active = true;

        const col = obj.addComponent('collision');
        col.shape = WL.Collider.Sphere;
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
    },
    //vibrates controller for haptic feedback
    pulse: function (gamepad) {
        let actuator;
        if (!gamepad || !gamepad.hapticActuators) { return; }        
        actuator = gamepad.hapticActuators[0];
        if(!actuator) return;
        actuator.pulse(1, 100);        
    },
    onActivate: function() {
        if(WL.xrSession) {
            WL.xrSession.addEventListener('selectstart', this.onTouchDown.bind(this));
        }
    },
    xrSessionStart: function(session) {
        if(this.active) {
            session.addEventListener('selectstart', this.onTouchDown.bind(this));
        }
    },
});