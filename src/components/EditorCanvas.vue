<template>
    <div class="editor-canvas">
        
        <!-- Intestazione -->
        <div class="canvas-header">
            <h2 class="canvas-title">Area di Lavoro</h2>
            <p class="canvas-info">Clicca su un blocco per selezionarlo e modificare le proprietà.</p>
        </div>

        <!-- Se non ci sono blocchi, mostra un messaggio -->
        <div v-if="pageBlocks.length === 0" class="empty-state">
            <p>Non ci sono ancora blocchi. Aggiungi una **Sezione** dalla palette a sinistra per iniziare.</p>
        </div>
        
        <!-- Renderizza l'albero dei blocchi radice -->
        <div class="block-tree">
            <!-- Iteriamo sui blocchi di livello 0 (solo sezioni, teoricamente) -->
            <BlockRenderer 
                v-for="block in pageBlocks" 
                :key="block.id"
                :block="block"
                @select-block="pageStore.selectBlock" 
            />
        </div>
        
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePageStore } from '../stores/page';
import { storeToRefs } from 'pinia';
import BlockRenderer from './BlockRenderer.vue'; // Importa il componente ricorsivo

const pageStore = usePageStore();

// Usiamo pageBlocks per ottenere la lista radice dei blocchi
const { pageBlocks, selectedBlockId } = storeToRefs(pageStore);

// Si noti che selectedBlockId non viene passato esplicitamente come prop,
// ma viene iniettato implicitamente in BlockRenderer tramite il controllo
// su pageStore.selectedBlockId nel BlockRenderer stesso, garantendo reattività.

</script>

<style scoped>
.editor-canvas {
    padding: 20px;
    background-color: var(--bg);
    min-height: 100%;
    position: relative;
    overflow-y: auto;
}

.canvas-header {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px dashed var(--border-color);
}

.canvas-title {
    font-size: 1.5rem;
    color: var(--text-primary);
    margin-bottom: 5px;
}

.canvas-info {
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.empty-state {
    padding: 40px;
    text-align: center;
    border: 2px dashed var(--border-color);
    border-radius: 8px;
    color: var(--text-secondary);
    background-color: white;
}

/* Contenitore principale per l'albero, per pulizia */
.block-tree {
    padding: 10px 0;
}
</style>
