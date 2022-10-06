/**
@brief Bullet Physics

*/
WL.registerComponent('bullet-physics', {
    speed: {type: WL.Type.Float, default: 1.0},
}, {
    init: function() {
        this.dir = new Float32Array(3);
        this.position = [0, 0, 0];
        this.object.getTranslationWorld(this.position);
        this.correctedSpeed = this.speed/6;

        this.collision = this.object.getComponent('collision', 0);
        if(!this.collision) {
            console.warn("'bullet-physics' component on object", this.object.name, "requires a collision component");
        }
        
    },
    update: function(dt) {
        //error checking?
        if(isNaN(dt)){
            console.log("dt is NaN");
            return;
        } 

        //update position
        this.object.getTranslationWorld(this.position);
        //deactivate bullet if through the floor
        if(this.position[1] <= floorHeight + this.collision.extents[0]) {
            console.log("bullet penetrated floor >> "+this.position[1]+" <= "+floorHeight + this.collision.extents[0]
            + " ( " + floorHeight, ", ", this.collision.extents[0]," )");
            this.active = false;
            return;
        }
        //deactivate bullet if travel distance too far
        if(glMatrix.vec3.length(this.position)>175){
            this.active = false;
            return;
        }

        let newDir = [0,0,0];
        glMatrix.vec3.add(newDir, newDir, this.dir);
        glMatrix.vec3.scale(newDir, newDir, this.correctedSpeed);

        glMatrix.vec3.add(this.position, this.position, newDir);
        
        this.object.resetTranslation();
        this.object.translate(this.position);
    },
});
