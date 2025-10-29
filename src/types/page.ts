const generateId = () => Math.random().toString(36).substring(2, 9);


// --- Tipi di Opzioni Basate sul CSS (Mantengono la coerenza) ---

/** * Le tue classi di spaziatura verticali sono: 
 * .section (default) | .section--sm | .section--lg
 */
export type PaddingSize = 'default' | 'sm' | 'lg';

/**
 * Le tue classi di colonne sono:
 * .grid--2 | .grid--3 (e 1 su mobile)
 */
export type GridColumns = 2 | 3;

/**
 * Le tue utility di margin sono:
 * .mt-8, .mt-16, .mt-24, .mt-32
 */
export type MarginTopSize = 'none' | 'm-0' | 'mt-8' | 'mt-16' | 'mt-24' | 'mt-32';


// --- Tipi Strutturali Principali ---

/**
 * Interfaccia che definisce la struttura fondamentale di ogni blocco nel page editor.
 */
export interface IBlock {
    id: string;
    type: string;
    
    // Contiene i dati funzionali/contenutistici del blocco (es. testo, livello, titolo, ecc.)
    data?: Record<string, any>;

    // Contiene gli attributi HTML da renderizzare (es. class, id, style)
    props?: Record<string, any>; 

    // Contiene i blocchi figli, utilizzato solo dai blocchi contenitori (es. 'section', 'grid').
    children?: IBlock[] | null; 
}


// --- Tipi per l'UI (La nuova Palette Sidebar) ---

/**
 * Interfaccia per definire i componenti disponibili nella palette laterale.
 */
export interface IComponentDefinition {
    id: string;
    name: string;
    type: string; // Corrisponde al campo 'type' in IBlock (es. 'heading', 'section')
    icon: string; // Icona da visualizzare nella sidebar
    description: string;
    isContainer: boolean; // True se il blocco può contenere altri blocchi
}

// --- Struttura Dati Globale ---

export interface IPageStructureState {
    pageBlocks: IBlock[]; 
    selectedBlockId: string | null; 
    isPreviewMode: boolean; 
}

// --- Block Factories (FUNZIONI PER LA CREAZIONE DEI NUOVI BLOCCHI) ---

/**
 * Mappa che contiene le funzioni factory per creare istanze IBlock predefinite.
 */
export const defaultBlockFactories: Record<string, (...args: any[]) => IBlock> = {
    section: (): IBlock => ({
        id: generateId(),
        type: 'section',
        data: {
            title: 'Nuova Sezione',
            size: 'default',
            backgroundColor: '#ffffff',
        },
        children: [],
        props: {
            class: 'section section--default',
        }
    }),
    heading: (): IBlock => ({
        id: generateId(),
        type: 'heading',
        data: {
            content: 'Nuova Intestazione',
            level: 'h2', // h1, h2, h3
            alignment: 'center', // left, center
            marginUtility: 'mt-16',
        },
        children: null,
    }),
    paragraph: (): IBlock => ({
        id: generateId(),
        type: 'paragraph',
        data: {
            content: 'Questo è un nuovo paragrafo di testo. Clicca per modificare il contenuto.',
        },
        children: null,
    }),
    grid: (): IBlock => ({
        id: generateId(),
        type: 'grid',
        data: {
            columns: 3,
            gap: 20, // gap in px
        },
        children: [
            // Aggiungiamo 3 "Tile" di esempio come figli predefiniti della griglia
            defaultBlockFactories.tile!('Tile 1'),
            defaultBlockFactories.tile!('Tile 2'),
            defaultBlockFactories.tile!('Tile 3'),
        ],
        props: {
            class: 'grid grid--3',
        }
    }),
    tile: (title = 'Nuova Scheda'): IBlock => ({
        id: generateId(),
        type: 'tile',
        data: {
            kicker: 'Categoria',
            title: title,
            content: 'Breve descrizione o testo promozionale per la scheda.',
            ctaText: 'Leggi Tutto',
            ctaUrl: '#',
        },
        children: null,
    }),
};

// --- Definizione della Palette per l'UI (usata in BlockPalette.vue) ---

export const componentDefinitions: IComponentDefinition[] = [
    {
        id: generateId(),
        name: 'Sezione Contenitore',
        type: 'section',
        icon: '🟦',
        description: 'Un contenitore per organizzare i blocchi, con opzioni di sfondo e spaziatura.',
        isContainer: true,
    },
    {
        id: generateId(),
        name: 'Intestazione',
        type: 'heading',
        icon: 'H',
        description: 'Titolo di vari livelli (H1, H2, H3).',
        isContainer: false,
    },
    {
        id: generateId(),
        name: 'Paragrafo',
        type: 'paragraph',
        icon: 'P',
        description: 'Testo di base per contenuti lunghi.',
        isContainer: false,
    },
    {
        id: generateId(),
        name: 'Griglia (Container)',
        type: 'grid',
        icon: '▦',
        description: 'Griglia 2 o 3 colonne, pensata per schede o colonne di testo.',
        isContainer: true,
    },
    {
        id: generateId(),
        name: 'Scheda (Tile)',
        type: 'tile',
        icon: '⬜',
        description: 'Una singola scheda di contenuto con titolo, testo e CTA.',
        isContainer: false,
    },
];
