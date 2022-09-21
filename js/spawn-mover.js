/**
@brief (Unused) Moves a mesh back and forth

Feel free to extend the game with a PR!
*/
WL.registerComponent('spawn-mover', {
    speed: {type: WL.Type.Float, default: 1.0},
    // spawnObject: {type: WL.Type.Object},
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
    },

    start: function() {
        // this.spawnObject.scale([0.2, 0.2, 0.2]);
        // this.object.scale([0.2, 0.2, 0.2]);
    },

    update: function(dt) {
        if(isNaN(dt)) return;

        this.time += dt;
        const moveDuration = 2;
        if(this.time >= moveDuration) {
            this.time -= moveDuration;

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
        }
        this.object.resetTransform();
        glMatrix.vec3.lerp(this.position, this.pointA, this.pointB, this.time);
        this.object.translate(this.position);
    },
});
