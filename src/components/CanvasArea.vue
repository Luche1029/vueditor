<template>
  <div class="canvas-area-wrapper">
    <div class="canvas-header">
      Anteprima Pagina (Sito Vetrina)
    </div>

    <Draggable
      v-model="pageStore.pageBlocks"
      class="canvas-content"
      group="page-editor"
      item-key="id"
      :animation="200"
    >
      <template #item="{ element }">
        <BlockWrapper :block="element" />
      </template>
    </Draggable>

    <div v-if="pageStore.pageBlocks.length === 0" class="empty-canvas">
      Trascina i blocchi dalla Paletta per iniziare.
    </div>
  </div>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable';
import { usePageStore } from '../stores/page';
// Importiamo il componente wrapper che visualizzerà il singolo blocco
import BlockWrapper from './BlockWrapper.vue'; 

const pageStore = usePageStore();
</script>

<style scoped>
.canvas-area-wrapper {
  flex-grow: 1; /* Occupa lo spazio rimanente */
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5; 
  overflow-y: auto; /* Abilita lo scrolling verticale */
}

.canvas-header {
  padding: 10px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #ddd;
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
}

.canvas-content {
  flex-grow: 1;
  padding: 20px;
  min-height: 80vh; /* Garantisce una zona di drop visibile anche se vuota */
  border: 2px dashed rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin: 20px;
  background-color: #fff; /* L'area effettiva del sito */
}

.empty-canvas {
  text-align: center;
  padding: 50px;
  color: #aaa;
  font-style: italic;
}
</style>