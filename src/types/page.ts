// --- Tipi Base ---

// (Mantieni IBlockBase e IBlock invariati)
export interface IBlockBase {
  id: string;
  type: string;
  classNames?: string; // Utilità avanzata per classi custom
}

export interface IBlock extends IBlockBase {
  props: Record<string, any>;
  children?: IBlock[];
}

// --- Tipi di Opzioni Basate sul CSS ---

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

// --- Interfacce specifiche per le Props (Aggiornate) ---

// 1. Blocco Sezione (Section)
export interface ISectionProps {
  // Nota: usiamo paddingTop/Bottom in ISectionProps, ma solo una classe complessiva nel CSS (.section--sm/.section--lg)
  // Per semplicità, useremo una singola proprietà 'size' per controllare la classe .section--X
  size: PaddingSize; 
  backgroundColor?: string; // Potrebbe essere usato per cambiare lo sfondo al di fuori di --bg, es. var(--panel)
}

// 2. Blocco Griglia (Grid)
export interface IGridProps {
  columns: GridColumns; 
  // Nel tuo CSS, il gap è fisso (16px), quindi non serve renderlo modificabile a meno di nuove classi.
}

// 3. Blocco Intestazione (Heading)
export interface IHeadingProps {
  content: string; 
  level: 'h1' | 'h2' | 'h3'; 
  // Non ci sono classi CSS esplicite per l'allineamento o il colore qui, ma potresti voler includere 'center' e 'm-0'.
  alignment: 'left' | 'center'; 
  marginUtility?: MarginTopSize; // Utilità di margine come .m-0 o .mt-24
}

// 4. Blocco Paragrafo (Paragraph)
export interface IParagraphProps {
  content: string; 
  // Useremo 'copy' come un blocco contenitore più che un singolo paragrafo.
}

// 5. Blocco Pulsante (Button)
export interface IButtonProps {
  text: string;
  url: string; 
  // Corrisponde a .btn--primary e .btn--ghost
  style: 'primary' | 'ghost'; 
  target?: '_self' | '_blank'; 
}

// 6. Blocco Scheda (Tile)
export interface ITileProps {
  kicker: string; 
  title: string;
  text: string;
  ctaText: string; 
  ctaUrl: string;
}

// 7. Blocco Testata Sezione (Section Head) - NEW
export interface ISectionHeadProps {
  title: string; // Titolo h2 (classe section-head__title)
  subtitle: string; // Sottotitolo (classe section-head__sub)
  marginUtility?: MarginTopSize; // Utilità di margine come .mt-24
}

// 8. Blocco Contenuto Testuale (Copy Block) - NEW
// Questo blocca rappresenta il blocco di testo esteso con la classe .copy
export interface ICopyBlockProps {
    content: string; // Potrebbe essere HTML (paragrafi, strong)
    marginUtility?: MarginTopSize; 
}


// --- Struttura Dati Globale (Invariata) ---

export interface IPageStructureState {
  pageBlocks: IBlock[]; 
  selectedBlockId: string | null; 
}