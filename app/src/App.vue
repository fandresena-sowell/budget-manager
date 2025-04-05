<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/user-store';
import { auth } from 'src/boot/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const userStore = useUserStore();
const router = useRouter();

onMounted(() => {
  // Set up authentication listener
  onAuthStateChanged(auth, (user) => {
    userStore.setUser(user);
    if (!user && router.currentRoute.value.meta.requiresAuth) {
      void router.push('/login');
    }
  });
});
</script>
