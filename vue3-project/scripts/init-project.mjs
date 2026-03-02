import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

function parseArgs(argv) {
  return argv.reduce((acc, current) => {
    if (current === "--") return acc;

    let normalized = current;
    if (normalized.startsWith("--")) {
      normalized = normalized.slice(2);
    }

    const [rawKey, rawValue] = normalized.split("=");
    if (!rawKey) return acc;

    const key = rawKey.trim();
    const value = (rawValue ?? "").trim();
    acc[key] = value;
    return acc;
  }, {});
}

function updatePackageName(packageJsonPath, projectName) {
  if (!projectName) return;

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  packageJson.name = projectName;
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, "utf-8");
}

function normalizeBoolean(value, defaultValue = "true") {
  if (!value) return defaultValue;
  return value === "true" ? "true" : "false";
}

function updateEnvFile(filePath, updates) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split(/\r?\n/);

  const nextLines = lines.map((line) => {
    const [key] = line.split("=");
    if (!key || !(key in updates)) return line;
    return `${key}=${updates[key]}`;
  });

  const keysInFile = new Set(nextLines.map((line) => line.split("=")[0]));
  Object.entries(updates).forEach(([key, value]) => {
    if (!keysInFile.has(key)) {
      nextLines.push(`${key}=${value}`);
    }
  });

  fs.writeFileSync(filePath, `${nextLines.filter(Boolean).join("\n")}\n`, "utf-8");
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  const projectName = args.name || "";
  const defaultLocale = args.locale || "zh-CN";
  const trackerEnabled = normalizeBoolean(args.tracker, "true");
  const apiDev = args.apiDev || "/api";
  const apiProd = args.apiProd || "https://api.example.com";
  const timeout = args.timeout || "10000";
  const cdnProd = args.cdnProd || "https://cdn.example.com/my-h5-campaign/";

  const packageJsonPath = path.join(projectRoot, "package.json");
  const envDevPath = path.join(projectRoot, ".env.development");
  const envProdPath = path.join(projectRoot, ".env.production");

  updatePackageName(packageJsonPath, projectName);

  updateEnvFile(envDevPath, {
    VITE_API_BASE_URL: apiDev,
    VITE_API_TIMEOUT: timeout,
    VITE_DEFAULT_LOCALE: defaultLocale,
    VITE_TRACKER_ENABLED: trackerEnabled,
  });

  updateEnvFile(envProdPath, {
    VITE_API_BASE_URL: apiProd,
    VITE_API_TIMEOUT: timeout,
    VITE_DEFAULT_LOCALE: defaultLocale,
    VITE_TRACKER_ENABLED: trackerEnabled,
    VITE_CDN_BASE: cdnProd,
  });

  console.info("[init-project] 初始化完成");
  console.info(`- name: ${projectName || "(unchanged)"}`);
  console.info(`- locale: ${defaultLocale}`);
  console.info(`- tracker: ${trackerEnabled}`);
  console.info(`- apiDev: ${apiDev}`);
  console.info(`- apiProd: ${apiProd}`);
  console.info(`- cdnProd: ${cdnProd}`);
  console.info(`- timeout: ${timeout}`);
}

main();
