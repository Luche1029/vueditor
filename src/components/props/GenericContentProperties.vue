<template>
    <div class="generic-properties">
        <h4 class="property-subheader">Contenuto Base</h4>

        <!-- Contenuto Principale (per CopyBlock, Paragraph, o Tile Text) -->
        <div v-if="block.data && block.data.content !== undefined" class="property-group full-width">
            <label for="content-input">Contenuto (HTML supportato)</label>
            <!-- Usiamo un textarea per contenuti più lunghi -->
            <textarea 
                id="content-input"
                :value="block.data?.content"
                @input="updateData('content', ($event.target as HTMLTextAreaElement).value)"
            ></textarea>
        </div>

        <!-- Tile-specific fields -->
        <template v-if="block.type === 'tile'">
            <div class="property-group">
                <label for="kicker-input">Kicker (Categoria)</label>
                <input 
                    id="kicker-input"
                    type="text"
                    :value="block.data?.kicker"
                    @input="updateData('kicker', ($event.target as HTMLInputElement).value)"
                >
            </div>
            <div class="property-group">
                <label for="title-input">Titolo Scheda</label>
                <input 
                    id="title-input"
                    type="text"
                    :value="block.data?.title"
                    @input="updateData('title', ($event.target as HTMLInputElement).value)"
                >
            </div>
            <div class="property-group">
                <label for="cta-text-input">Testo CTA</label>
                <input 
                    id="cta-text-input"
                    type="text"
                    :value="block.data?.ctaText"
                    @input="updateData('ctaText', ($event.target as HTMLInputElement).value)"
                >
            </div>
            <div class="property-group">
                <label for="cta-url-input">URL CTA</label>
                <input 
                    id="cta-url-input"
                    type="text"
                    :value="block.data?.ctaUrl"
                    @input="updateData('ctaUrl', ($event.target as HTMLInputElement).value)"
                >
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { usePageStore } from '../../stores/page';
import type { IBlock } from '../../types/page';

const props = defineProps<{
    block: IBlock;
}>();

const pageStore = usePageStore();

const updateData = (key: string, value: any) => {
    // Aggiunto controllo per block.data per sicurezza (anche se il prop è IBlock)
    if (props.block.data) {
        pageStore.updateBlockData(key, value);
    }
};
</script>

<style scoped>
.generic-properties {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    width: 100%;
}

.property-subheader {
    width: 100%;
    margin: 0;
    font-size: 1rem;
    color: var(--text-primary);
    border-bottom: 1px dotted var(--border-color);
    padding-bottom: 5px;
    margin-bottom: 10px;
}

.property-group {
    display: flex;
    flex-direction: column;
    min-width: 200px; /* Base width */
}

.full-width {
    flex-grow: 1;
    min-width: 400px;
}

label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 4px;
}

input, textarea {
    padding: 8px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 0.9rem;
    background-color: var(--bg);
    color: var(--text-primary);
}

textarea {
    resize: vertical;
    min-height: 80px;
}
</style>
