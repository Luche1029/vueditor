import type { IBlock } from '../types/page';

/**
 * Mappa che associa un'etichetta visuale (Label) al tipo di blocco (Type)
 * e definisce i dati iniziali di un nuovo blocco.
 */
export const componentMap: { 
    label: string; 
    type: string; 
    factory: () => Omit<IBlock, 'id' | 'children'> 
}[] = [
    // --- Strutturali ---
    {
        label: 'Blocco Sezione',
        type: 'section',
        factory: () => ({
            type: 'section',
            props: { size: 'default' }
        })
    },
    {
        label: 'Griglia (2 Colonne)',
        type: 'grid',
        factory: () => ({
            type: 'grid',
            props: { columns: 2 }
        })
    },
    {
        label: 'Griglia (3 Colonne)',
        type: 'grid',
        factory: () => ({
            type: 'grid',
            props: { columns: 3 }
        })
    },
    {
        label: 'Spaziatore (24px)',
        type: 'divider',
        factory: () => ({
            type: 'divider',
            props: { marginUtility: 'mt-24' }
        })
    },

    // --- Contenuto ---
    {
        label: 'Testata Sezione',
        type: 'sectionhead',
        factory: () => ({
            type: 'sectionhead',
            props: { title: 'Titolo', subtitle: 'Descrizione', marginUtility: 'none' }
        })
    },
    {
        label: 'Titolo H2/H3',
        type: 'heading',
        factory: () => ({
            type: 'heading',
            props: { content: 'Nuovo Titolo', level: 'h2', alignment: 'left', marginUtility: 'm-0' }
        })
    },
    {
        label: 'Testo Esteso (.copy)',
        type: 'copyblock',
        factory: () => ({
            type: 'copyblock',
            props: { content: '<p>Testo di esempio...</p>', marginUtility: 'mt-16' }
        })
    },
    {
        label: 'Scheda / Tile',
        type: 'tile',
        factory: () => ({
            type: 'tile',
            props: { kicker: 'Kicker', title: 'Titolo', text: 'Descrizione', ctaText: 'Scopri', ctaUrl: '#' }
        })
    },
    {
        label: 'Pulsante Primario',
        type: 'button',
        factory: () => ({
            type: 'button',
            props: { text: 'CTA', url: '#', style: 'primary' }
        })
    },
    // TODO: Aggiungere Carousel, Immagine, ecc.
];