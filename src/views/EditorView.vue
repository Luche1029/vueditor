<template>
  <div class="editor-layout">
    <ComponentPalette />
    
    <div class="canvas-main">
        <div class="editor-toolbar">
            <button @click="handleExport" class="btn-export">
                Esporta HTML 🚀
            </button>
        </div>
        <CanvasArea />
    </div>

 <PropertiesPanel />
  </div>
</template>

<script setup lang="ts">
import ComponentPalette from '../components/ComponentPalette.vue';
import CanvasArea from '../components/CanvasArea.vue';
import PropertiesPanel from '../components/PropertiesPanel.vue'; 
import { usePageStore } from '../stores/page'; 

const pageStore = usePageStore();

function handleExport() {
    const htmlContent = pageStore.exportHtml();
    
    // Logica per scaricare il file (solo per dimostrazione)
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pagina-re7.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("File HTML scaricato! Controlla i tuoi download.");
}
</script>

<style scoped>
/* Aggiusta il layout per accomodare la toolbar */
.editor-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.canvas-main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.editor-toolbar {
    background-color: #fff;
    border-bottom: 1px solid #ddd;
    padding: 10px 20px;
    text-align: right;
}

.btn-export {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;
}

.btn-export:hover {
    background-color: #0056b3;
}

/* ... (mantieni gli altri stili) */
</style>