<template>
    <div class="section-properties">
        <div class="property-group">
            <label for="section-padding">Padding Verticale (Dimensione)</label>
            <select 
                id="section-padding"
                :value="block.data?.size"
                @change="updateData('size', ($event.target as HTMLSelectElement).value)"
            >
                <option value="default">Standard (.section)</option>
                <option value="sm">Piccolo (.section--sm)</option>
                <option value="lg">Grande (.section--lg)</option>
            </select>
        </div>

        <div class="property-group">
            <label for="section-background">Colore Sfondo</label>
            <input 
                id="section-background"
                type="color"
                :value="block.data?.backgroundColor"
                @input="updateData('backgroundColor', ($event.target as HTMLInputElement).value)"
                class="color-input"
            >
            <span class="color-value">{{ block.data?.backgroundColor }}</span>
        </div>
        
        <div class="property-group full-width">
            <label for="section-title">Titolo Sezione (Solo Editor)</label>
            <input 
                id="section-title"
                type="text"
                :value="block.data?.title"
                @input="updateData('title', ($event.target as HTMLInputElement).value)"
                placeholder="Titolo per la navigazione nell'editor"
            >
        </div>
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
    pageStore.updateBlockData(key, value);
};
</script>

<style scoped>
.section-properties {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    width: 100%;
}
.property-group {
    display: flex;
    flex-direction: column;
}

.color-input {
    width: 100px;
    height: 38px; /* Allinea con l'altezza degli altri input */
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
}

.color-value {
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin-top: 5px;
}

.full-width {
    flex-grow: 1;
    min-width: 300px;
}
label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 4px;
}
input:not(.color-input), select {
    padding: 8px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 0.9rem;
    background-color: var(--bg);
    color: var(--text-primary);
    min-width: 150px;
}
</style>
