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
/* Global function used to update the score display */
var updateCounter = null;
/**
@brief Marks an object with text component as "score display"

The center top text object that shows various helpful tutorial
texts and the score.
*/
WL.registerComponent('shot-counter', {
}, {
    init: function() {
        this.text = this.object.getComponent('text');

        updateCounter = function(text) {
            this.text.text = "Shots Fired: " + text;
        }.bind(this);

        // updateScore("");
        /* Initial text to set after session started */
        WL.onXRSessionStart.push(function() {
            // updateScore("Slowly scan\narea");
        });
    },
});
