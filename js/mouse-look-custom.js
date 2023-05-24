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
import { vec3 } from "gl-matrix";
import { state } from "./game";
/**
 * Controls the camera through mouse movement.
 *
 * Efficiently implemented to affect object orientation only
 * when the mouse moves.
 */
var firstShot = false;

export class MouseLookCustom extends Component {
    static TypeName = "mouse-look-custom";
    static Properties = {
        /** Mouse look sensitivity */
        sensitity: { type: Type.Float, default: 0.25 },
        /** Require a mouse button to be pressed to control view.
         * Otherwise view will allways follow mouse movement */
        requireMouseDown: { type: Type.Bool, default: true },
        /** If "moveOnClick" is enabled, mouse button which should
         * be held down to control view */
        mouseButtonIndex: { type: Type.Int, default: 0 },
        /** Enables pointer lock on "mousedown" event on this.enginecanvas */
        pointerLockOnClick: { type: Type.Bool, default: false },
        bulletMesh: { type: Type.Mesh },
        bulletMaterial: { type: Type.Material },
        bulletSpeed: { type: Type.Float, default: 1.0 },
    }

    init() {
        this.currentRotationY = 0;
        this.currentRotationX = 0;
        this.origin = new Float32Array(3);
        this.parentOrigin = new Float32Array(3);
        this.rotationX = 0;
        this.rotationY = 0;
    }

    start() {
        this.lastShotTime = 0;

        state.bulletSpawner = this.object;
        this.soundClick = this.object.addComponent('howler-audio-source', {
            src: 'sfx/9mm-pistol-shoot-short-reverb-7152.mp3',
            volume: 0.5
        });

        document.addEventListener('mousemove', (e) => {
            if (this.active && (this.mouseDown || !this.requireMouseDown)) {
                this.rotationY = -this.sensitity * e.movementX / 100;
                this.rotationX = -this.sensitity * e.movementY / 100;

                this.currentRotationX += this.rotationX;
                this.currentRotationY += this.rotationY;

                /* 1.507 = PI/2 = 90° */
                this.currentRotationX = Math.min(1.507, this.currentRotationX);
                this.currentRotationX = Math.max(-1.507, this.currentRotationX);

                this.object.getTranslationWorld(this.origin);

                const parent = this.object.parent;
                if (parent !== null) {
                    parent.getTranslationWorld(this.parentOrigin);
                    vec3.sub(this.origin, this.origin, this.parentOrigin);
                }

                this.object.resetTranslationRotation();
                this.object.rotateAxisAngleRad([1, 0, 0], this.currentRotationX);
                this.object.rotateAxisAngleRad([0, 1, 0], this.currentRotationY);
                this.object.translate(this.origin);
            }
        });

        const canvas = this.engine.canvas;
        if (this.pointerLockOnClick) {
            canvas.addEventListener("mousedown", () => {
                canvas.requestPointerLock =
                    canvas.requestPointerLock ||
                    canvas.mozRequestPointerLock ||
                    canvas.webkitRequestPointerLock;
                canvas.requestPointerLock();
            });
        }

        if (this.requireMouseDown) {
            if (this.mouseButtonIndex == 2) {
                canvas.addEventListener("contextmenu", function (e) {
                    e.preventDefault();
                }, false);
            }
            canvas.addEventListener('mousedown', function (e) {
                if (e.button == this.mouseButtonIndex) {
                    this.mouseDown = true;
                    document.body.style.cursor = "grabbing";
                    if (e.button == 1) {
                        e.preventDefault();
                        /* Prevent scrolling */
                        return false;
                    }
                }
            }.bind(this));
            canvas.addEventListener('mouseup', function (e) {
                if (e.button == this.mouseButtonIndex) {
                    this.mouseDown = false;
                    document.body.style.cursor = "initial";
                }
            }.bind(this));
        } else {
            canvas.addEventListener('mousedown', function (e) {
                if (e.button == this.mouseButtonIndex) {
                    if (e.button == 0) {
                        let currentTime = Date.now();
                        let lastShotTimeGap = Math.abs(currentTime - this.lastShotTime);

                        if (lastShotTimeGap > 500) {
                            try {
                                const dir = [0, 0, 0];
                                this.object.getForward(dir);

                                this.launch(dir);
                                this.lastShotTime = currentTime;
                                this.soundClick.play();
                            } catch (e) {
                                console.log("mouse shoot >> ", e);
                            }

                        }
                    }
                }
            }.bind(this));
        }
    }

    launch(dir) {
        let bullet = this.spawnBullet();

        bullet.object.transformLocal.set(this.object.transformWorld);
        bullet.object.setDirty();
        bullet.physics.dir.set(dir);

        bullet.physics.scored = false;
        bullet.physics.active = true;

        state.shotCount++;
        state.updateCounter();

        if (!firstShot) {
            state.hideLogo();
            state.updateMoveDuration(true);
            firstShot = true;
        }
    }
    spawnBullet() {
        const obj = this.engine.scene.addObject();

        const mesh = obj.addComponent('mesh');
        mesh.mesh = this.bulletMesh;
        mesh.material = this.bulletMaterial;

        obj.scale([0.05, 0.05, 0.05]);

        mesh.active = true;

        const col = obj.addComponent('collision');
        col.shape = this.engine.Collider.Sphere;
        col.extents[0] = 0.05;
        col.group = (1 << 0);
        col.active = true;

        const physics = obj.addComponent('bullet-physics', {
            speed: this.bulletSpeed,
        });
        physics.active = true;

        return {
            object: obj,
            physics: physics
        };
    }
};