<template>
  <div class="layout layout-mobile">
    <slot />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  width: 100%;
}

.layout-mobile {
  max-width: 750px;
  margin: 0 auto;
}
</style>
