<script setup lang="ts">
import { locale } from './locale'
</script>

<template>
  <div class="lang-toggle" role="group" aria-label="Language">
    <button
      type="button"
      :class="{ active: locale === 'en' }"
      :aria-pressed="locale === 'en'"
      @click="locale = 'en'"
    >EN</button>
    <button
      type="button"
      :class="{ active: locale === 'sv' }"
      :aria-pressed="locale === 'sv'"
      @click="locale = 'sv'"
    >SV</button>
  </div>
</template>

<style scoped>
.lang-toggle {
  display: inline-flex;
  align-items: center;
  padding: 2px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.lang-toggle button {
  padding: 4px 10px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
  font-family: inherit;
}
.lang-toggle button:hover:not(.active) {
  color: rgba(255, 255, 255, 0.85);
}
.lang-toggle button.active {
  background: rgba(99, 102, 241, 0.18);
  color: #fff;
}
</style>
