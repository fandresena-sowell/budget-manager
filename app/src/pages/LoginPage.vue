<template>
  <q-card-section>
    <h2 class="text-h6 text-center q-mb-lg">Sign In</h2>
    <q-form @submit="onLogin" class="q-gutter-md">
      <q-input
        v-model="email"
        type="email"
        label="Email"
        autocomplete="username"
        outlined
        :rules="[
          (val) => !!val || 'Email is required',
          (val) => isValidEmail(val) || 'Please enter a valid email address'
        ]"
      >
        <template v-slot:prepend>
          <q-icon name="email" />
        </template>
      </q-input>

      <q-input
        v-model="password"
        :type="isPwdVisible ? 'text' : 'password'"
        label="Password"
        autocomplete="current-password"
        outlined
        :rules="[(val) => !!val || 'Password is required']"
      >
        <template v-slot:prepend>
          <q-icon name="lock" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="isPwdVisible ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwdVisible = !isPwdVisible"
          />
        </template>
      </q-input>

      <div class="row justify-between items-center q-mt-sm">
        <q-checkbox v-model="rememberMe" label="Remember me" />
        <q-btn
          flat
          color="primary"
          label="Forgot password?"
          class="no-caps"
          @click="showForgotPasswordDialog = true"
        />
      </div>

      <div class="q-mt-lg">
        <q-btn
          type="submit"
          color="primary"
          label="Sign In"
          class="full-width"
          :loading="loading"
        />
      </div>

      <div class="text-center q-mt-md">
        <p>
          Don't have an account?
          <router-link to="/register" class="text-primary">Sign Up</router-link>
        </p>
      </div>
    </q-form>
  </q-card-section>

  <!-- Forgot Password Dialog -->
  <q-dialog v-model="showForgotPasswordDialog">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Reset Password</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="forgotEmail"
          type="email"
          label="Email"
          outlined
          :rules="[
            (val) => !!val || 'Email is required',
            (val) => isValidEmail(val) || 'Please enter a valid email address'
          ]"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" v-close-popup />
        <q-btn
          flat
          label="Reset"
          color="primary"
          @click="resetPassword"
          :loading="resetLoading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import authService from 'src/services/auth';

// State variables
const email = ref('');
const password = ref('');
const isPwdVisible = ref(false);
const rememberMe = ref(false);
const loading = ref(false);
const showForgotPasswordDialog = ref(false);
const forgotEmail = ref('');
const resetLoading = ref(false);

// Hooks
const router = useRouter();
const $q = useQuasar();

// Validation
const isValidEmail = (val: string) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(val);
};

// Methods
const onLogin = async () => {
  try {
    loading.value = true;
    await authService.login(email.value, password.value);

    // Store remember me preference if requested
    if (rememberMe.value) {
      localStorage.setItem('remember_email', email.value);
    } else {
      localStorage.removeItem('remember_email');
    }

    // Redirect to dashboard
    void router.push('/');
  } catch (error: unknown) {
    // Handle error by showing notification
    $q.notify({
      color: 'negative',
      position: 'top',
      message: error instanceof Error ? error.message : 'Failed to sign in. Please check your credentials.',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const resetPassword = async () => {
  if (!isValidEmail(forgotEmail.value)) {
    $q.notify({
      color: 'warning',
      position: 'top',
      message: 'Please enter a valid email address',
      icon: 'warning'
    });
    return;
  }

  try {
    resetLoading.value = true;
    await authService.resetPassword(forgotEmail.value);
    showForgotPasswordDialog.value = false;

    $q.notify({
      color: 'positive',
      position: 'top',
      message: 'Password reset email has been sent. Please check your inbox.',
      icon: 'check_circle'
    });
  } catch (error: unknown) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: error instanceof Error ? error.message : 'Failed to send reset email. Please try again.',
      icon: 'error'
    });
  } finally {
    resetLoading.value = false;
  }
};

// Check for remembered email on component mount
const rememberedEmail = localStorage.getItem('remember_email');
if (rememberedEmail) {
  email.value = rememberedEmail;
  rememberMe.value = true;
}
</script>

<style lang="scss" scoped>
// Additional styling if needed
</style>
