import type { IBlock } from '../types/page';

/**
 * Funzione ricorsiva che cerca un blocco per ID e ne restituisce l'istanza e il blocco genitore (se presente).
 * Questa utility deve essere usata sia dallo Store Pinia che dai componenti Vue.
 * @param blocks - Array di blocchi da analizzare (tipicamente pageBlocks o children di un blocco).
 * @param blockId - ID del blocco da cercare.
 * @param parent - Il blocco genitore dell'array attuale.
 * @returns Un oggetto contenente il blocco trovato e il suo genitore.
 */
export function findBlockAndParent(
    blocks: IBlock[], 
    blockId: string, 
    parent: IBlock | null = null
): { block: IBlock | undefined, parent: IBlock | null } {
    for (const block of blocks) {
        if (block.id === blockId) {
            return { block, parent };
        }
        if (block.children) {
            // Se il blocco ha figli, cerchiamo ricorsivamente, passando il blocco corrente come nuovo 'parent'
            const found = findBlockAndParent(block.children, blockId, block);
            if (found.block) return found;
        }
    }
    return { block: undefined, parent: null };
}