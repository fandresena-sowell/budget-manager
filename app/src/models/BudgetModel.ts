import type { Timestamp } from 'firebase/firestore';

/**
 * Budget category allocation model
 */
export interface BudgetCategory {
  id: string;       // Matches a category ID from the categories collection
  name: string;     // For convenience, store the category name
  amount: number;   // Allocated budget amount
  color?: string;   // For convenience, store the category color
  icon?: string;    // For convenience, store the category icon
}

/**
 * Budget model for monthly financial planning
 */
export interface Budget {
  id: string;
  userId: string;           // Owner of this budget
  month: string;            // Format: YYYY-MM
  categories: BudgetCategory[];
  totalBudget: number;      // Total budget amount across all categories
  notes?: string;           // Optional notes about this month's budget
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
