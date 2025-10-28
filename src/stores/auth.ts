import { defineStore } from 'pinia';
import bcrypt from 'bcryptjs';

// Interfacce per la tipizzazione
interface User {
  username: string;
}

interface StaticCredentials {
  username: string;
  passwordHash: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  staticCredentials: StaticCredentials | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    user: null,
    isLoading: true, 
    staticCredentials: null
  }),

  actions: {
    // Carica l'username e l'hash della password dal file auth.json
    async loadCredentials(): Promise<void> {
      this.isLoading = true;
      try {
        const response = await fetch('/auth.json');
        // Tipizzazione del JSON in ingresso
        const credentials = await response.json() as StaticCredentials;
        
        this.staticCredentials = credentials;
        
      } catch (error) {
        console.error("Errore nel caricamento delle credenziali:", error);
      } finally {
        this.isLoading = false;
      }
    },

    // Tenta l'autenticazione confrontando la password con l'hash salvato
    async login(username: string, password: string): Promise<boolean> {
      if (!this.staticCredentials) {
        await this.loadCredentials(); // Assicura che le credenziali siano caricate
      }
      
      const staticUser = this.staticCredentials;

      if (!staticUser || username !== staticUser.username) {
          return false;
      }
      
      // Confronto sicuro della password con l'hash usando bcrypt
      const isMatch = await bcrypt.compare(password, staticUser.passwordHash);

      if (isMatch) {
        this.isAuthenticated = true;
        this.user = { username: staticUser.username };
        return true; 
      } 
      
      this.isAuthenticated = false;
      this.user = null;
      return false; 
    },

    logout(): void {
      this.isAuthenticated = false;
      this.user = null;
    }
  },
});