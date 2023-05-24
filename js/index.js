/**
 * /!\ This file is auto-generated.
 *
 * This is the entry point of your standalone application.
 *
 * There are multiple tags used by the editor to inject code automatically:
 *     - `wle:auto-imports:start` and `wle:auto-imports:end`: The list of import statements
 *     - `wle:auto-register:start` and `wle:auto-register:end`: The list of component to register
 *     - `wle:auto-constants:start` and `wle:auto-constants:end`: The project's constants,
 *        such as the project's name, whether it should use the physx runtime, etc...
 *     - `wle:auto-benchmark:start` and `wle:auto-benchmark:end`: Append the benchmarking code
 */

/* wle:auto-imports:start */
import {Cursor} from '@wonderlandengine/components';
import {CursorTarget} from '@wonderlandengine/components';
import {FingerCursor} from '@wonderlandengine/components';
import {FixedFoveation} from '@wonderlandengine/components';
import {HandTracking} from '@wonderlandengine/components';
import {HowlerAudioListener} from '@wonderlandengine/components';
import {PlayerHeight} from '@wonderlandengine/components';
import {VrModeActiveSwitch} from '@wonderlandengine/components';
import {BgMusic} from './bg-music.js';
import {BulletSpawner} from './bullet-spawner.js';
import {ConfettiParticles} from './confetti-particles.js';
import {GameLogo} from './game-logo.js';
import {HudControl} from './hud-control.js';
import {JoystickMovement} from './joystick-movement.js';
import {MouseLookCustom} from './mouse-look-custom.js';
import {MouseSpawner} from './mouse-spawner.js';
import {PlayAgainButton} from './play-again-button.js';
import {PlayerLocation} from './player-location.js';
import {ScoreDisplay} from './score-display.js';
import {ShotCounter} from './shot-counter.js';
import {SpawnMover} from './spawn-mover.js';
import {TeleportCustom} from './teleport-custom.js';
import {WasdControlsCustom} from './wasd-controls-custom.js';
/* wle:auto-imports:end */

import { loadRuntime } from "@wonderlandengine/api";
import * as API from "@wonderlandengine/api"; // Deprecated: Backward compatibility.

/* wle:auto-constants:start */
const RuntimeOptions = {
    physx: false,
    loader: false,
    xrFramebufferScaleFactor: 1,
    canvas: 'canvas',
};
const Constants = {
    ProjectName: 'MyWonderland',
    RuntimeBaseName: 'WonderlandRuntime',
    WebXRRequiredFeatures: ['local',],
    WebXROptionalFeatures: ['local','local-floor','hand-tracking','hit-test',],
};
/* wle:auto-constants:end */

const engine = await loadRuntime(Constants.RuntimeBaseName, RuntimeOptions);
Object.assign(engine, API); // Deprecated: Backward compatibility.
window.WL = engine; // Deprecated: Backward compatibility.

engine.onSceneLoaded.once(() => {
  const el = document.getElementById("version");
  if (el) setTimeout(() => el.remove(), 2000);
});

/* WebXR setup. */

function requestSession(mode) {
  engine
    .requestXRSession(
      mode,
      Constants.WebXRRequiredFeatures,
      Constants.WebXROptionalFeatures
    )
    .catch((e) => console.error(e));
}

function setupButtonsXR() {
  /* Setup AR / VR buttons */
  const arButton = document.getElementById("ar-button");
  if (arButton) {
    arButton.dataset.supported = engine.arSupported;
    arButton.addEventListener("click", () => requestSession("immersive-ar"));
  }
  const vrButton = document.getElementById("vr-button");
  if (vrButton) {
    vrButton.dataset.supported = engine.vrSupported;
    vrButton.addEventListener("click", () => requestSession("immersive-vr"));
  }
}

if (document.readyState === "loading") {
  window.addEventListener("load", setupButtonsXR);
} else {
  setupButtonsXR();
}

/* wle:auto-register:start */
engine.registerComponent(Cursor);
engine.registerComponent(CursorTarget);
engine.registerComponent(FingerCursor);
engine.registerComponent(FixedFoveation);
engine.registerComponent(HandTracking);
engine.registerComponent(HowlerAudioListener);
engine.registerComponent(PlayerHeight);
engine.registerComponent(VrModeActiveSwitch);
engine.registerComponent(BgMusic);
engine.registerComponent(BulletSpawner);
engine.registerComponent(ConfettiParticles);
engine.registerComponent(GameLogo);
engine.registerComponent(HudControl);
engine.registerComponent(JoystickMovement);
engine.registerComponent(MouseLookCustom);
engine.registerComponent(MouseSpawner);
engine.registerComponent(PlayAgainButton);
engine.registerComponent(PlayerLocation);
engine.registerComponent(ScoreDisplay);
engine.registerComponent(ShotCounter);
engine.registerComponent(SpawnMover);
engine.registerComponent(TeleportCustom);
engine.registerComponent(WasdControlsCustom);
/* wle:auto-register:end */

engine.scene.load(`${Constants.ProjectName}.bin`);

/* wle:auto-benchmark:start */
/* wle:auto-benchmark:end */
