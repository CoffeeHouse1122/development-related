<template>
  <div class="layout layout-desktop">
    <slot />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
}

.layout-desktop {
  min-width: 1200px;
}
</style>
