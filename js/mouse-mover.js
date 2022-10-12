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
/**
@brief (Unused) Moves a mesh back and forth

Feel free to extend the game with a PR!
*/
WL.registerComponent('mouse-mover', {
    speed: {type: WL.Type.Float, default: 1.0},
}, {
    init: function() {
        this.time = 0;
        this.state = 0;
        this.currentPos = [0, 0, 0];
        this.pointA = [0, 0, 0];
        this.pointB = [0, 0, 0];

        this.moveDuration = 2;
        this.travelDistance = this.moveDuration*1.5;

        glMatrix.quat2.getTranslation(this.currentPos, this.object.transformLocal);

        glMatrix.vec3.add(this.pointA, this.pointA, this.currentPos);
        glMatrix.vec3.add(this.pointB, this.currentPos, [0, 0, 1.5]);

        this.savedAngle = 0;
        this.previousAngle = 0;
        this.newAngle = 0;
    },
    update: function(dt) {
        if(isNaN(dt)) return;

        this.time += dt;
        if(this.time >= this.moveDuration) {
            this.time -= this.moveDuration;

            this.state = Math.floor(Math.random()*4);
            this.pointA = this.currentPos;

            let x = Math.random()*this.travelDistance;
            let z = Math.sqrt(Math.pow(this.travelDistance,2) - Math.pow(x,2));

            const randomNegative = Math.round(Math.random()) * 2 - 1;
            const randomNegative2 = Math.round(Math.random()) * 2 - 1;

            glMatrix.vec3.add(this.pointB, this.pointA, [x*randomNegative, 0, z*randomNegative2]);
            // console.log("mouse >> ",(x*randomNegative), ", ", (z*randomNegative2));

            this.newAngle = Math.floor(Math.random()*180);
            this.previousAngle = this.savedAngle;
        }

        this.object.resetTranslation();
        if(this.time <= this.moveDuration/2) {
            this.object.resetRotation();
            this.savedAngle = (this.time*this.newAngle)+this.previousAngle;
            this.object.rotateAxisAngleDeg([0, 0, 1], this.savedAngle);
            this.object.rotateAxisAngleDeg([1, 0, 0], 90);
        }else{
            glMatrix.vec3.lerp(this.currentPos, this.pointA, this.pointB, this.time-this.moveDuration/2);
        }
        this.object.translate(this.currentPos);
    },
});
