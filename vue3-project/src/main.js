import "./assets/css/normalize.min.css";
import "./assets/css/font.css";
import "./assets/css/base.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import i18n from "./locales";
import { initApp } from "./utils/initApp";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
initApp();
app.use(i18n);
app.use(router);
app.mount("#app");