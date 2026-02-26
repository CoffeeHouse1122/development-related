// ========================
// 自动语言重定向脚本
// 文件名: auto-lang-redirect.js
// 功能: 根据浏览器语言自动跳转到对应语言路径
// 支持: 桌面/移动端 | 路径异常处理 | 防循环跳转
// ========================

/******************** 配置项 ********************/
const CONFIG = {
  BASE_PATH: '/pre/',          // 基础路径 (必须前后带斜杠)
  DEFAULT_LANG: 'en',          // 默认语言代码
  MOBILE_TAG: 'm',             // 移动端路径标识
  MAX_REDIRECT: 2,             // 最大重定向次数防循环
  SUPPORTED_LANGS: {           // 支持的语言配置
    en: ['en', 'en-us', 'en-gb'],
    tw: ['zh-tw', 'zh-hant', 'zh-hk'],
    th: ['th', 'th-th']
  }
};

/******************** 工具函数 ********************/
let redirectCount = 0;

const isMobile = () => 
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const cleanPath = path => 
  path.split('/')
    .filter(seg => seg && !seg.includes('.html') && !seg.includes('.htm'))
    .map(seg => seg.toLowerCase());

const detectLanguage = () => {
  const browserLangs = [
    ...(navigator.languages || []),
    navigator.language,
    navigator.userLanguage,
    navigator.browserLanguage
  ].filter(Boolean).map(l => l.toLowerCase().replace('_', '-'));

  // 精确匹配
  for (const lang of browserLangs) {
    for (const [code, aliases] of Object.entries(CONFIG.SUPPORTED_LANGS)) {
      if (aliases.includes(lang)) return code;
    }
  }

  // 主语言匹配
  for (const lang of browserLangs) {
    const primary = lang.split('-')[0];
    for (const [code, aliases] of Object.entries(CONFIG.SUPPORTED_LANGS)) {
      if (aliases.some(a => a.startsWith(primary))) return code;
    }
  }

  return CONFIG.DEFAULT_LANG;
};

/******************** 核心逻辑 ********************/
const buildNewPath = (currentPath, targetLang) => {
  const segments = cleanPath(currentPath);
  const baseSegments = CONFIG.BASE_PATH.split('/').filter(Boolean);
  
  // 构建新路径数组
  const newSegments = [...baseSegments, targetLang];
  if (isMobile()) newSegments.push(CONFIG.MOBILE_TAG);

  // 保留有效后续路径 (排除已处理的部分)
  const preservedSegments = segments.slice(baseSegments.length)
    .filter(s => s !== targetLang && s !== CONFIG.MOBILE_TAG);

  return `/${[...newSegments, ...preservedSegments].join('/')}/`;
};

const validatePath = path => {
  const pattern = new RegExp(
    `^${CONFIG.BASE_PATH}(${Object.keys(CONFIG.SUPPORTED_LANGS).join('|')})/` +
    `(${CONFIG.MOBILE_TAG}/)?.*`
  );
  return pattern.test(path);
};

const performRedirect = () => {
  if (redirectCount >= CONFIG.MAX_REDIRECT) return;
  
  const currentPath = window.location.pathname;
  if (validatePath(currentPath)) return;

  redirectCount++;
  const targetLang = detectLanguage();
  const newPath = buildNewPath(currentPath, targetLang);

  window.location.replace(validatePath(newPath) ? newPath : 
    `${CONFIG.BASE_PATH}${targetLang}/`
  );
};

/******************** 初始化执行 ********************/
try {
  // 兼容旧浏览器
  if (!navigator.languages) {
    navigator.languages = [navigator.language || CONFIG.DEFAULT_LANG];
  }

  performRedirect();
} catch (e) {
  console.error('[Auto Redirect Error]', e);
}

// 最终安全验证
setTimeout(() => {
  if (!validatePath(window.location.pathname)) {
    window.location.replace(`${CONFIG.BASE_PATH}${CONFIG.DEFAULT_LANG}/`);
  }
}, 100);