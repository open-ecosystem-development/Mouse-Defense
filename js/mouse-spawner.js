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
        // const col = obj.addComponent('collision');
        col.collider = WL.Collider.Sphere;
        col.extents[0] = 0.6;
        col.group = (1 << 0);
        col.active = true;
        // obj.addComponent('score-trigger', {
        //     particles: this.particles
        // });
        trigger.translate([0, 0.4, 0]);
        trigger.addComponent('score-trigger', {
            particles: this.particles
        });

        obj.setDirty();

        this.targets.push(obj);
        mouseSound.play();
    },
});
