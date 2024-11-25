<template>
  <div class="tab-table-demo">
    <div class="sidebar">
      <ul>
        <li
          v-for="(page, index) in pageConfig"
          :key="page.title"
          :class="{ active: index === activeTab }"
          @click="changeComponent(page.component, index)"
        >
          {{ page.title }}
        </li>
      </ul>
    </div>
    <div class="content">
      <component :is="currentTableComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import {pageConfig} from './config';
const currentTableComponent=shallowRef(pageConfig[0].component);
const activeTab = ref(0);
const changeComponent = (component: any, index: number) => {
  currentTableComponent.value = component;
  activeTab.value = index;
}

// const currentTableComponent = computed(() => {
  
// })
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
