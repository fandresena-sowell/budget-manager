import type { Timestamp } from 'firebase/firestore';

/**
 * Expense model for tracking spending transactions
 */
export interface Expense {
  id: string;
  userId: string;           // Owner of this expense
  amount: number;
  description: string;
  date: Timestamp;          // Date of expense transaction
  categoryId: string;       // Category for expense classification
  paymentMethod?: string;   // Method of payment (cash, credit card, etc.)
  receiptURL?: string;      // URL to uploaded receipt in Firebase Storage
  location?: string;        // Optional location where expense occurred
  tags?: string[];          // Optional tags for additional organization
  isRecurring: boolean;     // Whether this is a recurring expense
  recurringConfig?: {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
    startDate: Timestamp;
    endDate?: Timestamp;    // Optional end date for recurring expense
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
