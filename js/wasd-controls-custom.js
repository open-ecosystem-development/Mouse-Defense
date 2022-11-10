/**
 * Basic movement with W/A/S/D keys.
 */
WL.registerComponent('wasd-controls-custom', {
    /** Movement speed in m/s. */
    speed: { type: WL.Type.Float, default: 0.1 },
    /** Object of which the orientation is used to determine forward direction */
    headObject: { type: WL.Type.Object }
}, {
    init: function() {
        this.up = false;
        this.right = false;
        this.down = false;
        this.left = false;

        window.addEventListener('keydown', this.press.bind(this));
        window.addEventListener('keyup', this.release.bind(this));
        console.log("this.speed >> ", this.speed);
    },

    // start: function() {
    //     this.headObject = this.headObject;
    // },

    update: function() {

        if(this.up || this.right || this.down || this.left){
            let direction = [0, 0, 0];

            let forwardVec = [];
            this.object.getForward(forwardVec);
            forwardVec[1]=0;
            let backVec = [0, 0, 0];
            if(forwardVec[2]==1){
                forwardVec[2] = this.speed;
                backVec = [0, 0, -this.speed];
            }else if(forwardVec[2]==-1){
                forwardVec[2] = -this.speed;
                backVec = [0, 0, this.speed];
            }else{
                let angle = glMatrix.vec3.angle([0,0,-1],forwardVec);
                let xPolarity = -1;
                let zPolarity = -1;
                // console.log(`${forwardVec} -> ${angle}`);

                //set x-magnitude for forward and back
                if(forwardVec[0]>0) xPolarity = 1;
                forwardVec[0] = xPolarity*Math.cos(angle)*this.speed;
                backVec[0] = -forwardVec[0];
                //set z-magnitude for forward and back
                if(forwardVec[2]>0) zPolarity = 1;
                forwardVec[2] = zPolarity*Math.sin(angle)*this.speed;
                backVec[2] = -forwardVec[2];

                // forwardVec[2] = -Math.sin(angle)*this.speed;
                // backVec[0] = -Math.cos(angle)*this.speed;
                // backVec[2] = -Math.sin(angle)*this.speed;
            }
            let rightVec = [];
            this.object.getRight(rightVec);
            rightVec[1]=0;
            let leftVec = [0, 0, 0];
            if(rightVec[0]==1){
                rightVec[0] = this.speed;
                leftVec = [-this.speed, 0, 0];
            }else if(rightVec[0]==-1){
                rightVec[0] = -this.speed;
                leftVec = [this.speed, 0, 0];
            }else{
                let angle = glMatrix.vec3.angle([-1,0,0],rightVec);
                // rightVec[0] = -Math.cos(angle)*this.speed;
                // rightVec[2] = -Math.sin(angle)*this.speed;
                // leftVec[0] = -Math.cos(angle)*this.speed;
                // leftVec[2] = -Math.sin(angle)*this.speed;
                let xPolarity = -1;
                let zPolarity = -1;
                // console.log(`${forwardVec} -> ${angle}`);

                //set x-magnitude for forward and back
                if(rightVec[0]>0) xPolarity = 1;
                rightVec[0] = xPolarity*Math.cos(angle)*this.speed;
                leftVec[0] = -rightVec[0];
                //set z-magnitude for forward and back
                if(rightVec[2]>0) zPolarity = 1;
                rightVec[2] = zPolarity*Math.sin(angle)*this.speed;
                leftVec[2] = -rightVec[2];
            }

            // console.log("forwardVec >> ", forwardVec);
            // console.log("backVec >> ", backVec);
            // console.log("rightVec >> ", rightVec);
            // console.log("leftVec >> ", leftVec);

            if (this.up) glMatrix.vec3.add(direction, direction, forwardVec);
            if (this.down) glMatrix.vec3.add(direction, direction, backVec);
            if (this.left) glMatrix.vec3.add(direction, direction, leftVec);
            if (this.right) glMatrix.vec3.add(direction, direction, rightVec);

            // let playerLoc = getPlayerLocation();
            // let worldDirection = [playerLoc[0]+direction[0],playerLoc[1]+direction[1],playerLoc[2]+direction[2]];
            // glMatrix.vec3.add(direction, getPlayerLocation(), direction);

            this.object.translate(direction);

            // console.log(`${getPlayerLocation()} + ${direction} -> ${worldDirection}`);


            // let currentPos = [];
            // this.object.getForward(currentPos)
            // console.log("player forward >> ", currentPos);
            // console.log("direction >> ", direction);
        }
    },

    press: function(e) {
        if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 90 /* z */ ) {
            this.up = true
        } else if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */ ) {
            this.right = true
        } else if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */ ) {
            this.down = true
        } else if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 81 /* q */ ) {
            this.left = true
        }
    },

    release: function(e) {
        if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 90 /* z */ ) {
            this.up = false
        } else if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */ ) {
            this.right = false
        } else if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */ ) {
            this.down = false
        } else if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 81 /* q */ ) {
            this.left = false
        }
    }
});