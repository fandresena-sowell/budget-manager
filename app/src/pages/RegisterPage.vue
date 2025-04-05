<template>
  <q-card-section>
    <h2 class="text-h6 text-center q-mb-lg">Create an Account</h2>
    <q-form @submit="onRegister" class="q-gutter-md">
      <q-input
        v-model="displayName"
        type="text"
        label="Full Name"
        outlined
        :rules="[(val) => !!val || 'Name is required']"
      >
        <template v-slot:prepend>
          <q-icon name="person" />
        </template>
      </q-input>

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
        autocomplete="new-password"
        outlined
        :rules="[
          (val) => !!val || 'Password is required',
          (val) => val.length >= 8 || 'Password must be at least 8 characters',
          (val) => /[A-Z]/.test(val) || 'Password must contain at least one uppercase letter',
          (val) => /[0-9]/.test(val) || 'Password must contain at least one number',
          (val) => /[^A-Za-z0-9]/.test(val) || 'Password must contain at least one special character'
        ]"
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

      <q-input
        v-model="confirmPassword"
        :type="isConfirmPwdVisible ? 'text' : 'password'"
        label="Confirm Password"
        autocomplete="new-password"
        outlined
        :rules="[
          (val) => !!val || 'Please confirm your password',
          (val) => val === password || 'Passwords do not match'
        ]"
      >
        <template v-slot:prepend>
          <q-icon name="lock" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="isConfirmPwdVisible ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isConfirmPwdVisible = !isConfirmPwdVisible"
          />
        </template>
      </q-input>

      <!-- Password strength indicator -->
      <div v-if="password" class="password-strength">
        <p class="text-caption q-mb-sm">Password strength:</p>
        <div class="strength-bar">
          <div
            class="strength-indicator"
            :class="strengthClass"
            :style="{ width: `${passwordStrength}%` }"
          ></div>
        </div>
        <p class="text-caption q-mt-xs" :class="strengthTextClass">
          {{ strengthText }}
        </p>
      </div>

      <!-- Terms and conditions -->
      <q-checkbox
        v-model="acceptTerms"
        label="I agree to the Terms of Service and Privacy Policy"
        :rules="[(val: boolean) => val || 'You must agree to the terms to continue']"
      />

      <div class="q-mt-lg">
        <q-btn
          type="submit"
          color="primary"
          label="Sign Up"
          class="full-width"
          :loading="loading"
        />
      </div>

      <div class="text-center q-mt-md">
        <p>
          Already have an account?
          <router-link to="/login" class="text-primary">Sign In</router-link>
        </p>
      </div>
    </q-form>
  </q-card-section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import authService from 'src/services/auth';

// State variables
const displayName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isPwdVisible = ref(false);
const isConfirmPwdVisible = ref(false);
const acceptTerms = ref(false);
const loading = ref(false);

// Hooks
const router = useRouter();
const $q = useQuasar();

// Validation
const isValidEmail = (val: string) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(val);
};

// Password strength calculation
const passwordStrength = computed(() => {
  if (!password.value) return 0;

  let strength = 0;

  // Length check
  if (password.value.length >= 8) strength += 25;

  // Character type checks
  if (/[A-Z]/.test(password.value)) strength += 25;
  if (/[0-9]/.test(password.value)) strength += 25;
  if (/[^A-Za-z0-9]/.test(password.value)) strength += 25;

  return strength;
});

const strengthClass = computed(() => {
  if (passwordStrength.value < 50) return 'weak';
  if (passwordStrength.value < 100) return 'medium';
  return 'strong';
});

const strengthText = computed(() => {
  if (passwordStrength.value < 50) return 'Weak';
  if (passwordStrength.value < 100) return 'Medium';
  return 'Strong';
});

const strengthTextClass = computed(() => {
  if (passwordStrength.value < 50) return 'text-negative';
  if (passwordStrength.value < 100) return 'text-warning';
  return 'text-positive';
});

// Methods
const onRegister = async () => {
  try {
    loading.value = true;
    await authService.register(email.value, password.value);

    // Update user profile with display name
    // const user = userCredential.user;
    // In a real implementation, we would update the user's display name
    // await updateProfile(user, { displayName: displayName.value });

    $q.notify({
      color: 'positive',
      position: 'top',
      message: 'Account created successfully! You are now logged in.',
      icon: 'check_circle'
    });

    // Redirect to dashboard
    void router.push('/');
  } catch (error: unknown) {
    // Handle error by showing notification
    $q.notify({
      color: 'negative',
      position: 'top',
      message: error instanceof Error ? error.message : 'Failed to create account. Please try again.',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.password-strength {
  margin-top: -10px;
  margin-bottom: 10px;
}

.strength-bar {
  height: 5px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.strength-indicator {
  height: 100%;
  transition: width 0.3s ease;

  &.weak {
    background-color: #f44336; // Red
  }

  &.medium {
    background-color: #ff9800; // Orange
  }

  &.strong {
    background-color: #4caf50; // Green
  }
}
</style>
