<template>
    <div class="preview-canvas">
        <div class="preview-header">
            <!-- Barra con info e controlli base per la preview -->
            <span class="device-label">Anteprima Reale (HTML Isolato)</span>
            <div class="device-controls">
                <!-- Potresti aggiungere qui i controlli per cambiare viewport (Mobile, Tablet, Desktop) -->
                <span title="Mobile View" @click="setViewport('mobile')">📱</span>
                <span title="Tablet View" @click="setViewport('tablet')"> टैबलेट</span>
                <span title="Desktop View" @click="setViewport('desktop')">💻</span>
            </div>
        </div>
        
        <div class="iframe-container" :class="viewportClass">
            <!-- L'iframe è isolato per mostrare l'HTML non stilizzato dal VUE app -->
            <iframe 
                ref="iframeRef" 
                title="Page Preview" 
                class="preview-iframe" 
                frameborder="0"
            ></iframe>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { usePageStore } from '../stores/page';

const pageStore = usePageStore();
const iframeRef = ref<HTMLIFrameElement | null>(null);
const currentViewport = ref<'desktop' | 'tablet' | 'mobile'>('desktop');

// Funzione che ottiene l'HTML generato dallo store
const generatedHtml = computed(() => pageStore.exportHtml());

// Calcola le classi CSS in base al viewport selezionato
const viewportClass = computed(() => {
    switch (currentViewport.value) {
        case 'mobile':
            return 'viewport-mobile';
        case 'tablet':
            return 'viewport-tablet';
        default:
            return 'viewport-desktop';
    }
});

/**
 * Funzione chiave: Inietta l'HTML nell'iframe
 */
const updateIframeContent = (htmlContent: string) => {
    if (iframeRef.value && htmlContent) {
        const iframeDoc = iframeRef.value.contentWindow?.document;
        if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(htmlContent);
            iframeDoc.close();
        }
    }
};

/**
 * Watcher: Reagisce ogni volta che l'HTML generato cambia
 */
watch(generatedHtml, (newHtml) => {
    updateIframeContent(newHtml);
}, { immediate: true });

onMounted(() => {
    // Aggiorna il contenuto iniziale al montaggio
    updateIframeContent(generatedHtml.value);
});

/**
 * Imposta il viewport per cambiare la classe CSS del contenitore
 */
const setViewport = (view: 'desktop' | 'tablet' | 'mobile') => {
    currentViewport.value = view;
};
</script>

<style scoped>
:root {
    /* Assicurati che le variabili di colore siano definite nel contesto globale Vue */
    --iframe-bg: #f7f7f7;
    --border-color: #ddd;
    --primary: #007bff;
    --text-primary: #333;
}

.preview-canvas {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--iframe-bg);
}

.preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background-color: #ffffff;
    border-bottom: 1px solid var(--border-color);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    z-index: 10;
}

.device-label {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 0.9rem;
}

.device-controls span {
    margin-left: 15px;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 5px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.device-controls span:hover {
    background-color: #eee;
}

.iframe-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start; /* Allinea l'iframe in alto */
    padding: 20px;
    overflow-y: auto;
}

.preview-iframe {
    background-color: white;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    width: 100%;
    height: 100%;
    transition: width 0.3s ease-in-out;
}

/* Classi di viewport (simulano i dispositivi) */
.viewport-mobile .preview-iframe {
    width: 375px; /* Larghezza tipica iPhone/Android */
    max-height: 800px; 
}

.viewport-tablet .preview-iframe {
    width: 768px; /* Larghezza tipica Tablet */
    max-height: 100%;
}

.viewport-desktop .preview-iframe {
    width: 100%;
    max-width: 1200px;
    height: 100%;
}

.viewport-mobile, .viewport-tablet {
    padding-top: 50px; /* Aggiunge spazio quando il viewport è ristretto */
}
</style>
