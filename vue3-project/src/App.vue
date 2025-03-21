<script setup>
import { detectDeviceType } from '@/utils/deviceDetector.js';
import { ref } from 'vue';

const deviceType = ref(detectDeviceType());

</script>

<template>

</template>

<style scoped></style>
