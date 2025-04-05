import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed } from 'vue';

export const useCounterStore = defineStore('counter', () => {
  // state
  const counter = ref(0);

  // getters
  const doubleCount = computed(() => counter.value * 2);

  // actions
  function increment() {
    counter.value++;
  }

  return {
    counter,
    doubleCount,
    increment
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot));
}
