<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/stores/appStore";
import { trackEvent } from "@/tracker";
import { commonApi } from "@/apis";

const { t } = useI18n();
const appStore = useAppStore();
const { deviceType, locale } = storeToRefs(appStore);

const title = computed(() => t("common.title"));

async function onDemoClick() {
  trackEvent("click_demo_button", {
    location: "home",
  });
  // const data = await commonApi.postExampleData({id: 8925})
  // if(data.code == 0) {
  //   alert("API call successful: " + JSON.stringify(data.data));
  // } else {
  //   alert("API call failed: " + data.msg);
  // }
  // console.log("API Response:", data);
}
</script>

<template>
  <main class="page-home">
    <h1 class="title">{{ title }}</h1>
    <p class="desc">{{ $t("common.description") }}</p>
    <p class="meta">{{ $t("common.currentDevice") }}: {{ deviceType }}</p>
    <p class="meta">{{ $t("common.currentLanguage") }}: {{ locale }}</p>

    <button class="btn" type="button" @click="onDemoClick">
      Track Demo Event
    </button>
  </main>
</template>

<style scoped>
.page-home {
  padding: 0.48rem 0.32rem;
}

.title {
  margin: 0 0 0.24rem;
  font-size: 0.4rem;
}

.desc,
.meta {
  margin: 0 0 0.16rem;
  font-size: 0.24rem;
}
</style>
