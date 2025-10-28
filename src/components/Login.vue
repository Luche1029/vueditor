<template>
  <div class="login-container">
    <h2>Accesso Designer Editor</h2>
    
    <div v-if="authStore.isLoading">Caricamento configurazione...</div>

    <form @submit.prevent="attemptLogin" v-else>
      <div class="form-group">
        <label for="username">Nome Utente</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required>
      </div>

      <button type="submit" :disabled="authStore.isLoading">Accedi</button>
      
      <p v-if="loginError" class="error-message">{{ loginError }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router'; // Sarà usato al successo

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const loginError = ref('');

async function attemptLogin() {
  loginError.value = '';
  
  const success = await authStore.login(username.value, password.value);

  if (success) {
    // Al successo, reindirizza all'editor (la rotta che definiremo)
    router.push({ name: 'Editor' });
  } else {
    loginError.value = 'Credenziali non valide. Riprova.';
    password.value = ''; // Pulisce il campo password
  }
}

onMounted(() => {
    // Lancia il caricamento del file auth.json appena il componente è montato
    authStore.loadCredentials(); 
});
</script>

<style scoped>
.login-container { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.form-group { margin-bottom: 15px; }
label { display: block; margin-bottom: 5px; font-weight: bold; }
input { width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ddd; border-radius: 4px; }
button { width: 100%; padding: 10px; background-color: #42b983; color: white; border: none; cursor: pointer; border-radius: 4px; transition: background-color 0.3s; }
button:hover { background-color: #368a62; }
.error-message { color: #d9534f; background-color: #f2dede; padding: 10px; border-radius: 4px; margin-top: 15px; text-align: center; }
</style>