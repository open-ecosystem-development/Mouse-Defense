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
import { Component, Type } from "@wonderlandengine/api";
import { state } from "./game";
import { vec3 } from "gl-matrix";
import { MouseMover } from "./mouse-mover";

/**
@brief Returns the player's current location.
*/
export class PlayerLocation extends Component {
    static TypeName = "player-location";
    static Properties = {};

    static onRegister(engine) {
        engine.registerComponent(MouseMover);
      }

    init() {
        this.playerLocation = [0, 0, 0];
        this.object.getPositionWorld(this.playerLocation);
        /** Used by mouse-mover to run away from the player if they get too close to any mice. */
        state.getPlayerLocation = function () {
            return this.playerLocation;
        }.bind(this);
    }
    update() {
        let currentLocation = [0, 0, 0];
        this.object.getPositionWorld(currentLocation);

        let locationDistance = vec3.dist(currentLocation, this.playerLocation);
        if (locationDistance != 0) {
            this.playerLocation = currentLocation;
            try {
                for (let i = 0; i < state.mouseSpawner.targets.length; i++) {
                    let mouseMoverComponent = state.mouseSpawner.targets[i].getComponent(MouseMover);
                    mouseMoverComponent.runFromPlayer(currentLocation);;
                }
            } catch (e) {
                console.log("player-location >> get mouse >> ", e);
            }
        }
    }
};
