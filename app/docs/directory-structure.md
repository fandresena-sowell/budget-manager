# Monthly Budget Manager - Directory Structure

This document outlines the directory structure of the Monthly Budget Manager application, explaining the purpose and organization of each directory.

## Root Structure

- `src/` - Main application code
- `public/` - Static files served as-is
- `tests/` - Test files mirroring the src structure

## Source Directory Structure

### Components

All reusable UI components are organized by feature area:

- `src/components/dashboard/` - Dashboard-specific components
- `src/components/budget/` - Budget management components
- `src/components/expenses/` - Expense tracking components
- `src/components/income/` - Income tracking components
- `src/components/reports/` - Reporting and visualization components
- `src/components/settings/` - User settings components

### Pages

Page components for each main section of the application:

- `src/pages/` - Contains a page component for each route

### Layouts

Layout components that define the overall structure of different sections:

- `src/layouts/MainLayout.vue` - Primary layout for authenticated users
- `src/layouts/AuthLayout.vue` - Layout for authentication pages

### State Management

Pinia stores for state management:

- `src/stores/` - Contains store modules for each feature area

### Firebase Service Wrappers

Wrappers around Firebase services:

- `src/services/` - Service classes for authentication, database, and storage operations

### Business Logic

Shared logic and composables:

- `src/composables/` - Reusable composition functions for shared logic

### Data Models

Type definitions and interfaces:

- `src/models/` - TypeScript interfaces and types for application data

### Utility Functions

Helper functions used across the application:

- `src/utils/` - Utility functions for formatting, validation, date handling, etc.

### Styles

Global styles and theming:

- `src/css/` - Global CSS/SCSS files and variables

### Application Initialization

Boot files for initializing services:

- `src/boot/` - Initialization code for Firebase, authentication, etc.

### Routing

Application routing configuration:

- `src/router/` - Vue Router configuration with route guards

## Test Directory Structure

- `tests/unit/` - Unit tests for individual components and functions
- `tests/integration/` - Integration tests for feature workflows

## Naming Conventions

- Component files: PascalCase.vue
- Composable files: camelCase.ts prefixed with "use"
- Store files: kebab-case-store.ts
- Utility files: camelCase.ts
- Model files: PascalCase.ts

## Import Strategy

The application uses index files for simplified imports:
- Each directory has an index.ts file that exports all contents
- This allows for cleaner imports in consuming files 