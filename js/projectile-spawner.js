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
var paperBallSpawner = null;
/**
@brief 
*/
WL.registerComponent('paperball-spawner', {
    paperballMesh: {type: WL.Type.Mesh},
    paperballMaterial: {type: WL.Type.Material},
    spawnAnimation: {type: WL.Type.Animation},
    ballSpeed: {type: WL.Type.Float, default: 1.0},
    maxPapers: {type: WL.Type.Int, default: 32},
    debug: {type: WL.Type.Bool, default: false},
}, {
    start: function() {
        WL.onXRSessionStart.push(this.xrSessionStart.bind(this));
        this.start = new Float32Array(2);

        this.paperBalls = [];
        this.nextIndex = 0;
        this.shotCount = 0;
        this.lastTime = 0;
        this.laser = null;

        if(this.debug) {
            this.active = true;
            this.object.getComponent('mesh').active = true;
        }
        paperBallSpawner = this.object;
        this.soundClick = this.object.addComponent('howler-audio-source', {src: 'sfx/9mm-pistol-shoot-short-reverb-7152.mp3', volume: 0.5 });
    },
    onTouchDown: function(e) {
        let curTime = Date.now();
        ballTime = Math.abs(curTime-this.lastTime);
        if(ballTime>50){
            const end = e.inputSource.gamepad.axes;

            const dir = [0, 0, 0];

            this.object.getComponent('cursor').cursorRayObject.getForward(dir);

            this.pulse(e.inputSource.gamepad);
            this.throw(dir);
            this.lastTime=curTime;
            this.soundClick.play();
        }
        
    },
    update: function(dt) {
        this.time = (this.time || 0) + dt;
    },
    onTouchUp: function(e) {
        
    },
    throw: function(dir) {
        let paper =
            this.paperBalls.length == this.maxPapers ?
            this.paperBalls[this.nextIndex] : this.spawnBullet();
        this.paperBalls[this.nextIndex] = paper;

        this.nextIndex = (this.nextIndex + 1) % this.maxPapers;

        paper.object.transformLocal.set(this.object.transformWorld);
        paper.object.setDirty();
        paper.physics.dir.set(dir);

        paper.physics.scored = false;
        paper.physics.active = true;

        this.canThrow = false;
        this.shotCount++;
        updateCounter(this.shotCount);
        setTimeout(function() {
            this.canThrow = true;
        }.bind(this), 1000);
    },
    spawnBullet:function(){
        const obj = WL.scene.addObject();

        const mesh = obj.addComponent('mesh');
        mesh.mesh = this.paperballMesh;
        mesh.material = this.paperballMaterial;

        obj.scale([0.05,0.05,0.05]);

        mesh.active = true;

        const col = obj.addComponent('collision');
        col.shape = WL.Collider.Sphere;
        col.extents[0] = 0.05;
        col.group = (1 << 0);
        col.active = true;

        const physics = obj.addComponent('bullet-physics', {
            speed: this.ballSpeed,
        });
        physics.active = true;

        return {
            object: obj,
            physics: physics
        };
    },
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
            WL.xrSession.addEventListener('selectend', this.onTouchUp.bind(this));
        }
    },
    xrSessionStart: function(session) {
        if(this.active) {
            session.addEventListener('selectstart', this.onTouchDown.bind(this));
            session.addEventListener('selectend', this.onTouchUp.bind(this));
        }
    },
});