// --- Tipi Base ---

/**
 * Le proprietà comuni a tutti i blocchi.
 * Vengono utilizzate per l'identificazione, il rendering e la gestione.
 */
export interface IBlockBase {
  id: string; // ID unico per l'identificazione e il riordinamento (richiesto da vuedraggable)
  type: string; // Tipo di componente (es. 'heading', 'section', 'tile')
  classNames?: string; // Classe CSS avanzata per la designer (opzionale)
}

/**
 * L'oggetto principale che definisce un blocco all'interno della pageStructure.
 */
export interface IBlock extends IBlockBase {
  props: Record<string, any>; // Tutte le proprietà specifiche del blocco (es. content, color)
  children?: IBlock[]; // Array per i blocchi contenitori (es. Section, Grid)
}

// --- Interfacce specifiche per le Props (per i Blocchi di Contenuto) ---

// 1. Blocco Intestazione (Heading)
export interface IHeadingProps {
  content: string; // Il testo del titolo (editing inline)
  level: 'h1' | 'h2' | 'h3' | 'h4'; // Il livello del tag HTML
  alignment: 'left' | 'center' | 'right';
  color?: string; // Colore del testo (codice esadecimale)
}

// 2. Blocco Pulsante (Button)
export interface IButtonProps {
  text: string;
  url: string; // Destinazione del link
  style: 'primary' | 'ghost'; // Stile del pulsante (corrisponde alle classi CSS)
  size: 'small' | 'medium' | 'large';
  target?: '_self' | '_blank'; // Apertura link
}

// 3. Blocco Scheda (Tile)
export interface ITileProps {
  kicker: string; // Testo sopra il titolo
  title: string;
  text: string;
  ctaText: string; // Testo del link 'Scopri'
  ctaUrl: string;
}

// 4. Blocco Immagine (Image)
export interface IImageProps {
  src: string; // URL dell'immagine
  alt: string; // Testo alt obbligatorio per accessibilità
  width?: number; // Larghezza in percentuale o pixel
  ratio: '16x9' | '4x3' | '1x1'; // Rapporto d'aspetto per il responsive
}

// --- Interfacce specifiche per i Blocchi Strutturali ---

// 5. Blocco Sezione (Section)
export interface ISectionProps {
  // Nota: una sezione non ha content, ma ha children
  paddingTop: 'none' | 'small' | 'medium' | 'large';
  paddingBottom: 'none' | 'small' | 'medium' | 'large';
  backgroundColor?: string;
}

// 6. Blocco Griglia (Grid)
export interface IGridProps {
  columns: 2 | 3 | 4; // Numero di colonne
  gap: 'small' | 'medium' | 'large'; // Spaziatura tra le colonne
}


// --- Struttura Dati Globale ---

/**
 * Struttura dei dati principali conservata nel Pinia Store.
 * È l'Albero JSON che l'editor manipola e che viene esportato come HTML.
 */
export interface IPageStructureState {
  // L'array principale che contiene tutti i blocchi di primo livello (Sezioni)
  pageBlocks: IBlock[]; 
  // Riferimento al blocco attualmente selezionato per il Pannello Proprietà
  selectedBlockId: string | null; 
}