# Wonderland Demo
## 目录
- [介绍](#介绍)
- [设置](#设置)
- [执照](#执照)
- [致谢](#致谢)

## 介绍
这个 Wonderland Engine 项目的宗旨是在 Meta Quest 或华为 VR Glass 等 VR 设备上展示 WebXR 的功能。

游戏设置在一个农场，目标是扫除所有出现的老鼠。

请注意，所有开发和测试均使用 Google Chrome、Meta Quest 和华为 VR Glass 进行。


## 设置

### 初始化 
这部分对 Quest 和 HVR Glass 都是通用的。

1. 克隆这个项目和分支：
     `git clone -b chinese-simplified https://github.com/hms-ecosystem/Wonderland-Demo.git`。
2. 下载并安装 [Wonderland Engine Editor](https://wonderlandengine.com/downloads/)。
3. 下载[资产文件](https://github.com/bryantvu/Wonderland-Demo-Assets)，放入项目目录。
4. 在 Wonderland Editor 中打开项目。
5. 打开 Chrome 检查设备 [页面](chrome://inspect/#devices)。
6. 启用“发现 USB 设备” 和 “发现网络目标”
7. 点击`Port forwarding(端口转发)...`按钮
  1. 添加 `8080` 作为 `Port` 端口值。
  2. 将 `localhost:8080` 添加为“IP地址和端口”值。
  3. 勾选`IP address and port`（启用端口转发）选项。
8. 单击“配置...”按钮
  1. 将 `localhost:8080` 添加为“IP 地址和端口”的新值
  2. 勾选“启用端口转发”选项。
9. 回到 Wonderland Editor，打包并启动服务器。

### Meta Quest

1. Meta Quest 手机应用上的[开启开发者模式](https://learn.adafruit.com/sideloading-on-oculus-quest/enable-developer-mode)。
2. 将 Quest 插入计算机。
3. 在 Quest 上，接受“允许调试”提示。
4. Quest 现在应该出现在 `adb devices` 上。 此外，该设备还应显示在 Chrome Inspect 的`Remote Targets`(远程目标)下。
5. 启动 Oculus 浏览器或 Wolvic VR 浏览器并连接到 `http://localhost:8080/index.html`
6. VR 体验应该可用。

### 华为 VR 眼镜

与独立设备的 Meta Quest 不同，华为 HVR 眼镜需要与兼容 VR 的华为手机配合使用。 由于 HVR 眼镜占据了手机的 USB 端口，这意味着 `ADB over USB` 是不可能的，我们必须使用 ADB over `Wi-Fi`。

1. 在兼容HVR的华为手机上[启用USB调试](https://developer.android.com/studio/debug/dev-options)。
2. [通过 Wi-Fi 启用 ADB](https://help.famoco.com/developers/dev-env/adb-over-wifi/)
   1. 将手机和电脑连接到同一个 Wi-Fi 网络。
   2. 将手机插入电脑。
   3. 在电脑命令行输入：`adb tcpip 5555`
   4. 在电脑命令行输入：`adb shell ip addr show wlan0`，复制“inet”后的IP地址，直到“/”。或者，您也可以进入手机设置，在“设置”→“关于”→“状态”中检索 IP 地址。
   5. 在电脑命令行输入：`adb connect <ip-address-of-device>:5555`
   6. 您现在可以断开 USB 电缆并检查“adb devices”是否仍然检测到该设备。该设备还应显示在 Chrome Inspect 的“远程目标”下。
   7. 回到 Wonderland Editor，导航到 Views > Preferences > Server
      1. 检查“启用SSL”
      2. 获取 [OpenSSL](https://www.openssl.org/)（也可以通过 Git 获得）
      3. 生成 SSL 证书文件：`openssl genrsa -des3 -out domain.key 2048`。流程 [概述](https://www.baeldung.com/openssl-self-signed-cert)。
      4. 生成 SSL 密钥文件：`openssl req -key domain.key -new -out domain.csr`。
      5. [生成 SSL dh 参数文件](https://www.ibm.com/docs/en/zvse/6.2?topic=SSB27H_6.2.0/fa2ti_openssl_generate_dh_parms.html): `openssl dhparam -out dhparam.pem 1024` .
      6. 将 SSL 证书、密钥、密码和 dh 参数文件添加到服务器页面。
  8. 在 HVR Glass 上，启动 Wolvic VR 浏览器并连接到 `https://localhost:8080/index.html`
  9. VR 体验应该可用。

	
## 执照

此 Wonderland Engine 示例代码已根据 [Apache 许可证，版本 2.0](http://www.apache.org/licenses/LICENSE-2.0)

## 致谢
该项目中的代码基于 Wonderland 引擎 [Wastepaperbin AR 游戏](https://github.com/WonderlandEngine/wastepaperbin-ar). 