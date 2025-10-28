// Riferimento standard creato da Vite/Vue CLI per i tipi Vue
/// <reference types="vite/client" /> 

// Aggiungi questo modulo per far riconoscere i file .vue a TypeScript
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}