import { defineStore } from 'pinia';
import { defaultBlockFactories } from '../types/page';
import type { IBlock, IPageStructureState } from '../types/page';
// Importiamo la funzione helper dal nuovo file
import { findBlockAndParent } from '../utils/block-helpers';

export const usePageStore = defineStore('page', {
    state: (): IPageStructureState => ({
        pageBlocks: [], 
        selectedBlockId: null,
        isPreviewMode: false,
    }),

    getters: {
        /** Restituisce il blocco attualmente selezionato. */
        getSelectedBlock: (state): IBlock | null => {
            if (!state.selectedBlockId) return null;
            // Usa la funzione helper importata
            const { block } = findBlockAndParent(state.pageBlocks, state.selectedBlockId);
            return block || null;
        },

        /** Esporta la struttura dei blocchi in HTML (funzionalità base). */
        exportHtml: (state) => (): string => {
            // ... (restante codice del getter exportHtml, non modificato)
            let htmlContent = '<h1>Struttura della Pagina</h1>';
            state.pageBlocks.forEach(block => {
                htmlContent += `<div style="padding: 10px; border: 1px dashed #ccc; margin-bottom: 5px;">${block.type} (ID: ${block.id})</div>`;
            });
            return `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Anteprima</title>
                    <style>
                        body { font-family: sans-serif; margin: 20px; }
                        /* Qui andrebbero gli stili CSS globali della tua pagina */
                    </style>
                </head>
                <body>
                    ${htmlContent}
                </body>
                </html>
            `;
        }
    },

    actions: {
        /** Inizializza la pagina con un blocco sezione di default se è vuota. */
        initializePage() {
            if (this.pageBlocks.length === 0) {
                const sectionFactory = defaultBlockFactories['section'];
                if (sectionFactory) {
                    this.pageBlocks.push(sectionFactory());
                }
            }
        },

        /** Seleziona un blocco per ID, o deseleziona se l'ID è nullo. */
        selectBlock(id: string | null) {
            this.selectedBlockId = id;
        },
        
        /** Aggiorna il campo 'data' del blocco selezionato. */
        updateBlockData(key: string, value: any) {
            const blockToUpdate = this.getSelectedBlock;
            if (blockToUpdate && blockToUpdate.data) {
                blockToUpdate.data[key] = value;
            }
        },

        /** Toggle della modalità anteprima. */
        togglePreview() {
            this.isPreviewMode = !this.isPreviewMode;
            if (this.isPreviewMode) {
                this.selectedBlockId = null;
            }
        },

        /** Elimina il blocco selezionato. */
        deleteBlock(blockId: string) {
            // Usa la funzione helper importata
            const { block, parent } = findBlockAndParent(this.pageBlocks, blockId);

            if (!block) return;

            // Determina l'array target
            const targetArray = parent ? parent.children : this.pageBlocks;
            
            if (Array.isArray(targetArray)) {
                const index = targetArray.findIndex(b => b.id === blockId);
                if (index !== -1) {
                    targetArray.splice(index, 1);
                    if (this.selectedBlockId === blockId) {
                        this.selectedBlockId = null;
                    }
                }
            }
        },

        /** Aggiunge un nuovo blocco in una posizione specifica. */
        addBlock(newBlock: IBlock, targetParentId: string | null, positionIndex: number) {
            if (!targetParentId) {
                this.pageBlocks.splice(positionIndex, 0, newBlock);
                this.selectBlock(newBlock.id);
                return;
            }
            
            // Se c'è un genitore, cerchiamo il genitore
            const { block: parentBlock } = findBlockAndParent(this.pageBlocks, targetParentId);
            if (parentBlock && Array.isArray(parentBlock.children)) {
                parentBlock.children.splice(positionIndex, 0, newBlock);
                this.selectBlock(newBlock.id);
            }
        }
    }
});