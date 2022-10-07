# Wonderland Demo
## Table of Contents
- [Introduction](#introduction)
- [Setup](#setup)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Introduction
This Wonderland Engine project is meant to demonstrate the capabilities of WebXR on a VR device such as the Meta Quest or Huawei VR Glass. 

The game is set in a farm and the objective is to shoot all the rats that appear.

Please note that all development and testing was conducted with Google Chrome, Meta Quest, and Huawei VR Glass.

## Setup

### Initial 
This part is common to both the Quest and HVR Glass.
1. Clone this project: https://github.com/bryantvu/Wonderland-Demo.git.
2. Download and install the [Wonderland Engine Editor](https://wonderlandengine.com/downloads/).
3. Open the project in the Wonderland Editor.
4. Open the Chrome Inspect Devices [page](chrome://inspect/#devices).
5. Enable both `Discover USB devices` and `Discover network targets`
6. Click on the `Port forwarding...` button 
	1. Add 8080 as the `Port` value .
	2. Add localhost:8080 as the `IP address and port` value.
	3. Check the `Enable port forwarding` option.
7. Click on the `Configure...` button 
	1. Add localhost:8080 as a new value for `IP address and port`
	2. Check the `Enable port forwarding` option.
8. Back in the Wonderland Editor, package and start the server.

### Meta Quest

1. [Enable Developer Mode](https://learn.adafruit.com/sideloading-on-oculus-quest/enable-developer-mode) on the Meta Quest phone app. 
2. Plug the Quest into the computer.
3. On the Quest, accept the "allow debugging" prompt.
4. The Quest should now show up on `adb devices`. Additionally, the device should also show up under `Remote Targets` on Chrome Inspect.
5. Launch either the Oculus Browser or Wolvic VR Browser and connect to http://localhost:8080/index.html
6. The VR experience should be available.

### Huawei VR Glass
Unlike the Meta Quest, which is a standalone device, the HVR glass works in conjunction with a VR compatible Huawei phone. The HVR glass takes up the USB port of the phone, which means ADB over USB is not possible and we have to use ADB over Wi-FI.

1. [Enable USB debugging](https://developer.android.com/studio/debug/dev-options) on your HVR compatible Huawei phone.
2. [Enable ADB over Wi-Fi](https://help.famoco.com/developers/dev-env/adb-over-wifi/)
	1. Connect both the phone and the computer to the same Wi-Fi network.
	2.  Plug the phone into the computer.
	3.  On the computer command line enter:  `adb tcpip 5555`
	4. On the computer command line enter: `adb shell ip addr show wlan0` and copy the IP address after the "inet" until the "/".  Alternatively, you can also go inside the phone settings to retrieve the IP address in Settings → About → Status.
	5. On the computer command line enter:  `adb connect <ip-address-of-device>:5555`
	6. You can now disconnect the USB cable and check `adb devices` that the device is still detected. The device should also show up under `Remote Targets` on Chrome Inspect.
	7. Back on the Wonderland Editor, navigate to Views > Preferences > Server
		1. Check `SSL enabled`
		2. Get [OpenSSL](https://www.openssl.org/) (also available with Git)
		3. Generate an SSL certificate file: `openssl genrsa -des3 -out domain.key 2048`. Process [overview](https://www.baeldung.com/openssl-self-signed-cert).
		4. Generate an SSL key file: `openssl req -key domain.key -new -out domain.csr`.
		5. [Generate an SSL dh parameters file](https://www.ibm.com/docs/en/zvse/6.2?topic=SSB27H_6.2.0/fa2ti_openssl_generate_dh_parms.html): `openssl dhparam -out dhparam.pem 1024`.
		6. Add the SSL certificate, key, passphrase, and dh params file to the server page.
	8. On the HVR Glass, launch either the Wolvic VR Browser and connect to https://localhost:8080/index.html
	9. The VR experience should be available.
	
## License

This Android sample code is licensed under the [Apache License, version 2.0](http://www.apache.org/licenses/LICENSE-2.0)

## Acknowledgements
The code in this project was based off the Wonderland Engine [Wastepaperbin AR game](https://github.com/WonderlandEngine/wastepaperbin-ar). 