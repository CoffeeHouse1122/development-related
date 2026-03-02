<script setup>
import { computed } from "vue";
import { RouterView } from "vue-router";
import { storeToRefs } from "pinia";
import DesktopLayout from "@/layouts/DesktopLayout.vue";
import MobileLayout from "@/layouts/MobileLayout.vue";
import { useAppStore } from "@/stores/appStore";

const appStore = useAppStore();
const { deviceType } = storeToRefs(appStore);

const currentLayout = computed(() => {
	return deviceType.value === "mobile" ? MobileLayout : DesktopLayout;
});
</script>

<template>
	<component :is="currentLayout">
		<RouterView />
	</component>
</template>
