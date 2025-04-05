import { defineStore } from 'pinia';
import { db } from 'src/boot/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { ref, computed } from 'vue';

export interface Budget {
  id?: string;
  userId: string;
  month: string; // Format: YYYY-MM
  categories: BudgetCategory[];
  totalBudget: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
  color?: string;
  icon?: string;
}

export const useBudgetStore = defineStore('budget', () => {
  // state
  const budgets = ref<Budget[]>([]);
  const currentBudget = ref<Budget | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // getters
  const getBudgetById = computed(() => {
    return (id: string) => budgets.value.find(budget => budget.id === id) || null;
  });

  const getBudgetByMonth = computed(() => {
    return (month: string) => budgets.value.find(budget => budget.month === month) || null;
  });

  // actions
  async function fetchUserBudgets(userId: string) {
    loading.value = true;
    error.value = null;

    try {
      const budgetsRef = collection(db, 'budgets');
      const q = query(budgetsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      const fetchedBudgets: Budget[] = [];
      querySnapshot.forEach((doc) => {
        fetchedBudgets.push({ id: doc.id, ...doc.data() } as Budget);
      });

      budgets.value = fetchedBudgets;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createBudget(budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true;
    error.value = null;

    try {
      const now = Timestamp.now();
      const budgetData = {
        ...budget,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, 'budgets'), budgetData);
      const newBudget = { id: docRef.id, ...budgetData };

      budgets.value.push(newBudget);
      return newBudget;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateBudget(id: string, updates: Partial<Budget>) {
    loading.value = true;
    error.value = null;

    try {
      const budgetRef = doc(db, 'budgets', id);
      // Only update Firestore with the fields that are provided
      const updatedData = {
        ...updates,
        updatedAt: Timestamp.now()
      };

      await updateDoc(budgetRef, updatedData);

      // Update local state
      const index = budgets.value.findIndex(budget => budget.id === id);
      if (index !== -1) {
        // Create a copy of the existing budget first
        budgets.value[index] = {
          ...budgets.value[index], // This preserves all required fields
          ...updates, // Apply updates
          updatedAt: Timestamp.now() // Update the timestamp
        } as Budget;
      }
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteBudget(id: string) {
    loading.value = true;
    error.value = null;

    try {
      const budgetRef = doc(db, 'budgets', id);
      await deleteDoc(budgetRef);

      // Update local state
      budgets.value = budgets.value.filter(budget => budget.id !== id);
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function setCurrentBudget(budget: Budget | null) {
    currentBudget.value = budget;
  }

  return {
    budgets,
    currentBudget,
    loading,
    error,
    getBudgetById,
    getBudgetByMonth,
    fetchUserBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    setCurrentBudget
  };
});
