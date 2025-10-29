<template>
    <div class="heading-properties">
        <div class="property-group full-width">
            <label for="heading-content">Testo Intestazione</label>
            <input 
                id="heading-content"
                type="text"
                :value="block.data?.content"
                @input="updateData('content', ($event.target as HTMLInputElement).value)"
            >
        </div>

        <div class="property-group">
            <label for="heading-level">Livello (H1-H3)</label>
            <select 
                id="heading-level"
                :value="block.data?.level"
                @change="updateData('level', ($event.target as HTMLSelectElement).value)"
            >
                <option value="h1">H1 (Primario)</option>
                <option value="h2">H2 (Secondario)</option>
                <option value="h3">H3 (Terziario)</option>
            </select>
        </div>

        <div class="property-group">
            <label for="heading-alignment">Allineamento</label>
            <select 
                id="heading-alignment"
                :value="block.data?.alignment"
                @change="updateData('alignment', ($event.target as HTMLSelectElement).value)"
            >
                <option value="left">Sinistra</option>
                <option value="center">Centro</option>
            </select>
        </div>

        <div class="property-group">
            <label for="heading-margin">Margine Superiore</label>
            <select 
                id="heading-margin"
                :value="block.data?.marginUtility"
                @change="updateData('marginUtility', ($event.target as HTMLSelectElement).value)"
            >
                <option value="m-0">Nessun Margine (m-0)</option>
                <option value="mt-8">8px</option>
                <option value="mt-16">16px</option>
                <option value="mt-24">24px</option>
                <option value="mt-32">32px</option>
            </select>
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
.heading-properties {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    width: 100%;
}
.property-group {
    display: flex;
    flex-direction: column;
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
input, select {
    padding: 8px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 0.9rem;
    background-color: var(--bg);
    color: var(--text-primary);
    min-width: 150px;
}
</style>
