# 自建 VPN 完整流程（阿里云轻量服务器 + OpenVPN）

## 一、购买服务器

1. 登录 [阿里云轻量应用服务器](https://swas.console.aliyun.com/)
2. 点击“创建实例”
3. 配置选择：
   - **地域**：香港 / 新加坡（推荐香港）
   - **镜像**：系统镜像 → **Ubuntu 22.04**
   - **套餐**：2核1GB（约34元/月，**无固定流量**）
   - 设置 root 密码，确认购买
4. 记下**公网 IP** 和 **root 密码**

---

## 二、配置防火墙（安全组）

1. 在服务器控制台，进入 **防火墙** 页面
2. 添加以下规则（点击“添加规则”）：

| 协议 | 端口 | 来源IP | 备注 |
|------|------|--------|------|
| TCP  | 22   | 0.0.0.0/0 | SSH |
| UDP  | 1194 | 0.0.0.0/0 | OpenVPN |

> 如果安装时选择了 TCP 协议，则放行 TCP 1194。

---

## 三、SSH 连接服务器

在本地终端（Windows PowerShell / macOS 终端）执行：

```bash
ssh root@你的服务器公网IP
```

输入密码后登录。

---

## 四、一键安装 OpenVPN

依次执行以下命令：

```bash
# 更新系统
apt update && apt upgrade -y

# 下载安装脚本
wget https://raw.githubusercontent.com/angristan/openvpn-install/master/openvpn-install.sh
chmod +x openvpn-install.sh

# 运行交互式安装
./openvpn-install.sh interactive
```

安装过程中会提示选择：
- IP 版本：选择 `4` (IPv4)
- 协议：选择 `1` (UDP)
- 端口：直接回车（默认1194）
- DNS：选择 `3` (Cloudflare)
- 客户端名称：输入 `my-laptop`（或自定义）
- 其他选项：全部按回车使用默认值

安装完成后，配置文件会生成在 `/root/` 目录下，文件名就是你输入的客户端名，例如 `/root/my-laptop.ovpn`。

---

## 五、下载配置文件到本地

在**本地电脑**新终端执行：

```bash
scp root@你的服务器IP:/root/my-laptop.ovpn ~/Desktop/
```

> Windows 用户可使用 PowerShell 执行，或使用 WinSCP 工具下载。

---

## 六、客户端连接

### Windows 客户端
- 下载地址：[OpenVPN Connect](https://openvpn.net/downloads/openvpn-connect-v3-windows.msi)
- 安装后打开，点击 **上传文件**，选择下载的 `.ovpn` 文件，然后点击 **连接**。

### macOS 客户端
- 下载地址：[Tunnelblick](https://tunnelblick.net/downloads.html)（免费开源）
- 安装后双击 `.ovpn` 文件，选择 **仅我使用**，输入密码后即可连接。

### iOS (iPhone/iPad)
- 在 App Store 搜索 **OpenVPN Connect** 并安装
- 将 `.ovpn` 文件通过微信/QQ发送到手机，用 OpenVPN Connect 打开并导入，点击连接。

### Android
- 在 Google Play 搜索 **OpenVPN Connect** 或 **OpenVPN for Android**
- 导入 `.ovpn` 文件，连接即可。

---

## 七、验证连接成功

连接后，访问 [ip.sb](https://ip.sb) 或 [ifconfig.me](https://ifconfig.me)，显示的 IP 应该是你服务器的公网 IP。

---

## 八、常见问题

### 1. 连接不上 / 超时
- 检查阿里云防火墙是否开放了 **UDP 1194** 端口
- 确认服务器上的 OpenVPN 服务是否运行：`systemctl status openvpn`

### 2. 连接后无法上网
- 检查 IP 转发是否开启：`sysctl net.ipv4.ip_forward`，应该返回 1。如果不是，执行：
  ```bash
  echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
  sysctl -p
  ```

### 3. ChatGPT 无法访问
- 阿里云香港等数据中心 IP 被 OpenAI 屏蔽，这是正常现象。不影响其他网站访问。
- 解决方法：可尝试在服务器上安装 Cloudflare WARP 更换出口 IP，或购买其他地域服务器（如新加坡）尝试。

---

## 九、添加更多客户端（手机、平板等）

如需添加第二个设备，SSH 登录服务器，再次运行：

```bash
./openvpn-install.sh interactive
```

选择 `1) Add a new client`，输入客户端名称（如 `my-phone`），生成新的 `.ovpn` 文件，下载后导入对应设备即可。多个设备可同时在线。

---

以上就是从购买服务器到连接成功的全部流程。如有任何问题，欢迎随时询问。