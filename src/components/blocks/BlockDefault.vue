<template>
    <div class="block-default">
        **ATTENZIONE:** Tipo di blocco sconosciuto o non implementato: **{{ block.type }}**
    </div>
</template>

<script setup lang="ts">
import type { IBlock } from '../../types/page';

defineProps<{
    block: IBlock;
}>();
</script>

<style scoped>
.block-default {
    background-color: #ffdddd;
    color: #cc0000;
    padding: 10px;
    border: 1px solid #cc0000;
    font-size: 14px;
}
</style>
