/* Global function used to update the score display */
var updateScore = null;
/**
@brief Marks an object with text component as "score display"

The center top text object that shows various helpful tutorial
texts and the score.
*/
WL.registerComponent('score-display', {
}, {
    init: function() {
        this.text = this.object.getComponent('text');

        updateScore = function(text) {
            console.log("score-display >> updateScore >> "+text);
            this.text.text = text;
        }.bind(this);

        updateScore("");
        /* Initial text to set after session started */
        WL.onXRSessionStart.push(function() {
            // updateScore("Slowly scan\narea");
        });
        this.bgMusic = this.object.addComponent('howler-audio-source', {src: 'music/happy-funny-kids-111912.mp3', loop: true, volume: 0.7 });
        this.bgMusic.play();
        this.bgDucks = this.object.addComponent('howler-audio-source', {src: 'sfx/recording-ducks-binaural-18742.mp3', loop: true, volume: 1.3 });
        this.bgDucks.play();
    },
});
