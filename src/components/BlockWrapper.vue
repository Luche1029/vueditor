<template>
  <div 
    :class="['editor-block-wrapper', { 'is-selected': isSelected }]"
    @click.stop="selectThisBlock"
  >
    <div v-if="isSelected" class="block-controls">
      <span class="block-type">{{ block.type.toUpperCase() }}</span>
      <button @click.stop="deleteThisBlock" class="btn-delete">🗑️ Elimina</button>
      <div class="drag-handle">☰ Sposta</div>
    </div>
    
    <div class="block-content">
      <p style="text-align: center; padding: 10px; border: 1px dashed #ccc;">
        **[RENDER]** Tipo: {{ block.type }} | ID: {{ block.id.substring(6, 12) }}
      </p>
      
      <div v-if="block.children && block.children.length">
        <p class="children-indicator">Contenuto Figlio:</p>
        <BlockWrapper 
          v-for="child in block.children" 
          :key="child.id" 
          :block="child"
        />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePageStore } from '../stores/page';
import type { IBlock } from '../types/page';

// 1. Props: Riceve i dati del blocco
const props = defineProps<{
  block: IBlock;
}>();

const pageStore = usePageStore();

// 2. Computed: Verifica se questo blocco è quello selezionato
const isSelected = computed(() => pageStore.selectedBlockId === props.block.id);

// 3. Azioni: Selezione
function selectThisBlock() {
  pageStore.selectBlock(props.block.id);
  console.log(`Blocco selezionato: ${props.block.type} (${props.block.id})`);
}

// 4. Azioni: Eliminazione
function deleteThisBlock() {
  if (confirm(`Sei sicuro di voler eliminare il blocco ${props.block.type}?`)) {
    pageStore.deleteBlock(props.block.id);
  }
}
</script>

<style scoped>
.editor-block-wrapper {
  position: relative;
  margin-bottom: 10px;
  padding: 1px;
  min-height: 50px;
  cursor: pointer;
}

.is-selected {
  outline: 2px solid #42b983; /* Colore primario di Vue */
  padding: 0; /* Rimuove il padding di 1px per l'outline */
}

.block-controls {
  position: absolute;
  top: -25px;
  left: 0;
  right: 0;
  height: 25px;
  background-color: #42b983;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
  font-size: 0.8rem;
  z-index: 10; 
}

.block-type {
  font-weight: bold;
}

.drag-handle {
  cursor: grab;
  padding: 0 5px;
  background-color: rgba(0, 0, 0, 0.2);
}

.btn-delete {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-right: 10px;
  font-size: 0.8rem;
}

.block-content {
  border: 1px solid #eee;
  padding: 10px;
  background-color: white;
}
.children-indicator {
    padding: 5px;
    margin: 5px 0;
    font-style: italic;
    font-size: 0.8rem;
    color: #666;
    border-top: 1px dashed #ddd;
}
</style>