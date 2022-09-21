/**
@brief (Unused) Moves a mesh back and forth

Feel free to extend the game with a PR!
*/
WL.registerComponent('target', {
    speed: {type: WL.Type.Float, default: 1.0},
    // targetObject: {type: WL.Type.Object},
}, {
    init: function() {
        this.time = 0;
        this.state = 0;
        this.position = [0, 0, 0];
        this.pointA = [0, 0, 0];
        this.pointB = [0, 0, 0];
        this.position = [0, 0, 0];
        glMatrix.quat2.getTranslation(this.position, this.object.transformLocal);

        glMatrix.vec3.add(this.pointA, this.pointA, this.position);
        glMatrix.vec3.add(this.pointB, this.position, [0, 0, 1.5]);

        this.angle = 0;
    },

    start: function() {
        // this.targetObject.scale([0.2, 0.2, 0.2]);
        // this.object.scale([0.2, 0.2, 0.2]);
    },

    update: function(dt) {
        if(isNaN(dt)) return;

        this.time += dt;
        const moveDuration = 2;
        if(this.time >= moveDuration) {
            this.time -= moveDuration;
            // this.state = (this.state + 1) % 4;
            this.state = Math.floor(Math.random()*4);
            this.pointA = this.position;

            const randomPathZ = Math.random() < 0.5;
            const randomNegative = Math.random() < 0.5;
            var travelDistance = 1.5*moveDuration;

            if(randomNegative){
                travelDistance = -travelDistance;
            }
            //new position in Z axis
            // console.log("pointB >> " + this.pointB);
            
            if(randomPathZ){
                glMatrix.vec3.add(this.pointB, this.pointA, [0, 0, travelDistance]);
            }
            //new position in X axis.
            else{
                glMatrix.vec3.add(this.pointB, this.pointA, [travelDistance, 0, 0]);
            }
            //find angle between point A and B
            let radAngle = glMatrix.vec3.angle(this.pointA, this.pointB);
            this.angle = radAngle*(180/Math.PI);
            // console.log("target >> point A, B >> " + this.pointA+", "+ this.pointB);
            // console.log("target >> angle >> " + radAngle+", "+ this.angle);

        }

        this.object.resetTranslation();
        if(this.time <= moveDuration/2) {
            // console.log("target >> rotating");
            this.object.resetRotation();
            this.object.rotateAxisAngleDeg([0, 1, 0], this.time*this.angle);
        }else{
            // console.log("target >> moving");
            // this.object.resetTranslation();
            glMatrix.vec3.lerp(this.position, this.pointA, this.pointB, this.time-moveDuration/2);
        }
        this.object.translate(this.position);
    },
});
