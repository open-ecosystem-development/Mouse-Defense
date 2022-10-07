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
var score = 0;
/**
@brief Score trigger

Check overlap with paper balls to spawn confetti particles and
increase the score.

This component is automatically attached to newly spawned wastebins,
see `wastebin-spawner`.
*/
WL.registerComponent('score-trigger', {
    particles: {type: WL.Type.Object}
}, {
    init: function() {
        this.collision = this.object.getComponent('collision');
        this.soundHit = this.object.addComponent('howler-audio-source', {src: 'sfx/high-pitched-aha-103125.mp3', volume: 1.9 });
        this.soundPop = this.object.addComponent('howler-audio-source', {src: 'sfx/pop-94319.mp3', volume: 1.9 });
    },
    update: function(dt) {
        let overlaps = this.collision.queryOverlaps();

        for(let i = 0; i < overlaps.length; ++i) {
            let p = overlaps[i].object.getComponent('bullet-physics');

            // console.log("score-trigger >>  p >> "+p);
            if(p && !p.scored) {
                p.scored = true;
                this.particles.transformWorld.set(this.object.transformWorld);
                this.particles.getComponent('confetti-particles').burst();
                this.object.parent.destroy();
                // destroyTarget();
                ++score;
                // console.log("score-trigger >> scored");
                let scoreString = "";
                if(maxTargets!=score){
                    scoreString = score+" rats down, "+(maxTargets-score)+" left";
                }else{
                    scoreString = "Congrats, you got all the rats!";
                }
                
                updateScore(scoreString);

                this.soundHit.play();
                this.soundPop.play();
                /* We don't have collisions with the wastebin, simply
                 * drop it straight down to avoid it flying through */
                // p.velocity.set([0, -1, 0]);
            }
        }

        // for(let i = 0; i < overlaps.length; ++i) {
        //     let p = overlaps[i].object.getComponent('ball-physics');

        //     // console.log("score-trigger >>  p >> "+p);
        //     if(p && p.velocity[1] < 0.0 && !p.scored) {
        //         p.scored = true;
        //         this.particles.transformWorld.set(this.object.transformWorld);
        //         this.particles.getComponent('confetti-particles').burst();
        //         this.object.parent.destroy();
        //         // destroyTarget();
        //         ++score;
        //         // console.log("score-trigger >> scored");
        //         let scoreString = "";
        //         if(maxTargets!=score){
        //             scoreString = score+" rats down, "+(maxTargets-score)+" left";
        //         }else{
        //             scoreString = "Congrats, you got all the rats!";
        //         }
                
        //         updateScore(scoreString);

        //         this.soundHit.play();
        //         this.soundPop.play();
        //         /* We don't have collisions with the wastebin, simply
        //          * drop it straight down to avoid it flying through */
        //         p.velocity.set([0, -1, 0]);
        //     }
        // }
    },
});
