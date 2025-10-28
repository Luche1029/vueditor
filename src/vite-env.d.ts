// Aggiungi questo modulo per far riconoscere i file .vue a TypeScript
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}