# Monthly Budget Manager - Database Schema

This document describes the Firestore database structure used in the Monthly Budget Manager application.

## Collections Overview

The application uses the following Firestore collections:

- **users**: User profiles and preferences
- **categories**: Budget and expense categories
- **incomes**: Income transactions and recurring income sources
- **expenses**: Expense transactions with optional receipt images
- **budgets**: Monthly budget allocations by category

## Collection Structures

### users

Stores user profile information and application preferences. Document IDs match Firebase Authentication UIDs.

```
users/{userId}
{
  id: string            // Firebase Auth UID
  displayName?: string  // User's name (optional)
  email: string         // User's email address
  photoURL?: string     // URL to user's profile photo (optional)
  settings: {
    currency: string    // Currency code (e.g., "USD")
    locale: string      // Locale code (e.g., "en-US")
    theme: string       // UI theme preference ("light", "dark", or "auto")
    notifications: {
      email: boolean    // Email notification preference
      push: boolean     // Push notification preference
      budgetAlerts: boolean // Budget limit alert preference
    }
  }
  createdAt: timestamp  // Account creation timestamp
  updatedAt: timestamp  // Last profile update timestamp
}
```

### categories

Stores expense and budget categories. System categories are shared across all users, while user-created categories are unique to each user.

```
categories/{categoryId}
{
  id: string            // Auto-generated document ID
  userId: string        // User ID (or "system" for default categories)
  name: string          // Category name
  color: string         // Color hex code
  icon: string          // Material icon name
  isSystem: boolean     // Whether this is a system category
  parentId?: string     // Parent category ID for subcategories (optional)
  createdAt: timestamp  // Category creation timestamp
  updatedAt: timestamp  // Last category update timestamp
}
```

### incomes

Stores income transactions and recurring income sources.

```
incomes/{incomeId}
{
  id: string            // Auto-generated document ID
  userId: string        // User ID
  amount: number        // Income amount
  source: string        // Income source name
  description?: string  // Additional details (optional)
  date: timestamp       // Transaction date
  categoryId?: string   // Category ID (optional)
  isRecurring: boolean  // Whether this is a recurring income
  recurringConfig?: {   // Configuration for recurring incomes (optional)
    frequency: string   // "daily", "weekly", "biweekly", "monthly", "quarterly", "yearly"
    startDate: timestamp // Start date of recurring income
    endDate?: timestamp // End date of recurring income (optional)
  }
  createdAt: timestamp  // Record creation timestamp
  updatedAt: timestamp  // Last record update timestamp
}
```

### expenses

Stores expense transactions with optional receipt images.

```
expenses/{expenseId}
{
  id: string            // Auto-generated document ID
  userId: string        // User ID
  amount: number        // Expense amount
  description: string   // Expense description
  date: timestamp       // Transaction date
  categoryId: string    // Category ID
  paymentMethod?: string // Payment method (optional)
  receiptURL?: string   // URL to receipt image in Firebase Storage (optional)
  location?: string     // Transaction location (optional)
  tags?: string[]       // Custom tags (optional)
  isRecurring: boolean  // Whether this is a recurring expense
  recurringConfig?: {   // Configuration for recurring expenses (optional)
    frequency: string   // "daily", "weekly", "biweekly", "monthly", "quarterly", "yearly"
    startDate: timestamp // Start date of recurring expense
    endDate?: timestamp // End date of recurring expense (optional)
  }
  createdAt: timestamp  // Record creation timestamp
  updatedAt: timestamp  // Last record update timestamp
}
```

### budgets

Stores monthly budget allocations by category.

```
budgets/{budgetId}
{
  id: string            // Auto-generated document ID
  userId: string        // User ID
  month: string         // Budget month in format "YYYY-MM"
  categories: [         // Array of category budget allocations
    {
      id: string        // Category ID
      name: string      // Category name (for convenience)
      amount: number    // Allocated budget amount
      color?: string    // Category color (for convenience)
      icon?: string     // Category icon (for convenience)
    }
  ]
  totalBudget: number   // Total budget amount for the month
  notes?: string        // Budget notes (optional)
  createdAt: timestamp  // Budget creation timestamp
  updatedAt: timestamp  // Last budget update timestamp
}
```

## Security Rules

The application implements the following security rules:

1. **Authentication Required**: All operations require Firebase Authentication.
2. **User Data Isolation**: Users can only access their own data.
3. **Field Validation**: All document creation/updates validate required fields and data types.
4. **System Categories**: System categories are read-only and accessible to all authenticated users.
5. **Data Integrity**: Validates relationships between documents and prevents data inconsistencies.

See the [Firestore Security Rules](../firebase/firestore.rules) file for the complete implementation.

## Indexes

Composite indexes are configured for common query patterns:

1. Listing a user's expenses by date (most recent first)
2. Listing a user's expenses by category and date
3. Listing a user's incomes by date (most recent first)
4. Listing a user's budgets by month (most recent first)
5. Listing a user's categories alphabetically

See the [Firestore Indexes](../firebase/firestore.indexes.json) file for the complete configuration. 