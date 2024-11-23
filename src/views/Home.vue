<template>
  <div class="tab-table-demo">
    <div class="sidebar">
      <ul>
        <li
          v-for="(tab, index) in tabs"
          :key="index"
          :class="{ active: index === activeTab }"
          @click="activeTab = index"
        >
          {{ tab }}
        </li>
      </ul>
    </div>
    <div class="content">
      <component :is="currentTableComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ThreeBall from './ThreeBall/index.vue'
import WebGLWater from './WebGLWater/index.vue'

const tabs = ref(['ThreeBall', 'WebGLWater'])
const activeTab = ref(0)

const currentTableComponent = computed(() => {
  if (activeTab.value === 0) {
    return ThreeBall
  } else if (activeTab.value === 1) {
    return null
  } else if (activeTab.value === 2) {
    return null
  } else {
    return WebGLWater
  }
})
</script>

<style scoped>
.tab-table-demo {
  display: flex;
  height: 100vh;
  width: 100vw;
}
.sidebar {
  width: 200px;
  background-color: #f4f4f4;
  padding: 20px;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  padding: 10px;
  cursor: pointer;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  text-align: center;
}
.sidebar li.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}
.content {
  width: calc(100% - 200px);
  overflow: auto;
}
</style>
