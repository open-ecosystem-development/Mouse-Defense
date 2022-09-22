/* Global function used to update the score display */
var updateScore = null;
/**
@brief Marks an object with text component as "score display"

The center top text object that shows various helpful tutorial
texts and the score.
*/
WL.registerComponent('bg-music', {
}, {
    init: function() {
        this.bgMusic = this.object.addComponent('howler-audio-source', {src: 'music/happy-funny-kids-111912.mp3', loop: true, volume: 0.4 });
        this.bgMusic.play();
        this.bgDucks = this.object.addComponent('howler-audio-source', {src: 'sfx/recording-ducks-binaural-18742.mp3', loop: true, volume: 1.3 });
        this.bgDucks.play();
        this.bgCow = this.object.addComponent('howler-audio-source', {src: 'sfx/cows-56001.mp3', loop: true, volume: 1.0 });
        this.bgCow.play();
        this.bgSheep = this.object.addComponent('howler-audio-source', {src: 'sfx/sheep-23761.mp3', loop: true, volume: 1.0 });
        this.bgSheep.play();        
        this.bgPig = this.object.addComponent('howler-audio-source', {src: 'sfx/pig_grunts_snorts_breathing_hackney_city_farm-73959.mp3', loop: true, volume: 1.0 });
        this.bgPig.play();
    },
});
