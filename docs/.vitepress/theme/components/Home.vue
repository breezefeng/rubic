<script setup lang="ts"></script>
<template>
  <div class="home">
    <section id="hero">
      <img class="logo" src="/images/logo.svg" alt="" />
      <h1 class="tagline">
        <span> Rubic </span>
      </h1>
      <p class="description">响应式小程序框架</p>
      <p class="actions">
        <a class="get-started" href="/guide/introduction.html">
          快速开始
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24">
            <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
          </svg>
        </a>
        <a class="setup" href="/guide/quick-start.html">安装</a>
      </p>
    </section>

    <section id="highlights" class="vt-box-container">
      <div class="vt-box">
        <h2>轻量级</h2>
        <p>轻量的运行时库，专注于小程序 javascript 部分，不依赖任何编译步骤无构建依赖。</p>
      </div>
      <div class="vt-box">
        <h2>响应性/组合式</h2>
        <p>与 Vue 一致的组合式 API & 响应性能力，专注于解决逻辑复用、复杂代码组织问题。</p>
      </div>
      <div class="vt-box">
        <h2>功能丰富</h2>
        <p>拥有丰富的、可渐进式集成的生态系统，可以根据规模在仅使用一个库和使用整套框架间切换自如。</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  min-height: calc(100vh - var(--vt-nav-height) - 88px);
}
section {
  padding: 32px 32px;
}

#hero {
  padding: 64px 32px 0 32px;
  text-align: center;
}

.logo {
  display: block;
  margin: 0 auto;
  width: 200px;
  height: 200px;
}
.tagline {
  font-size: 76px;
  line-height: 1.25;
  font-weight: 900;
  letter-spacing: -1.5px;
  max-width: 960px;
  margin: 0px auto;
}

.tagline span {
  /* color: #646cff; */
  background: -webkit-linear-gradient(315deg, #63bbff 25%, #ac63ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.description {
  max-width: 960px;
  line-height: 1.5;
  color: var(--vt-c-text-2);
  transition: color 0.5s;
  font-size: 22px;
  margin: 24px auto 40px;
}

.actions a {
  font-size: 16px;
  display: inline-block;
  background-color: var(--vt-c-bg-mute);
  padding: 8px 18px;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.5s, color 0.5s;
}

.actions .get-started {
  margin-right: 18px;
}

.actions .icon {
  display: inline;
  position: relative;
  top: -1px;
  margin-left: 2px;
  fill: currentColor;
  transition: transform 0.2s;
}

.actions .get-started:hover {
  transition-duration: 0.2s;
}

.actions .get-started:hover .icon {
  transform: translateX(2px);
}

.actions .get-started,
.actions .setup {
  color: var(--vt-c-text-code);
}

.actions .get-started:hover,
.actions .setup:hover {
  background-color: var(--vt-c-gray-light-4);
  transition-duration: 0.2s;
}

.dark .actions .get-started:hover,
.dark .actions .setup:hover {
  background-color: var(--vt-c-gray-dark-3);
}

#highlights {
  max-width: 960px;
  margin: 0px auto;
  color: var(--vt-c-text-2);
}

#highlights h2 {
  font-weight: 600;
  font-size: 20px;
  letter-spacing: -0.4px;
  color: var(--vt-c-text-1);
  transition: color 0.5s;
  margin-bottom: 0.75em;
}

#highlights p {
  font-weight: 400;
  font-size: 15px;
}

#highlights .vt-box {
  background-color: transparent;
}

#sponsors {
  max-width: 900px;
  margin: 0px auto;
}

#sponsors h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 1em;
}

#sponsors .sponsor-container {
  margin-bottom: 3em;
}

@media (max-width: 960px) {
  .tagline {
    font-size: 64px;
    letter-spacing: -0.5px;
  }
  .description {
    font-size: 18px;
    margin-bottom: 48px;
  }
}

@media (max-width: 768px) {
  .tagline {
    font-size: 48px;
    letter-spacing: -0.5px;
  }
}

@media (max-width: 576px) {
  #hero {
    padding: 64px 32px;
  }
  .description {
    font-size: 16px;
    margin: 18px 0 30px;
  }
  #special-sponsor img {
    display: block;
    margin: 2px auto 1px;
  }
  #highlights h3 {
    margin-bottom: 0.6em;
  }
  #highlights .vt-box {
    padding: 20px 36px;
  }
  .actions a {
    margin: 0.5em 0;
  }
}

@media (max-width: 370px) {
  .tagline {
    font-size: 36px;
  }
}
</style>
