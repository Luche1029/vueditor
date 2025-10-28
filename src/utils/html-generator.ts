import type { IBlock } from '../types/page';

/**
 * Mappa che associa il tipo di blocco a una funzione di rendering specifica.
 * Ogni funzione prende il blocco e restituisce la stringa HTML corrispondente.
 */
const renderMap: Record<string, (block: IBlock, childrenHtml: string) => string> = {
    
    // --- Blocchi Strutturali ---

    /**
     * Rende il blocco Section.
     * Le sezioni contengono SEMPRE i Contenitori e sono il livello più alto.
     */
    section: (block, childrenHtml) => {
        const { paddingTop, paddingBottom, backgroundColor } = block.props;
        
        // Determina le classi CSS in base alle props
        const paddingClass = (paddingTop !== 'none' || paddingBottom !== 'none') ? 'section' : '';
        const paddingTopClass = paddingTop !== 'none' ? ` pt-${paddingTop}` : '';
        const paddingBottomClass = paddingBottom !== 'none' ? ` pb-${paddingBottom}` : '';
        
        const style = backgroundColor !== '#ffffff' ? ` style="background-color: ${backgroundColor};"` : '';
        
        return `
<section class="${paddingClass}${paddingTopClass}${paddingBottomClass}"${style}>
    ${childrenHtml}
</section>
        `.trim();
    },

    /**
     * Rende il blocco Container.
     * Un Contenitore è usato per limitare la larghezza (e centraggio) all'interno di una Sezione.
     */
    container: (block, childrenHtml) => {
        // Ipotizzando che il Contenitore abbia sempre la classe 'container' nel tuo CSS
        return `
<div class="container">
    ${childrenHtml}
</div>
        `.trim();
    },
    
    /**
     * Rende il blocco Griglia.
     * Applica la classe 'grid' e il numero di colonne.
     */
    grid: (block, childrenHtml) => {
        const { columns, gap } = block.props; // es. columns=3, gap=medium
        const gridClass = `grid grid--${columns}`;
        const gapClass = ` grid-gap--${gap}`; // Classe CSS ipotetica per il gap
        
        return `
<div class="${gridClass}${gapClass}">
    ${childrenHtml}
</div>
        `.trim();
    },

    // --- Blocchi di Contenuto ---
    
    /**
     * Rende il blocco Intestazione (Heading).
     */
    heading: (block, childrenHtml) => {
        const { content, level, alignment, color } = block.props;
        const Tag = level || 'h2'; // es. 'h1', 'h2'
        const style = `text-align: ${alignment}; color: ${color};`;
        
        return `<${Tag} style="${style}">${content}</${Tag}>`;
    },
    
    /**
     * Rende il blocco Paragrafo.
     */
    paragraph: (block, childrenHtml) => {
        const { content, alignment } = block.props;
        const style = `text-align: ${alignment};`;
        
        // Nota: Qui dovremmo gestire l'HTML interno se l'editor fosse un WYSIWYG
        return `<p style="${style}">${content}</p>`;
    },
    
    /**
     * Rende il blocco Pulsante (Button).
     */
    button: (block, childrenHtml) => {
        const { text, url, style, size, target } = block.props;
        // La classe btn--primary/ghost è già nel tuo codice HTML d'esempio
        const classNames = `btn btn--${style} btn--${size}`; 
        const targetAttr = target === '_blank' ? ' target="_blank" rel="noopener"' : '';
        
        return `<a class="${classNames}" href="${url}"${targetAttr}>${text}</a>`;
    },

    // TODO: Aggiungere logica per 'image', 'tile', ecc.
};

/**
 * Funzione principale che converte la struttura JSON in stringa HTML.
 * @param blocks L'array di IBlock da renderizzare.
 * @returns La stringa HTML generata.
 */
export function generateHtmlFromBlocks(blocks: IBlock[]): string {
    if (!blocks || blocks.length === 0) {
        return '';
    }

    let htmlOutput = '';

    for (const block of blocks) {
        // 1. Gestione Ricorsiva dei Figli (Children)
        let childrenHtml = '';
        if (block.children && block.children.length > 0) {
            // Se il blocco ha figli, li renderizza prima ricorsivamente
            childrenHtml = generateHtmlFromBlocks(block.children);
        }

        // 2. Rendering del Blocco Corrente
        const renderFunction = renderMap[block.type];
        if (renderFunction) {
            // Aggiunge il risultato della funzione di rendering.
            htmlOutput += renderFunction(block, childrenHtml) + '\n';
        } else {
            // Gestione dei tipi non mappati
            htmlOutput += `\n`;
        }
    }

    return htmlOutput;
}

// Funzione di utilità per l'esportazione finale
export function exportPageHtml(pageBlocks: IBlock[]): string {
    const contentHtml = generateHtmlFromBlocks(pageBlocks);

    // HEAD e Footer statici (basati sul tuo esempio HTML)
    const baseHtml = `
<!doctype html>
<html lang="it">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Pagina Generata da Re7 Editor</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">  
    <link rel="stylesheet" href="/styles/re7.css" />
</head>
<body>
    <re7-header platform-url="https://re7-pa.justabit.tech"></re7-header>

    ${contentHtml}
    <re7-footer></re7-footer>
</body>
</html>
    `.trim();
    
    return baseHtml;
}