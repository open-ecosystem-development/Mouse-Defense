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
// var wastebinSpawner = null;
var floorHeight = 0;
var maxTargets = 0;
var mouseSound = null;

/**
@brief
*/
WL.registerComponent('mouse-spawner', {
    targetMesh: {type: WL.Type.Mesh},
    targetMaterial: {type: WL.Type.Material},
    spawnAnimation: {type: WL.Type.Animation},
    maxTargets: {type: WL.Type.Int, default: 20},
    particles: {type: WL.Type.Object},
}, {
    init: function() {
        maxTargets = this.maxTargets;
        this.time = 0;
        this.spawnInterval = 3;
        mouseSound = this.object.addComponent('howler-audio-source', {src: 'sfx/critter-40645.mp3', loop: true, volume: 1.0 });
    },
    start: function() {
        this.targets = [];
        this.spawnTarget();
    },
    update: function(dt) {
        this.time += dt;
        if(this.targets.length >= this.maxTargets) return;

        if(this.time >= this.spawnInterval){
            this.time = 0;
            this.spawnTarget();
        }
    },
    spawnTarget: function() {

        const obj = WL.scene.addObject();
        obj.transformLocal.set(this.object.transformWorld);

        obj.scale([0.1, 0.1, 0.1]);
        const mesh = obj.addComponent('mesh');
        mesh.mesh = this.targetMesh;
        mesh.material = this.targetMaterial;
        mesh.active = true;
        obj.addComponent("mouse-mover");

        if(this.spawnAnimation) {
            const anim = obj.addComponent('animation');
            anim.playCount = 1;
            anim.animation = this.spawnAnimation;
            anim.active = true;
            anim.play();
        }

        /* Add scoring trigger */
        const trigger = WL.scene.addObject(obj);
        const col = trigger.addComponent('collision');
        col.collider = WL.Collider.Sphere;
        col.extents[0] = 0.6;
        col.group = (1 << 0);
        col.active = true;
        trigger.translate([0, 0.4, 0]);
        trigger.addComponent('score-trigger', {
            particles: this.particles
        });

        obj.setDirty();

        this.targets.push(obj);
        mouseSound.play();
    },
});
