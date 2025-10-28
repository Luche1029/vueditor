import { defineStore } from 'pinia';
import { exportPageHtml } from '../utils/html-generator'; // NUOVA IMPORTAZIONE
import type { 
  IPageStructureState, 
  IBlock, 
  IBlockBase,
  ISectionProps,
  IHeadingProps,
} from '../types/page';

// Funzione helper per generare un ID unico
function generateUniqueId(): string {
  // Un ID basato su timestamp e random number è sufficiente per il frontend
  return `block-${Date.now()}-${Math.floor(Math.random() * 1000)}`; 
}

// Definizioni di base (factory) per i nuovi blocchi
const defaultBlockFactories = {
    // Esempio: Blocco Sezione (Strutturale)
    'section': (): IBlock => ({
        id: generateUniqueId(),
        type: 'section',
        props: {
            paddingTop: 'medium',
            paddingBottom: 'medium',
            backgroundColor: '#ffffff'
        } as ISectionProps,
        children: [] // Le sezioni sono contenitori
    }),
    
    // Esempio: Blocco Intestazione (Contenuto)
    'heading': (): IBlock => ({
        id: generateUniqueId(),
        type: 'heading',
        props: {
            content: 'Nuovo Titolo',
            level: 'h2',
            alignment: 'left',
            color: '#333333'
        } as IHeadingProps,
        children: [] // I titoli non contengono altri blocchi
    }),
    
    // TODO: Aggiungere factory per 'grid', 'image', 'button', ecc.
};

export const usePageStore = defineStore('page', {
  state: (): IPageStructureState => ({
    // Stato iniziale con una sezione vuota predefinita
    pageBlocks: [
        defaultBlockFactories.section() 
    ], 
    selectedBlockId: null,
  }),

  getters: {
    // Restituisce il blocco attualmente selezionato per il Pannello Proprietà
    getSelectedBlock: (state) => {
      if (!state.selectedBlockId) return null;
      
      // Funzione ricorsiva per trovare il blocco a qualsiasi livello di nidificazione
      const findBlock = (blocks: IBlock[]): IBlock | null => {
        for (const block of blocks) {
          if (block.id === state.selectedBlockId) {
            return block;
          }
          if (block.children && block.children.length > 0) {
            const foundChild = findBlock(block.children);
            if (foundChild) return foundChild;
          }
        }
        return null;
      };

      return findBlock(state.pageBlocks);
    }
  },

  actions: {
    /**
     * Seleziona un blocco nel Canvas per la modifica nel Pannello Proprietà.
     * @param id L'ID univoco del blocco da selezionare.
     */
    selectBlock(id: string | null): void {
      this.selectedBlockId = id;
    },

    /**
     * Aggiunge un nuovo blocco alla struttura.
     * @param blockType Il tipo di blocco (es. 'section', 'heading').
     * @param parentId L'ID del blocco contenitore (dove verrà inserito). Se nullo, aggiunge alla radice (pageBlocks).
     * @param index L'indice in cui inserire il blocco.
     */
    addBlock(blockType: string, parentId: string | null = null, index: number = -1): void {
      const newBlockFactory = (defaultBlockFactories as any)[blockType];
      if (!newBlockFactory) {
        console.error(`Tipo di blocco sconosciuto: ${blockType}`);
        return;
      }
      
      const newBlock = newBlockFactory();
      
      if (!parentId) {
        // Aggiungi alla radice (nuova sezione)
        this.pageBlocks.splice(index === -1 ? this.pageBlocks.length : index, 0, newBlock);
      } else {
        // TODO: Implementare la logica ricorsiva per trovare il parent e aggiungere il children
        console.warn("Logica di aggiunta ricorsiva non ancora implementata: trovare il genitore con ID " + parentId);
      }
      
      this.selectBlock(newBlock.id); // Seleziona il nuovo blocco per la modifica
    },

    /**
     * Aggiorna una proprietà di un blocco selezionato.
     * @param key La chiave della proprietà da aggiornare (es. 'content', 'backgroundColor').
     * @param value Il nuovo valore.
     */
    updateBlockProp(key: string, value: any): void {
      const block = this.getSelectedBlock;
      if (block) {
        // Vue e Pinia gestiscono la reattività, quindi la modifica diretta è sicura
        block.props[key] = value;
      }
    },
    
    /**
     * Elimina un blocco dalla struttura.
     * @param id L'ID del blocco da eliminare.
     */
    deleteBlock(id: string): void {
        const removeRecursively = (blocks: IBlock[]): boolean => {
            const initialLength = blocks.length;
            
            // Filtra e rimuove il blocco se trovato
            const filteredBlocks = blocks.filter(block => block.id !== id);
            
            // Se la lunghezza è cambiata, il blocco è stato rimosso a questo livello
            if (filteredBlocks.length !== initialLength) {
                // Sostituisce l'array originale con l'array filtrato (MA l'operazione richiede un'attenzione alla reattività di Vue)
                // In Pinia, un'assegnazione diretta a un array muta lo stato reattivo
                // MA per semplicità, useremo un approccio basato su array mutabile se possibile, altrimenti una copia profonda.
                // Per array nel *root* dello stato, la mutazione funziona:
                if (blocks === this.pageBlocks) {
                    this.pageBlocks = filteredBlocks;
                } else {
                    // Se siamo in un sotto-array (children), dovremmo mutare l'array in place se è reattivo, altrimenti trovare il genitore e riassegnare.
                    // Per ora, ci limitiamo a rimuovere solo i blocchi principali.
                }
                return true;
            }
            
            // Cerca nei children se non trovato
            for (const block of blocks) {
                if (block.children && block.children.length > 0) {
                    if (removeRecursively(block.children)) return true;
                }
            }
            
            return false;
        };
        
        // Esegui la rimozione dal livello più alto
        removeRecursively(this.pageBlocks);
        
        if (this.selectedBlockId === id) {
            this.selectedBlockId = null; // Deseleziona
        }
    },
    
    /**
     * Genera la stringa HTML completa della pagina.
     * @returns La stringa HTML generata.
     */
        exportHtml(): string {
            const html = exportPageHtml(this.pageBlocks);
            console.log("HTML Pagina Generato:", html);
            
            // Questa stringa può essere scaricata o inviata a un backend
            return html; 
        }
  }
});