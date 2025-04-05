import { defineStore } from 'pinia';
import { auth } from 'src/boot/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User as FirebaseUser
} from 'firebase/auth';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  // state
  const user = ref<FirebaseUser | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // getters
  const isAuthenticated = computed(() => !!user.value);
  const currentUser = computed(() => user.value);

  // actions
  function setUser(newUser: FirebaseUser | null) {
    user.value = newUser;
  }

  async function login(email: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(email: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      user.value = null;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    currentUser,
    setUser,
    login,
    register,
    logout
  };
});
