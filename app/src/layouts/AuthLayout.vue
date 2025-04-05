<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <div class="auth-container">
        <div class="auth-card-container">
          <q-card class="auth-card">
            <q-card-section class="text-center">
              <h1 class="text-h5 q-mb-md">Monthly Budget Manager</h1>
            </q-card-section>
            <router-view />
          </q-card>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// Authentication layout component for login/register pages
</script>

<style lang="scss">
.auth-container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 50px);
  padding: 1rem;
}

.auth-card-container {
  width: 100%;
  max-width: 450px;
}

.auth-card {
  width: 100%;
  padding: 1rem;
}
</style>
