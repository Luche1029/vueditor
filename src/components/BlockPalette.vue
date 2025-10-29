<template>
<div class="palette-container">
    <h3 class="palette-title">Blocchi Disponibili</h3>
    
    <div 
        v-for="component in components"
        :key="component.id"
        :draggable="true"
        @dragstart="startDrag($event, component)"
        class="palette-item"
    >
        <div class="palette-icon">
            <i :class="component.icon"></i>
        </div>
        <div class="palette-details">
            <div class="palette-name">{{ component.name }}</div>
            <div class="palette-description">{{ component.description }}</div>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { IComponentDefinition } from '../types/page';

// Definizione dei blocchi disponibili nella palette
const components = ref<IComponentDefinition[]>([
    {
        id: 'section',
        name: 'Sezione (Contenitore)',
        type: 'section',
        icon: 'fas fa-box',
        description: 'Contenitore primario per padding e sfondo.',
        isContainer: true
    },
    {
        id: 'heading',
        name: 'Intestazione (H1-H3)',
        type: 'heading',
        icon: 'fas fa-heading',
        description: 'Titoli principali o secondari.',
        isContainer: false
    },
    {
        id: 'copyblock',
        name: 'Paragrafo di Testo',
        type: 'copyblock',
        icon: 'fas fa-paragraph',
        description: 'Blocco per testo libero e HTML.',
        isContainer: false
    },
    {
        id: 'grid',
        name: 'Griglia (Contenitore)',
        type: 'grid',
        icon: 'fas fa-th-large',
        description: 'Contenitore per layout a colonne (max 3).',
        isContainer: true
    },
    {
        id: 'tile',
        name: 'Scheda Dettaglio',
        type: 'tile',
        icon: 'fas fa-square',
        description: 'Contenuto con titolo, kicker e CTA.',
        isContainer: false
    },
    // Qui si possono aggiungere altri blocchi
]);

/**
 * Inizializza l'operazione di drag and drop.
 * @param event - L'evento drag.
 * @param component - La definizione del componente trascinato.
 */
const startDrag = (event: DragEvent, component: IComponentDefinition) => {
    if (event.dataTransfer) {
        // Trasferisce il tipo di blocco come testo. Useremo 'blockType' come chiave.
        event.dataTransfer.setData('blockType', component.type);
        // Aggiunge una classe per l'effetto visivo
        event.dataTransfer.effectAllowed = 'copy';
    }
};
</script>

<style scoped>
/* Stili della Palette */
.palette-container {
    padding: 0 15px;
}
.palette-title {
    font-size: 1.1rem;
    color: #ecf0f1;
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px dotted rgba(255, 255, 255, 0.2);
}

.palette-item {
    display: flex;
    align-items: center;
    background-color: #4a637c;
    border-radius: 6px;
    padding: 10px;
    margin-bottom: 8px;
    cursor: grab;
    transition: background-color 0.2s, box-shadow 0.2s;
}

.palette-item:hover {
    background-color: #5c7790;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.palette-icon {
    font-size: 1.2rem;
    color: #42b983; /* Colore Accento */
    margin-right: 10px;
    width: 20px;
    text-align: center;
}

.palette-details {
    flex-grow: 1;
    color: #ecf0f1;
}

.palette-name {
    font-weight: 600;
    font-size: 0.95rem;
}

.palette-description {
    font-size: 0.75rem;
    color: #bdc3c7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>