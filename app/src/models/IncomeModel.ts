import type { Timestamp } from 'firebase/firestore';

/**
 * Income model for tracking income sources and transactions
 */
export interface Income {
  id: string;
  userId: string;           // Owner of this income
  amount: number;
  source: string;           // Income source name
  description?: string;
  date: Timestamp;          // Date of income transaction
  categoryId?: string;      // Optional category for income
  isRecurring: boolean;     // Whether this is a recurring income
  recurringConfig?: {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
    startDate: Timestamp;
    endDate?: Timestamp;    // Optional end date for recurring income
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
