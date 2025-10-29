<template>
    <!-- 
        Il div esterno rappresenta il blocco corrente. 
        Aggiungiamo l'event listener per la selezione.
    -->
    <div 
        :class="['block-renderer', block.type, {'is-selected': isSelected, 'is-container': isContainer}]"
        :data-block-id="block.id"
        @click.stop="selectThisBlock"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
    >
        <!-- Drop Zone Superiore: Per inserire prima del blocco corrente -->
        <div 
            v-if="!isSelected && !isContainer"
            :class="['drop-zone', {'is-active': activeDropZone === 'top'}]"
            @dragenter="setActiveDropZone('top')"
            @dragleave="clearActiveDropZone"
            @drop.stop="handleExternalDrop($event, 'before')"
        >
             <span class="drop-zone-text">Rilascia qui</span>
        </div>

        <!-- HEADER DEL BLOCCO NELL'EDITOR (Tipo e ID) -->
        <div v-if="!isPreviewMode" class="block-editor-header">
            <span>{{ block.type.toUpperCase() }} (ID: {{ block.id.substring(0, 4) }})</span>
            <span v-if="isContainer" class="container-label">Contenitore</span>
        </div>

        <!-- ---------------------------------------------------- -->
        <!-- RENDER EFFETTIVO DEL CONTENUTO DEL BLOCCO (Switching) -->
        <!-- ---------------------------------------------------- -->

        <div class="block-content">
            <template v-if="block.type === 'section'">
                <div class="section-content">
                    <!-- Sezione Contenitore: renderizza i figli -->
                    <BlockRenderer 
                        v-for="child in block.children" 
                        :key="child.id" 
                        :block="child" 
                        :isPreviewMode="isPreviewMode"
                    />
                    <!-- Drop Zone interna al contenitore (se è vuoto o alla fine) -->
                    <div 
                        v-if="isContainer"
                        :class="['drop-zone drop-zone--container-end', {'is-active': activeDropZone === 'center'}]"
                        @dragenter="setActiveDropZone('center')"
                        @dragleave="clearActiveDropZone"
                        @drop.stop="handleExternalDrop($event, 'inside-end')"
                    >
                         <i class="fas fa-plus"></i> Rilascia qui per aggiungere
                    </div>
                </div>
            </template>
            
            <template v-else-if="block.type === 'grid'">
                <div 
                    :class="['grid-layout', `grid--${block.data?.columns || 3}`]"
                >
                    <BlockRenderer 
                        v-for="child in block.children" 
                        :key="child.id" 
                        :block="child" 
                        :isPreviewMode="isPreviewMode"
                    />
                </div>
            </template>

            <template v-else-if="block.type === 'heading'">
                <component 
                    :is="block.data?.level || 'h2'" 
                    :style="{ textAlign: block.data?.alignment || 'left', marginTop: block.data?.marginUtility === 'm-0' ? '0' : '8px' }"
                >
                    {{ block.data?.content || 'Intestazione' }}
                </component>
            </template>

            <template v-else-if="block.type === 'copyblock'">
                <div v-html="block.data?.content || 'Contenuto di testo o paragrafo'"></div>
            </template>

            <template v-else-if="block.type === 'tile'">
                <div class="tile-content">
                    <span class="tile-kicker">{{ block.data?.kicker || 'KICKER' }}</span>
                    <h4 class="tile-title">{{ block.data?.title || 'Titolo Scheda' }}</h4>
                    <p class="tile-copy">{{ block.data?.content || 'Breve descrizione del contenuto...' }}</p>
                    <a href="#" class="tile-cta">{{ block.data?.ctaText || 'Vedi Dettagli' }}</a>
                </div>
            </template>

            <template v-else>
                <div class="unsupported-block">Blocco Sconosciuto: {{ block.type }}</div>
            </template>
        </div>

        <!-- Drop Zone Inferiore: Per inserire dopo il blocco corrente -->
        <div 
            v-if="!isSelected && !isContainer"
            :class="['drop-zone', {'is-active': activeDropZone === 'bottom'}]"
            @dragenter="setActiveDropZone('bottom')"
            @dragleave="clearActiveDropZone"
            @drop.stop="handleExternalDrop($event, 'after')"
        >
             <span class="drop-zone-text">Rilascia qui</span>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, ref, defineComponent } from 'vue';
import { usePageStore } from '../stores/page';
import { defaultBlockFactories } from '../types/page';
import type { IBlock } from '../types/page';
import { findBlockAndParent } from '../utils/block-helpers';

// Definiamo il componente con `defineComponent` per il rendering ricorsivo.
export default defineComponent({
    name: 'BlockRenderer', // Nome per il riferimento ricorsivo

    props: {
        block: {
            type: Object as () => IBlock,
            required: true,
        },
        isPreviewMode: {
            type: Boolean,
            required: true,
        }
    },

    setup(props) {
        const pageStore = usePageStore();
        
        // Stato locale per tracciare la drop zone attiva (top, bottom, center)
        const activeDropZone = ref<'top' | 'bottom' | 'center' | null>(null);

        // Calcola se il blocco corrente è selezionato
        const isSelected = computed(() => pageStore.selectedBlockId === props.block.id);

        // Calcola se il blocco è un contenitore (può avere figli)
        const isContainer = computed(() => !!props.block.children);


        // ------------------- LOGICA SELEZIONE -------------------

        const selectThisBlock = () => {
            if (!props.isPreviewMode) {
                pageStore.selectBlock(props.block.id);
            }
        };


        // ------------------- LOGICA DRAG & DROP -------------------
        
        // Determina dove mostrare l'indicatore (solo per i blocchi non selezionati)
        const setActiveDropZone = (zone: 'top' | 'bottom' | 'center') => {
             if (pageStore.isPreviewMode || isSelected.value) return;

             // Logica specifica per i contenitori:
             if (isContainer.value) {
                 // Contenitori hanno solo la drop zone 'center' interna
                 if (zone === 'center') {
                     activeDropZone.value = 'center';
                 }
             } else {
                 // Blocchi non contenitori hanno 'top' e 'bottom'
                 activeDropZone.value = zone;
             }
        };

        const clearActiveDropZone = () => {
             activeDropZone.value = null;
        };
        
        /**
         * Gestisce l'evento drop da un elemento esterno (Palette).
         * @param event - Evento drop.
         * @param position - 'before', 'after' (per blocchi normali) o 'inside-end' (per contenitori).
         */
       const handleExternalDrop = (event: DragEvent, position: 'before' | 'after' | 'inside-end') => {
            clearActiveDropZone(); 

            const blockType = event.dataTransfer?.getData('blockType');
            if (!blockType) return;

            const factory = defaultBlockFactories[blockType];
            if (!factory) return;
            
            const newBlock = factory();

            let targetParentId: string | null = null;
            let positionIndex: number = 0;
            
            if (position === 'inside-end') {
                targetParentId = props.block.id;
                positionIndex = props.block.children?.length || 0;

            } else { // 'before' o 'after'
                
                // USIAMO LA FUNZIONE IMPORTATA
                const { parent } = findBlockAndParent(pageStore.pageBlocks, props.block.id);
                let targetArray = parent ? (parent.children || []) : pageStore.pageBlocks;
                let blockIndexInParent = targetArray.findIndex(b => b.id === props.block.id);
                
                if (blockIndexInParent === -1) {
                    console.error("Impossibile trovare il blocco corrente nell'array target.");
                    return;
                }

                if (position === 'before') {
                    positionIndex = blockIndexInParent;
                    targetParentId = parent?.id || null;
                } else { // 'after'
                    positionIndex = blockIndexInParent + 1;
                    targetParentId = parent?.id || null;
                }
            }
            
            pageStore.addBlock(newBlock, targetParentId, positionIndex);
        };
        
        /**
         * L'area di drop principale del blocco. Qui intercettiamo il drag.
         * Per i blocchi non contenitori, questa è usata solo per la selezione 'before/after'.
         */
        const handleDragOver = (event: DragEvent) => {
            // Impedisce il default per consentire il drop
            event.preventDefault(); 

            // Se è in modalità anteprima o il blocco è selezionato, ignoriamo
            if (props.isPreviewMode || isSelected.value) return;

            // Determina la posizione del mouse rispetto al blocco
            const target = event.currentTarget as HTMLElement;
            const rect = target.getBoundingClientRect();
            const y = event.clientY - rect.top; // Posizione Y relativa al blocco
            const height = rect.height;

            // Definisce le zone (20% superiore, 20% inferiore, 60% centrale)
            if (isContainer.value) {
                // Contenitori usano solo la drop zone interna (center)
                setActiveDropZone('center');
            } else {
                if (y < height * 0.3) {
                    setActiveDropZone('top');
                } else if (y > height * 0.7) {
                    setActiveDropZone('bottom');
                } else {
                    // Se non siamo vicino ai bordi, disattiviamo se non è un contenitore
                    clearActiveDropZone();
                }
            }
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = 'copy';
            }
        };

        const handleDragLeave = (event: DragEvent) => {
            const currentTarget = event.currentTarget as Node | null;
            // Cancella se l'uscita è veramente dal blocco, non solo da un figlio
            if (currentTarget && !currentTarget.contains(event.relatedTarget as Node)) {
                clearActiveDropZone();
            }
        };
        
        // handleDrop principale è ignorato perché usiamo handleExternalDrop sulle zone specifiche
        const handleDrop = () => {
             // Questa funzione intercetta il drop su tutto il blocco, ma 
             // usiamo le drop-zone specifiche (top/bottom/center)
             clearActiveDropZone();
        }
        
        // ------------------- FINE LOGICA DRAG & DROP -------------------

        return {
            selectThisBlock,
            isSelected,
            isContainer,
            activeDropZone,
            handleDragOver,
            handleDragLeave,
            handleDrop,
            handleExternalDrop,
            setActiveDropZone,
            clearActiveDropZone,
        };
    },
});
</script>

<style scoped>
/* ------------------- STILI EDITOR ------------------- */
.block-renderer {
    position: relative;
    padding: 10px;
    margin-bottom: 1px; /* Spazio per la drop-zone invisibile */
    border: 1px dashed transparent;
    cursor: pointer;
    transition: background-color 0.1s, border-color 0.1s;
    min-height: 20px; /* Minimo per selezionare */
}

/* Stile per blocco selezionato */
.block-renderer.is-selected {
    background-color: rgba(66, 185, 131, 0.1); /* Verde tenue */
    border: 1px solid #42b983; /* Bordo accentato */
}

.block-renderer:hover:not(.is-selected):not(.is-container) {
    border-color: #bdc3c7;
}

/* Header nell'Editor */
.block-editor-header {
    position: absolute;
    top: -1px;
    right: -1px;
    padding: 2px 6px;
    font-size: 0.7rem;
    background-color: #2c3e50;
    color: white;
    border-bottom-left-radius: 4px;
    z-index: 10;
}
.container-label {
    margin-left: 5px;
    font-weight: 700;
    color: #42b983;
}

/* ------------------- DROP ZONE ------------------- */

.drop-zone {
    position: absolute;
    left: 0;
    right: 0;
    height: 10px; /* Altezza base */
    z-index: 5;
    background-color: transparent;
    transition: background-color 0.1s;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: all; /* Rende la zona cliccabile/intercettabile */
    opacity: 0; /* Inizia invisibile */
}

.drop-zone.is-active {
    background-color: rgba(66, 185, 131, 0.3); /* Colore attivo */
    height: 30px; /* Si espande quando attiva */
    border: 1px solid #42b983;
    opacity: 1;
    cursor: copy;
}

.drop-zone-text {
    font-size: 0.8rem;
    color: #2c3e50;
    font-weight: bold;
    pointer-events: none; /* Assicura che il testo non interferisca */
}

/* Drop Zone Top */
.drop-zone:nth-child(1) {
    top: -5px; /* Si posiziona sopra il blocco (metà è nel blocco, metà fuori) */
}
/* Drop Zone Bottom */
.drop-zone:nth-last-child(1) {
    bottom: -5px; /* Si posiziona sotto il blocco */
}

/* Drop Zone Contenitore (fine array figli) */
.drop-zone--container-end {
    position: static; /* All'interno del flusso del layout del contenitore */
    height: 40px;
    opacity: 1; /* Sempre visibile per i contenitori */
    border: 1px dashed #42b983;
    margin-top: 10px;
    background-color: rgba(66, 185, 131, 0.1);
}
.drop-zone--container-end.is-active {
    background-color: rgba(66, 185, 131, 0.5); /* Effetto hover più scuro */
}
.drop-zone--container-end .fa-plus {
    margin-right: 5px;
}


/* ------------------- STILI TIPI DI BLOCCO ------------------- */

/* Stile specifico per il Contenitore (Sezione/Grid) */
.block-renderer.is-container {
    padding: 15px;
    border: 1px dashed #7f8c8d; /* Bordo grigio per i contenitori */
}

.section-content {
    min-height: 50px;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
}

/* Layout Griglia (Placeholder) */
.grid-layout {
    display: grid;
    gap: 10px;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
}
.grid--2 {
    grid-template-columns: repeat(2, 1fr);
}
.grid--3 {
    grid-template-columns: repeat(3, 1fr);
}

/* Stile Tile */
.tile-content {
    padding: 15px;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 8px;
}
.tile-kicker {
    font-size: 0.7rem;
    color: #42b983;
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
}
.tile-title {
    font-size: 1.2rem;
    margin: 0 0 10px 0;
}
.tile-copy {
    font-size: 0.9rem;
    margin-bottom: 15px;
}
.tile-cta {
    display: inline-block;
    color: #2c3e50;
    font-weight: 600;
    text-decoration: none;
    border-bottom: 2px solid #42b983;
    padding-bottom: 2px;
}
</style>