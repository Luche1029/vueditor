<template>
  <div class="editor-layout">
    <ComponentPalette />
    
    <CanvasArea />

 <PropertiesPanel />
  </div>
</template>

<script setup lang="ts">
import ComponentPalette from '../components/ComponentPalette.vue';
import CanvasArea from '../components/CanvasArea.vue';
import PropertiesPanel from '../components/PropertiesPanel.vue'; 
import { useAuthStore } from '../stores/auth';
import { usePageStore } from '../stores/page'; // Importa lo store della pagina
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const pageStore = usePageStore();
const router = useRouter();
</script>

<style scoped>
.editor-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.properties-panel {
  width: 300px;
  background-color: #f8f8f8;
  border-left: 1px solid #eee;
  padding: 1rem;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
}
</style>