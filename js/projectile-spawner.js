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
@brief Spawns paper balls at the component's object's location
During WebXR immersive-ar sessions, we do not have access to
touch or click events. The only way to retrieve touch locations
is through the `select`, `selectstart` and `selectend` events.
These events report location of the event in `[-1.0, 1.0]` on
both axis.
A swipe is determined by the difference in the position and time
from `selectstart` to `selectend` event.
The faster and the longer the swipe, the more force will be applied
for the throw.
After every throw, the main paper ball mesh in front of the camera
will be hidden for a short duration and reappears with a new
random rotation to hide the fact that it's the same mesh over and over.
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
        /* We can only bind the selectstart/select end events
         * when the session started */
        WL.onXRSessionStart.push(this.xrSessionStart.bind(this));
        this.start = new Float32Array(2);
        // console.log("paperball-spawner >> this.start >> "+this.start);

        this.paperBalls = [];
        this.nextIndex = 0;
        this.throwCount = 0;
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
        // console.log("paperball-spawner >> onTouchUp >> "+e);
        // this.laserOff();
        let curTime = Date.now();
        ballTime = Math.abs(curTime-this.lastTime);
        // console.log("ballTime >> "+ ballTime);
        if(ballTime>50){
            // console.log("paperball-spawner >> onTouchUp GO");
            const end = e.inputSource.gamepad.axes;
            // const duration = 0.001*(e.timeStamp - this.startTime);
            // console.log("end >> ", end);
            // console.log("inputSource.targetRaySpace >> ",e.inputSource.targetRaySpace);

            const dir = [0, 0, 0];

            this.object.getComponent('cursor').cursorRayObject.getForward(dir);

            this.pulse(e.inputSource.gamepad);
            this.throw(dir);
            // console.log("dir >> ", dir);
        }else{
            // console.log("paperball-spawner >> onTouchUp SKIP");
        }
        this.lastTime=curTime;
        this.soundClick.play();
    },

    update: function(dt) {
        // console.log("paperball-spawner >> update >> "+dt);
        this.time = (this.time || 0) + dt;
    },
    onTouchUp: function(e) {
        
    },
    throw: function(dir) {
        
        // this.object.resetRotation();
        // this.object.rotateAxisAngleDegObject([1, 0, 0], -45);
        let paper =
            this.paperBalls.length == this.maxPapers ?
            this.paperBalls[this.nextIndex] : this.spawnBullet();
        this.paperBalls[this.nextIndex] = paper;
        // this.spawnPaper();

        this.nextIndex = (this.nextIndex + 1) % this.maxPapers;

        paper.object.transformLocal.set(this.object.transformWorld);
        // let dir2 = [0,0,0];
        // paper.object.getForward(dir2);
        // console.log("paperball-spawner >> transformLocal >> dir >> "+ dir2);
        paper.object.setDirty();
        paper.physics.dir.set(dir);

        // //double speed by 2
        // paper.physics.velocity[0] *= 2;
        /* Reset scored value which is set in 'score-trigger' component */
        paper.physics.scored = false;
        paper.physics.active = true;


        /* New orientation for the next paper */
        // this.object.resetRotation();
        // this.object.rotateAxisAngleDegObject([1, 0, 0], -90);
        // this.object.rotateAxisAngleDegObject([0, 1, 0], Math.random()*180.0);

        this.canThrow = false;
        setTimeout(function() {
            // this.object.resetScaling();
            this.canThrow = true;
        }.bind(this), 1000);

        /* Important only to update score display to show score
         * instead of the tutorial after first throw */
        // updateScore(score.toString());

        // this.throwCount++;
        // if(this.throwCount == 3) {
        //     resetButton.unhide();
        // }
    },
    spawnBullet:function(){
        // console.log("paperball-spawner >> spawnPaper");
        const obj = WL.scene.addObject();

        const mesh = obj.addComponent('mesh');
        mesh.mesh = this.paperballMesh;
        mesh.material = this.paperballMaterial;
        //scaling
        // obj.resetScaling();
        obj.scale([0.05,0.05,0.05]);

        mesh.active = true;

        // if(this.spawnAnimation) {
        //     const anim = obj.addComponent('animation');
        //     anim.animation = this.spawnAnimation;
        //     anim.active = true;
        //     anim.play();
        // }

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
        /* Only spawn object if cursor is visible */
        if(this.active) {
            session.addEventListener('selectstart', this.onTouchDown.bind(this));
            session.addEventListener('selectend', this.onTouchUp.bind(this));
        }
    },
});