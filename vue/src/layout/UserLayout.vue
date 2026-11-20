<template>
  <main class="user-layout-wrapper">
    <div class="background-glow background-glow-left" aria-hidden="true"></div>
    <div class="background-glow background-glow-right" aria-hidden="true"></div>
    <div class="background-grid" aria-hidden="true"></div>
    <router-view />
  </main>
</template>

<style scoped lang="less">
.user-layout-wrapper {
  position: relative;
  display: flex;
  width: 100%;
  min-width: 320px;
  min-height: 100vh;
  min-height: 100dvh;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  padding: clamp(24px, 6vw, 96px);
  isolation: isolate;
  background-color: #0755c7;
  background-image:
    linear-gradient(90deg, rgba(4, 29, 111, .16), rgba(0, 117, 208, .08)),
    url('@/assets/admin-login-visual.webp');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.background-glow {
  position: absolute;
  z-index: -1;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(2px);
}

.background-glow-left {
  width: min(44vw, 680px);
  aspect-ratio: 1;
  left: -18%;
  bottom: -35%;
  background: radial-gradient(circle, rgba(0, 226, 255, .2), transparent 68%);
}

.background-glow-right {
  width: min(42vw, 620px);
  aspect-ratio: 1;
  top: -38%;
  right: -16%;
  background: radial-gradient(circle, rgba(111, 238, 255, .2), transparent 68%);
}

.background-grid {
  position: absolute;
  z-index: -1;
  inset: 0;
  pointer-events: none;
  opacity: .12;
  background-image:
    linear-gradient(rgba(255, 255, 255, .13) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, .13) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: linear-gradient(90deg, black, transparent 72%);
}

@media (max-width: 860px) {
  .user-layout-wrapper {
    justify-content: center;
    padding: 28px 20px;
    background-position: 38% center;
  }
}

@media (max-width: 480px) {
  .user-layout-wrapper {
    padding: 20px 14px;
    background-position: 34% center;
  }
}
</style>
