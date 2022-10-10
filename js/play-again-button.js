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
var resetButton = null;
/**
@brief Button to reset to placing a Wastebin

For WebXR AR sessions, we get the touch events reported through `select`
on the session. As they are reported in [-1.0, 1.0] range, we simply
check if the touch in within a range in the bottom right corner of the
screen.
*/
WL.registerComponent('play-again-button', {
}, {
    init: function() {
        this.collision = this.object.getComponent('collision');
        // this.soundHit = this.object.addComponent('howler-audio-source', {src: 'sfx/high-pitched-aha-103125.mp3', volume: 1.9 });
        this.soundPop = this.object.addComponent('howler-audio-source', {src: 'sfx/pop-94319.mp3', volume: 1.9 });
        // victoryMusic = this.object.addComponent('howler-audio-source', {src: 'music/level-win-6416.mp3', volume: 1.9 });
    },
    start: function() {
        // WL.onXRSessionStart.push(this.xrSessionStart.bind(this));
        resetButton = this;
        this.hide();

    },
    restart: function() {
        for(let i = 0; i < mouseSpawner.targets.length; ++i) {
            mouseSpawner.targets[i].destroy();
            mouseSpawner.resetTranslation();
        }
        mouseSpawner.targets = [];
        paperBallSpawner.getComponent('paperball-spawner').throwCount = 0;

        victoryMusic.stop();
        bgMusic.play();
        updateCounter(0);
        updateScore("Eliminate all 20 Rats.");

        // mouseSpawner.object.getComponent('mesh').active = true;
        this.hide();
    },

    hide: function() {
        this.object.children[0].getComponent('mesh').active = false;
        this.object.children[1].getComponent('text').active = false;
        this.active = false;
    },

    unhide: function() {
        // console.log(`children.length >> ${this.object.children.length}`);
        // var childrens = this.object.children;
        // for(let i =0; i<childrens.length; i++){
        //     console.log("children >> ", i, " = ",childrens[i].name);
        // }
        this.object.children[0].getComponent('mesh').active = true;
        this.object.children[1].getComponent('text').active = true;
        this.active = true;
    },

    onClick: function(e) {
        const pos = e.inputSource.gamepad.axes;
        console.log(pos);
        /* Test position agains bottom right corner */
        if(pos[0] > 0.3 && pos[1] > 0.9) {
            this.restart();
        }
    },

    // onActivate: function() {
    //     if(WL.xrSession) {
    //         WL.xrSession.addEventListener('select', this.onClick.bind(this));
    //     }
    // },
    // xrSessionStart: function(session) {
    //     if(this.active) {
    //         session.addEventListener('select', this.onClick.bind(this));
    //     }
    // },
    
    update: function(dt) {
        let overlaps = this.collision.queryOverlaps();

        for(let i = 0; i < overlaps.length; ++i) {
            let p = overlaps[i].object.getComponent('bullet-physics');
            if(p){
                console.log("ball detected");
                this.restart();
                this.soundPop.play();
            }else{
                console.log("no ball");
            }
            

        //     if(p && !p.scored) {
        //         p.scored = true;
        //         this.particles.transformWorld.set(this.object.transformWorld);
        //         this.particles.getComponent('confetti-particles').burst();
        //         this.object.parent.destroy();

        //         ++score;

        //         let scoreString = "";
        //         if(maxTargets!=score){
        //             scoreString = score+" rats down, "+(maxTargets-score)+" left";
        //         }else{
        //             scoreString = "Congrats, you got all the rats!";
        //             victoryMusic.play();
        //             bgMusic.stop();
        //             mouseSound.stop();
        //             resetButton.unhide();
        //         }
                
        //         updateScore(scoreString);

        //         this.soundHit.play();
        //         this.soundPop.play();
        //     }
        }
    },
});
