import type { Timestamp } from 'firebase/firestore';

/**
 * Category model for expense and budget categorization
 */
export interface Category {
  id: string;
  userId: string;        // Owner of this category
  name: string;
  color: string;         // Color code (hex)
  icon: string;          // Icon identifier
  isSystem: boolean;     // Whether this is a system-provided category or user-created
  parentId?: string;     // Parent category ID for hierarchical categories
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Predefined system categories for new users
 */
export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Housing',
    color: '#4285F4',
    icon: 'home',
    isSystem: true
  },
  {
    name: 'Transportation',
    color: '#34A853',
    icon: 'directions_car',
    isSystem: true
  },
  {
    name: 'Food',
    color: '#FBBC05',
    icon: 'restaurant',
    isSystem: true
  },
  {
    name: 'Utilities',
    color: '#EA4335',
    icon: 'power',
    isSystem: true
  },
  {
    name: 'Healthcare',
    color: '#9C27B0',
    icon: 'healing',
    isSystem: true
  },
  {
    name: 'Entertainment',
    color: '#FF9800',
    icon: 'movie',
    isSystem: true
  },
  {
    name: 'Personal',
    color: '#795548',
    icon: 'person',
    isSystem: true
  },
  {
    name: 'Education',
    color: '#607D8B',
    icon: 'school',
    isSystem: true
  },
  {
    name: 'Savings',
    color: '#009688',
    icon: 'savings',
    isSystem: true
  },
  {
    name: 'Other',
    color: '#9E9E9E',
    icon: 'more_horiz',
    isSystem: true
  }
];
