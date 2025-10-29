<template>
    <!-- Il pannello appare solo se c'è un blocco selezionato e NON siamo in modalità preview -->
    <Transition name="slide-up">
        <div v-if="selectedBlock && !pageStore.isPreviewMode" class="properties-panel">
            
            <div class="panel-header">
                <h3>Modifica Blocco: <span class="block-type">{{ selectedBlock.type }}</span></h3>
                <div class="actions">
                    <button @click="pageStore.selectBlock(null)" class="btn btn-close" title="Chiudi e Deseleziona">
                        ✖ Chiudi
                    </button>
                    <button @click="deleteBlock" class="btn btn-danger" title="Elimina Blocco">
                        🗑️
                    </button>
                </div>
            </div>
            
            <div class="panel-content">
                
                <!-- Campi Comuni a tutti i Blocchi -->
                <div class="property-group">
                    <label>ID Blocco:</label>
                    <input type="text" :value="selectedBlock.id" disabled class="input-disabled">
                </div>

                <!-- Campi Specifici del Blocco -->
                <template v-if="selectedBlock.type === 'section'">
                    <SectionProperties :block="selectedBlock" />
                </template>
                <template v-else-if="selectedBlock.type === 'heading'">
                    <HeadingProperties :block="selectedBlock" />
                </template>
                <template v-else>
                    <!-- Fallback per la modifica del testo base -->
                    <GenericContentProperties :block="selectedBlock" />
                </template>

            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePageStore } from '../stores/page';
import type { IBlock } from '../types/page';

// Importa i sub-componenti per le proprietà specifiche
// NOTA: Devi creare questi componenti separatamente. Li mettiamo come placeholder qui.
// Se non li creiamo, verrà mostrato il fallback GenericContentProperties.
import SectionProperties from './props/SectionProperties.vue';
import HeadingProperties from './props/HeadingProperties.vue';
import GenericContentProperties from './props/GenericContentProperties.vue';


const pageStore = usePageStore();

// Ottieni il blocco selezionato dal getter
const selectedBlock = computed<IBlock | null>(() => pageStore.getSelectedBlock);

/**
 * Gestisce l'eliminazione del blocco selezionato
 */
const deleteBlock = () => {
    if (selectedBlock.value) {
        if (confirm(`Sei sicuro di voler eliminare il blocco ${selectedBlock.value.type}?`)) {
            pageStore.deleteBlock(selectedBlock.value.id);
        }
    }
};

// Funzione placeholder per i sub-componenti che aggiornano i dati
// Sarà implementata nei sub-componenti
// const updateData = (key: string, value: any) => {
//     pageStore.updateBlockData(key, value);
// };

</script>

<style scoped>
/* Transizione Slide Up */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

/* Stili Pannello Proprietà (Footer) */
.properties-panel {
    position: fixed;
    bottom: 0;
    left: 0; /* Si estenderà su tutta la larghezza dell'interfaccia */
    right: 0;
    width: 100%;
    max-height: 40vh; /* Limita l'altezza per non coprire l'intero canvas */
    background-color: var(--panel);
    border-top: 2px solid var(--primary);
    box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.2);
    z-index: 1000; /* Assicurati che sia sopra ogni altro elemento */
    padding: 15px 20px;
    display: flex;
    flex-direction: column;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px dashed var(--border-color);
}

.panel-header h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-primary);
}

.block-type {
    font-weight: 700;
    text-transform: uppercase;
    color: var(--accent);
}

.actions .btn {
    padding: 5px 10px;
    margin-left: 10px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;
}

.btn-close {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
}
.btn-close:hover {
    background-color: #f0f0f0;
}

.btn-danger {
    background-color: #f44336;
    color: white;
    border: none;
}
.btn-danger:hover {
    background-color: #d32f2f;
}

.panel-content {
    overflow-y: auto; /* Permette lo scroll se ci sono troppe proprietà */
    display: flex;
    gap: 20px;
    padding: 10px 0;
}

.property-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

.property-group label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 4px;
}

.input-disabled {
    background-color: #eee;
    color: #999;
    cursor: not-allowed;
    border: 1px solid #ccc;
    padding: 5px 8px;
    border-radius: 4px;
    font-size: 0.9rem;
}
</style>
