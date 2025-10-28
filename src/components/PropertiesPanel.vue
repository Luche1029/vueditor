<template>
  <div class="properties-panel-wrapper">
    <h3 class="panel__title">🛠️ Proprietà Blocco</h3>
    
    <div v-if="!selectedBlock" class="panel__empty">
      <p>Seleziona un blocco nel Canvas per modificarne le proprietà.</p>
    </div>

    <div v-else class="panel__content">
      <div class="block-info">
        Tipo: <strong>{{ selectedBlock.type.toUpperCase() }}</strong>
      </div>

      <div v-for="(value, key) in selectedBlock.props" :key="key as string" class="prop-group">
        <label :for="key as string" class="prop-label">{{ formatKey(key as string) }}</label>
        
        <input 
          :id="key as string" 
          type="text" 
          :value="value" 
          @input="handleInput(key as string, ($event.target as HTMLInputElement).value)"
        />
        
        <input 
          v-if="key === 'color' || key.includes('Color')" 
          type="color" 
          :value="value"
          @input="handleInput(key as string, ($event.target as HTMLInputElement).value)"
          class="color-picker"
        />

        <select 
            v-else-if="key === 'level'"
            :value="value"
            @change="handleInput(key as string, ($event.target as HTMLSelectElement).value)"
        >
            <option value="h1">H1</option>
            <option value="h2">H2</option>
            <option value="h3">H3</option>
        </select>

        <span class="prop-type">{{ typeof value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from '../stores/page';
import { computed } from 'vue';

const pageStore = usePageStore();

// Usiamo il getter per ottenere reattivamente il blocco selezionato
const selectedBlock = computed(() => pageStore.getSelectedBlock);

/**
 * Gestisce l'input e salva immediatamente il valore aggiornato nello Store Pinia.
 * @param key La chiave della proprietà da aggiornare (es. 'content').
 * @param value Il nuovo valore.
 */
function handleInput(key: string, value: any): void {
  // Conversione di base: se l'input è vuoto, usa null. 
  // Se è numerico, converti in numero.
  let finalValue = value;
  if (typeof selectedBlock.value?.props[key] === 'number') {
      finalValue = parseFloat(value) || 0;
  }
  
  pageStore.updateBlockProp(key, finalValue);
}

/**
 * Helper per formattare la chiave della proprietà per la visualizzazione (es. 'content' -> 'Contenuto').
 */
function formatKey(key: string): string {
  // Sostituisce i camelCase con spazi e mette la prima lettera maiuscola
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}
</script>

<style scoped>
.properties-panel-wrapper {
  width: 300px;
  background-color: #f8f8f8;
  border-left: 1px solid #eee;
  padding: 1rem;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
}

.panel__title {
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
  margin-top: 0;
}

.panel__empty {
  color: #888;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
}

.block-info {
  background-color: #e6ffe6;
  padding: 8px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #42b983;
}

.prop-group {
  margin-bottom: 15px;
  padding: 5px;
  border-bottom: 1px dotted #eee;
}

.prop-label {
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

input[type="text"], select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.color-picker {
  width: 30px;
  height: 30px;
  border: none;
  padding: 0;
  margin-left: 10px;
  vertical-align: middle;
}

.prop-type {
  font-size: 0.7rem;
  color: #aaa;
  float: right;
}
</style>