<template>
  <img class="logo" src="/images/logo.svg" alt="" width="24" height="24" />
  <span class="text">Rubic</span>
</template>

<style scoped>
.VPNavBarTitle {
  display: flex;
  align-items: center;
  padding-top: 1px;
  height: var(--vt-nav-height);
  transition: opacity 0.25s;
}
.VPNavBarTitle:hover {
  opacity: 0.6;
}
.logo {
  position: relative;
}
.logo + .text {
  padding-left: 8px;
}
.text {
  font-size: 16px;
  font-weight: 500;
}
</style>
