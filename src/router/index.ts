import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth';
// Assicurati che i percorsi siano corretti nel tuo progetto
import Login from '../components/Login.vue'; 
import EditorView from '../views/EditorView.vue'; 

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false } // Non richiede autenticazione
  },
  {
    path: '/editor',
    name: 'Editor',
    component: EditorView,
    meta: { requiresAuth: true } // Richiede autenticazione!
  },
  {
    path: '/',
    redirect: { name: 'Editor' } // Iniziamo reindirizzando all'editor
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard per la protezione delle rotte
router.beforeEach((to, _, next) => {
  const authStore = useAuthStore();
  
  // 1. Se la rotta è protetta E l'utente non è autenticato
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' });
  } 
  // 2. Se l'utente è già loggato e tenta di tornare alla pagina di Login
  else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Editor' });
  } 
  // 3. Altrimenti, continua normalmente
  else {
    next();
  }
});

export default router;