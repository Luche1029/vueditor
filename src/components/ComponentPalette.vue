<template>
  <div class="component-palette">
    <h3 class="palette__title">Elementi Pagina</h3>
    
    <Draggable
      class="palette__list"
      :list="availableComponents"
      :group="{ name: 'page-editor', pull: 'clone', put: false }"
      :sort="false"
      :clone="cloneBlock"
    >
      <template #item="{ element }">
        <div class="palette__item">
          {{ element.label }}
        </div>
      </template>
    </Draggable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Draggable from 'vuedraggable';
import { componentMap } from '../data/component-map';
import type { IBlock } from '../types/page';

// Genera un ID unico (necessario per il cloning)
function generateUniqueId(): string {
  return `block-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// L'array di elementi disponibili nella paletta
const availableComponents = ref(componentMap);

/**
 * Questa funzione viene chiamata da vuedraggable al momento in cui l'elemento
 * viene clonato (trascinato fuori dalla paletta).
 * Clona l'oggetto factory e assegna un ID unico.
 * @param original - L'oggetto del componentMap.
 * @returns La nuova istanza del blocco con un ID unico.
 */
function cloneBlock(original: typeof availableComponents.value[0]): IBlock {
    const newBlockData = original.factory();
    
    // Aggiunge l'ID unico e i children (obbligatorio per i blocchi contenitori)
    return {
        ...newBlockData,
        id: generateUniqueId(),
        children: [] // Assicuriamo che ci sia sempre children, anche se vuoto, per i contenitori
    } as IBlock;
}

</script>

<style scoped>
/* Stili semplici per il layout della paletta */
.component-palette {
  width: 250px;
  background-color: #f8f8f8;
  border-right: 1px solid #eee;
  padding: 1rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
}

.palette__title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.palette__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.palette__item {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: grab; /* Indica che l'elemento è trascinabile */
  font-size: 0.9rem;
  text-align: center;
  user-select: none; /* Impedisce la selezione del testo durante il drag */
  transition: background-color 0.2s;
}

.palette__item:hover {
  background-color: #f0f0f0;
}
</style>