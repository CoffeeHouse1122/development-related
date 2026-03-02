import { useAppStore } from "@/stores/appStore";
import { isSupportedLocale, setLocale } from "@/locales";

function applyDeviceClass(deviceType) {
  document.documentElement.classList.remove("mobile", "desktop");
  document.documentElement.classList.add(deviceType);
}

export function initApp() {
  const appStore = useAppStore();

  appStore.syncDeviceType();
  applyDeviceClass(appStore.deviceType);

  const queryLang = new URLSearchParams(window.location.search).get("lang");
  const lang = isSupportedLocale(queryLang) ? queryLang : appStore.locale;
  appStore.setLocale(lang);
  setLocale(lang);

  window.addEventListener("resize", () => {
    appStore.syncDeviceType();
    applyDeviceClass(appStore.deviceType);
  });
}
