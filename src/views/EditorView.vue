<template>
<div :class="['page-editor-view', {'preview-mode': isPreviewMode}]">
    <!-- Header -->
    <header class="editor-header">
        <h1 class="logo">Page Builder v1.0</h1>
        <div class="actions">
            <!-- Interruttore Modalità Preview -->
            <button 
                :class="['action-btn', {'active': isPreviewMode}]" 
                @click="togglePreview"
                title="Toggle Anteprima"
            >
                <i :class="['fas', isPreviewMode ? 'fa-pen' : 'fa-eye']"></i>
                {{ isPreviewMode ? 'Modalità Editor' : 'Anteprima' }}
            </button>
            
            <!-- Azioni del blocco selezionato -->
            <template v-if="selectedBlockId && !isPreviewMode">
                <button class="action-btn action-btn--danger" @click="deleteSelectedBlock">
                    <i class="fas fa-trash"></i> Elimina Blocco
                </button>
            </template>
        </div>
    </header>

    <!-- Contenitore Principale -->
    <main class="editor-main">
        
        <!-- Sidebar: Palette dei Blocchi -->
        <aside class="editor-sidebar">
            <BlockPalette />
        </aside>

        <!-- Area Centrale (Editor + Preview) -->
        <section class="editor-workspace">
            <!-- Canvas dell'Editor (Visibile solo in Modalità Editor) -->
            <div v-if="!isPreviewMode" class="canvas-editor-container">
                <EditorCanvas :pageBlocks="pageBlocks" />
            </div>

            <!-- Canvas di Anteprima -->
            <div class="canvas-preview-container">
                <PreviewCanvas :pageBlocks="pageBlocks" />
            </div>
        </section>
    </main>

    <!-- Footer: Pannello Proprietà (Visibile solo se un blocco è selezionato e non in Preview) -->
    <footer v-if="selectedBlockId && !isPreviewMode" class="editor-footer-props">
        <BlockProperties 
            :block="getSelectedBlock" 
            :key="selectedBlockId"
        />
    </footer>
</div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { usePageStore } from '../stores/page';

// Componenti
import BlockPalette from '../components/BlockPalette.vue';
import BlockProperties from '../components/BlockProperties.vue';
import EditorCanvas from '../components/EditorCanvas.vue';
import PreviewCanvas from '../components/PreviewCanvas.vue'; // Lo useremo subito per il rendering

// Icone (Assumendo Font Awesome è caricato)
// Non sono necessarie importazioni specifiche per i tag <i>

const pageStore = usePageStore();
const { pageBlocks, selectedBlockId, isPreviewMode, getSelectedBlock } = storeToRefs(pageStore);

// Azioni
const { initializePage, togglePreview, deleteBlock } = pageStore;

onMounted(() => {
    // 1. Inizializza la pagina con una sezione di default
    initializePage();
});

// Funzione helper per l'eliminazione
const deleteSelectedBlock = () => {
    if (selectedBlockId.value) {
        // La logica di deselezione è gestita nello store
        deleteBlock(selectedBlockId.value);
    }
};

// Logica per salvare lo stato (opzionale, ma buona pratica)
watch(pageBlocks, (newBlocks) => {
    // console.log('Blocchi aggiornati:', newBlocks);
    // Qui andrebbe la logica per salvare in localStorage o Firestore
}, { deep: true });

</script>

<style scoped>
/* Variabili per coerenza cromatica */
:root {
    --header-bg: #2c3e50;
    --sidebar-bg: #34495e;
    --footer-bg: #2c3e50;
    --accent-color: #42b983;
    --text-light: #ecf0f1;
    --text-primary: #34495e;
    --text-secondary: #7f8c8d;
    --danger-color: #e74c3c;
    --border-color: #bdc3c7;
}

/* ------------------- LAYOUT GENERALE ------------------- */
.page-editor-view {
    display: grid;
    /* Struttura: Header / Sidebar + Main / Footer */
    grid-template-rows: auto 1fr auto; 
    grid-template-columns: 100%;
    height: 100vh;
    overflow: hidden;
    background-color: #f4f6f9;
}

.editor-main {
    display: grid;
    grid-template-columns: 280px 1fr; /* Sidebar (280px) | Workspace (Resto) */
    overflow: hidden;
}

/* ------------------- HEADER ------------------- */
.editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: var(--header-bg);
    color: var(--text-light);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
    font-size: 1.5rem;
    font-weight: 300;
    margin: 0;
}

.actions {
    display: flex;
    gap: 10px;
}

.action-btn {
    padding: 8px 15px;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
    background-color: var(--sidebar-bg);
    color: var(--text-light);
    border: 1px solid var(--accent-color);
}

.action-btn:hover {
    background-color: var(--accent-color);
    color: var(--header-bg);
}

.action-btn--danger {
    background-color: var(--danger-color);
    border-color: var(--danger-color);
}

.action-btn--danger:hover {
    background-color: #c0392b;
}

/* ------------------- SIDEBAR ------------------- */
.editor-sidebar {
    background-color: var(--sidebar-bg);
    color: var(--text-light);
    padding: 15px 0;
    overflow-y: auto;
    box-shadow: inset -2px 0 4px rgba(0, 0, 0, 0.1);
}

/* ------------------- WORKSPACE (Editor + Preview) ------------------- */
.editor-workspace {
    display: flex;
    overflow: hidden;
}

.canvas-editor-container, 
.canvas-preview-container {
    height: 100%;
    overflow-y: auto;
    padding: 20px;
    transition: width 0.3s ease;
}

/* Modalità Editor: Editor e Preview affiancati */
.editor-workspace .canvas-editor-container {
    width: 50%;
    background-color: #fff;
    border-right: 1px solid var(--border-color);
}
.editor-workspace .canvas-preview-container {
    width: 50%;
    background-color: #fff; /* Sfondo chiaro per l'anteprima */
}

/* Modalità Preview: Solo Preview a larghezza intera */
.preview-mode .editor-sidebar {
    display: none; /* Nasconde la sidebar in preview */
}

.preview-mode .editor-main {
    grid-template-columns: 1fr; /* Rende la main area full width */
}

.preview-mode .canvas-preview-container {
    width: 100%; 
    padding: 0; /* Rimuovi padding se vuoi un'esperienza a schermo intero */
}


/* ------------------- FOOTER (Pannello Proprietà Mobile) ------------------- */
.editor-footer-props {
    height: 220px; /* Altezza fissa per il pannello proprietà */
    background-color: var(--footer-bg);
    color: var(--text-light);
    padding: 15px 20px;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
}
</style>