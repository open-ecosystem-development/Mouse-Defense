
export const state = {
    shotCount: 0,
    /* Global function used to update the score display */
    updateCounter: null,
    updateScore: null,
    gameOver: false,
    score: 0,
    resetButton: null,
    bgMusic: null,
    victoryMusic: null,
    mouseSound: null,
    mouseSpawner: null,
    targetsSpawned: 0,
    maxTargets: 20, /* Overwritten by mouse-spawner */
    floorHeight: 0,
    getPlayerLocation: null,
    updateMoveDuration: null,
    bulletSpawner: null,
    hideLogo: null,
    despawnTarget: null,
    firstShot: false,
    launch: null,

    incrementScore() {
        ++this.score;

        let scoreString = "";
        if (this.maxTargets != this.score) {
          scoreString = `${this.score} rats down, ${(this.maxTargets - this.score)} left`;
        } else {
          scoreString = "Congrats, you got all the rats!";
          this.victoryMusic.play();
          this.bgMusic.stop();
          this.mouseSound.stop();
          this.resetButton.unhide();
          this.gameOver = true;
        }

        this.updateScore(scoreString);
    },

    restart() {
        this.mouseSpawner.targets = [];
        this.mouseSpawner.reset();

        this.victoryMusic.stop();
        this.bgMusic.play();
        this.gameOver = false;
        this.shotCount = 0;
        this.score = 0;
        this.targetsSpawned = 0;

        this.updateCounter();
        this.updateScore(`Eliminate all ${this.maxTargets} rats.`);
    }
};
