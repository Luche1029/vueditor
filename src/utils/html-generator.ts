import type { IBlock, GridColumns } from '../types/page';

/**
 * Mappa che associa il tipo di blocco a una funzione di rendering specifica.
 * Ogni funzione prende il blocco e restituisce la stringa HTML corrispondente.
 */
const renderMap: Record<string, (block: IBlock, childrenHtml: string) => string> = {
    
    // --- Blocchi Strutturali ---

    /**
     * Rende il blocco Section. 
     * Utilizza la prop 'size' per applicare le classi di padding (.section, .section--sm, .section--lg).
     */
    section: (block, childrenHtml) => {
        const { size, backgroundColor } = block.props;
        
        let classList = 'section'; // Classe base per il padding
        
        // Determina la classe di dimensione del padding
        if (size === 'sm') {
            classList = 'section section--sm';
        } else if (size === 'lg') {
            classList = 'section section--lg';
        }
        
        // Gestione del background (se diverso dal default --bg)
        const style = backgroundColor ? ` style="background-color: ${backgroundColor};"` : '';
        
        // Aggiunge un contenitore interno per ospitare i figli
        const wrappedChildren = `
    <div class="container">
        ${childrenHtml}
    </div>`;

        return `
<section class="${classList}"${style}>${wrappedChildren}
</section>
        `.trim();
    },

    /**
     * Rende il blocco Griglia.
     * Utilizza la prop 'columns' per applicare le classi (.grid--2, .grid--3).
     */
    grid: (block, childrenHtml) => {
        const { columns } = block.props as { columns: GridColumns };
        
        // Le tue classi sono .grid, .grid--2, .grid--3
        const classList = `grid grid--${columns}`;
        
        return `
<div class="${classList}">
    ${childrenHtml}
</div>
        `.trim();
    },

    // --- Blocchi di Contenuto ---
    
    /**
     * Rende la Testata di Sezione (Section Head).
     */
    sectionhead: (block, _) => {
        const { title, subtitle, marginUtility } = block.props;
        const marginClass = marginUtility && marginUtility !== 'none' ? ` ${marginUtility}` : '';

        return `
<div class="section-head${marginClass}">
    <div>
        <h2 class="section-head__title m-0">${title}</h2>
        <p class="section-head__sub">${subtitle}</p>
    </div>
</div>
        `.trim();
    },
    
    /**
     * Rende il blocco Intestazione (Heading).
     * Nota: Utilizziamo solo le utility di margine, non i colori, come da specifica "solo classi".
     */
    heading: (block, _) => {
        const { content, level, alignment, marginUtility } = block.props;
        const Tag = level || 'h2'; 
        
        // Classe per l'allineamento (solo se non 'left', altrimenti vuota)
        const alignClass = alignment === 'center' ? ' center' : ''; 
        // Classe per il margine
        const marginClass = marginUtility && marginUtility !== 'none' ? ` ${marginUtility}` : '';

        return `<${Tag} class="m-0${alignClass}${marginClass}">${content}</${Tag}>`;
    },
    
    /**
     * Rende il blocco Testo Esteso (.copy).
     */
    copyblock: (block, _) => {
        const { content, marginUtility } = block.props;
        const marginClass = marginUtility && marginUtility !== 'none' ? ` ${marginUtility}` : '';
        
        // Nota: Assumiamo che 'content' contenga HTML pulito (paragrafi, strong)
        return `
<div class="copy${marginClass}">
    ${content}
</div>
        `.trim();
    },
    
    /**
     * Rende il blocco Pulsante (Button).
     */
    button: (block, _) => {
        const { text, url, style, target } = block.props;
        
        // Classi .btn--primary o .btn--ghost
        const classNames = `btn btn--${style}`; 
        const targetAttr = target === '_blank' ? ' target="_blank" rel="noopener"' : '';
        
        return `<a class="${classNames}" href="${url}"${targetAttr}>${text}</a>`;
    },
    
    /**
     * Rende il blocco Scheda (Tile).
     */
    tile: (block, _) => {
        const { kicker, title, text, ctaText, ctaUrl } = block.props;
        
        // Le schede non contengono figli, sono elementi finali
        return `
<article class="tile">
    <div class="tile__kicker">${kicker}</div>
    <h3 class="tile__title">${title}</h3>
    <p class="tile__text">${text}</p>
    <a class="tile__cta" href="${ctaUrl}">${ctaText}</a>
</article>
        `.trim();
    },

    /**
     * Rende il blocco Spaziatore (Divider).
     */
    divider: (block, _) => {
        const { marginUtility } = block.props;
        
        // Questo blocco usa solo la classe di margine, es. <div class="mt-24"></div>
        const marginClass = marginUtility && marginUtility !== 'none' ? marginUtility : 'mt-8'; // Assumiamo un minimo
        
        return `<div class="${marginClass}"></div>`;
    },

    // TODO: Aggiungere logica per 'image', 'carousel', ecc.
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