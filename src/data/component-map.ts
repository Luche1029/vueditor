import type { IBlock } from '../types/page';

/**
 * Mappa che associa un'etichetta visuale (Label) al tipo di blocco (Type)
 * e definisce i dati iniziali di un nuovo blocco (Factory) per il cloning.
 */
export const componentMap: { 
    label: string; 
    type: string; 
    factory: () => Omit<IBlock, 'id' | 'children'> 
}[] = [
    {
        label: 'Sezione',
        type: 'section',
        factory: () => ({
            type: 'section',
            props: { paddingTop: 'medium', paddingBottom: 'medium', backgroundColor: '#ffffff' }
        })
    },
    {
        label: 'Griglia (3 Colonne)',
        type: 'grid',
        factory: () => ({
            type: 'grid',
            props: { columns: 3, gap: 'medium' }
        })
    },
    {
        label: 'Titolo',
        type: 'heading',
        factory: () => ({
            type: 'heading',
            props: { content: 'Nuovo Titolo', level: 'h2', alignment: 'left', color: '#333333' }
        })
    },
    {
        label: 'Paragrafo',
        type: 'paragraph',
        factory: () => ({
            type: 'paragraph',
            props: { content: 'Inserisci il tuo testo qui...', style: 'normal' }
        })
    },
    {
        label: 'Pulsante CTA',
        type: 'button',
        factory: () => ({
            type: 'button',
            props: { text: 'Scopri di più', url: '#', style: 'primary', size: 'medium' }
        })
    },
    // TODO: Aggiungere Image, Tile, Divider, ecc.
];