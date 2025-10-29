<template>
    <!-- Vue Router caricherà il componente di vista corretto (es. EditorView.vue) qui dentro. -->
    <router-view />
</template>

<script setup lang="ts">
// Nessuna logica o importazione di componenti di layout qui.
</script>

<style>
/* Stili globali per l'applicazione, inclusi i reset */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
}
html, body {
    height: 100%;
    overflow: hidden; /* Garantisce che la gestione dello scroll sia interna alle aree dell'app */
}
</style>
