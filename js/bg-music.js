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

/* Global function used to play SFX and music */
var updateScore = null;
var bgMusic = null;
var victoryMusic = null;
/**
@brief Audio that is attached to the player object.
*/
WL.registerComponent('bg-music', {
}, {
    init: function() {
        bgMusic = this.object.addComponent('howler-audio-source', {src: 'music/happy-funny-kids-111912.mp3', loop: true, volume: 0.4 });
        bgMusic.play();
        this.bgDucks = this.object.addComponent('howler-audio-source', {src: 'sfx/recording-ducks-binaural-18742.mp3', loop: true, volume: 1.3 });
        this.bgDucks.play();
        this.bgCow = this.object.addComponent('howler-audio-source', {src: 'sfx/cows-56001.mp3', loop: true, volume: 1.0 });
        this.bgCow.play();
        this.bgSheep = this.object.addComponent('howler-audio-source', {src: 'sfx/sheep-23761.mp3', loop: true, volume: 1.0 });
        this.bgSheep.play();        
        this.bgPig = this.object.addComponent('howler-audio-source', {src: 'sfx/pig_grunts_snorts_breathing_hackney_city_farm-73959.mp3', loop: true, volume: 1.0 });
        this.bgPig.play();
        victoryMusic = this.object.addComponent('howler-audio-source', {src: 'music/level-win-6416.mp3', volume: 0.9 });
    },
});
