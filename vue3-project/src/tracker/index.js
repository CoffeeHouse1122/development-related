const trackerEnabled = import.meta.env.VITE_TRACKER_ENABLED === "true";

function outputLog(type, payload) {
  if (!trackerEnabled) return;
  console.info(`[tracker:${type}]`, payload);
}

export function trackEvent(event, payload = {}) {
  outputLog("event", {
    event,
    payload,
    timestamp: Date.now(),
  });
}

export function trackPageView(path) {
  trackEvent("page_view", { path });
}
