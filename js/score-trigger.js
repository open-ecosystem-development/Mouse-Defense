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
        this.victoryMusic = this.object.addComponent('howler-audio-source', {src: 'music/level-win-6416.mp3', volume: 1.9 });
    },
    update: function(dt) {
        let overlaps = this.collision.queryOverlaps();

        for(let i = 0; i < overlaps.length; ++i) {
            let p = overlaps[i].object.getComponent('bullet-physics');

            if(p && !p.scored) {
                p.scored = true;
                this.particles.transformWorld.set(this.object.transformWorld);
                this.particles.getComponent('confetti-particles').burst();
                this.object.parent.destroy();

                ++score;

                let scoreString = "";
                if(maxTargets!=score){
                    scoreString = score+" rats down, "+(maxTargets-score)+" left";
                }else{
                    scoreString = "Congrats, you got all the rats!";
                    this.victoryMusic.play();
                    bgMusic.stop();
                    mouseSound.stop();
                }
                
                updateScore(scoreString);

                this.soundHit.play();
                this.soundPop.play();
            }
        }
    },
});
