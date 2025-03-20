## 功能：mp4转ts
```
ffmpeg -i input.mp4 -f mpegts -codec:v mpeg1video -qscale:v 7 -codec:a mp2 -an out.ts
-qscale:v 量化参数，值越小质量越高，但文件也会越大
-s 视频尺寸
-an 静音
-r 帧率
```

## 下载安装ffmpeg

- 下载地址：https://ffmpeg.p2hp.com/download.html
- windows系统下载后，配置环境变量