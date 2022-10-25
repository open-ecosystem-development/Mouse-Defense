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
var floorHeight = 0;
var maxTargets = 0;
var mouseSound = null;
var mouseSpawner = null;

/**
@brief Spawns in mice at set intervals until maxTargets is reached.
*/
WL.registerComponent('mouse-spawner', {
    targetMesh: {type: WL.Type.Mesh},
    targetMaterial: {type: WL.Type.Material},
    maxTargets: {type: WL.Type.Int, default: 20},
    particles: {type: WL.Type.Object},
    spawnIntervalCeiling: {type: WL.Type.Float, default: 3.0},
    spawnIntervalFloor: {type: WL.Type.Float, default: 1.0},
    bulletMesh: {type: WL.Type.Mesh},
    bulletMaterial: {type: WL.Type.Material},
}, {
    init: function() {
        maxTargets = this.maxTargets;
        this.time = 0;
        this.spawnInterval = this.spawnIntervalCeiling;
        mouseSound = this.object.addComponent('howler-audio-source', {src: 'sfx/critter-40645.mp3', loop: true, volume: 1.0 });
    },
    start: function() {
        this.targets = [];
        this.spawnTarget();

        mouseSpawner = this;
    },
    update: function(dt) {
        this.time += dt;
        if(this.targets.length >= this.maxTargets) return;

        if(this.time >= this.spawnInterval){
            this.time = 0;
            this.spawnTarget();
            //gradually increases spawn interval until it hits the floor
            if(this.spawnInterval>this.spawnIntervalFloor){
                this.spawnInterval*=.8;
            }
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

        /* Add scoring trigger */
        const trigger = WL.scene.addObject(obj);
        const col = trigger.addComponent('collision');
        col.collider = WL.Collider.Sphere;
        col.extents[0] = 0.6;
        col.group = (1 << 0);
        col.active = true;
        trigger.translate([0, 0.7, 0]);
        trigger.addComponent('score-trigger', {
            particles: this.particles
        });

        obj.setDirty();

        this.targets.push(obj);
        mouseSound.play();
    },
});
