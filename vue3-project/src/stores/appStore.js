import { defineStore } from "pinia";
import { detectDeviceType } from "@/utils/deviceDetector";

export const useAppStore = defineStore("app", {
  state: () => ({
    deviceType: detectDeviceType(),
    locale: "zh-CN",
    queryParams: {},
  }),
  actions: {
    setDeviceType(deviceType) {
      this.deviceType = deviceType;
    },
    syncDeviceType() {
      this.deviceType = detectDeviceType();
    },
    setLocale(locale) {
      this.locale = locale;
    },
    setQueryParams(queryParams) {
      this.queryParams = queryParams;
    },
  },
});
