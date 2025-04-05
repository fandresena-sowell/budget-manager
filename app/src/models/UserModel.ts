import type { Timestamp } from 'firebase/firestore';

/**
 * User profile model that extends Firebase Authentication data
 */
export interface User {
  id: string;            // matches Firebase Auth UID
  displayName?: string;
  email: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  settings: UserSettings;
}

/**
 * User preferences and application settings
 */
export interface UserSettings {
  currency: string;      // Default: 'USD'
  locale: string;        // Default: 'en-US'
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;      // Whether to send email notifications
    push: boolean;       // Whether to send push notifications
    budgetAlerts: boolean; // Whether to alert when approaching budget limits
  };
}
