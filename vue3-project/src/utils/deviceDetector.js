export function detectDeviceType() {  
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;  
  
  // 简单的移动设备检测逻辑  
  if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {  
    return 'mobile';  
  }  
  
  // 默认返回桌面  
  return 'desktop';  
}