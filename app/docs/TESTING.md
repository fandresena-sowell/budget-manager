# Testing Environment with Vitest

This document outlines the testing setup for the Monthly Budget Manager application using Vitest.

## Overview

The project uses Vitest as the primary testing framework, providing:
- Fast test execution with native ESM support
- Vue Test Utils integration for component testing
- Code coverage reporting
- TypeScript support
- Hot module reloading during development

## Test Directory Structure

Tests are organized to mirror the source code structure:

- `tests/unit/` - Unit tests for individual components and functions
  - `tests/unit/components/` - Tests for Vue components
  - `tests/unit/stores/` - Tests for Pinia stores
  - `tests/unit/services/` - Tests for service modules
  - `tests/unit/utils/` - Tests for utility functions

- `tests/integration/` - Integration tests for feature workflows
  - `tests/integration/auth/` - Authentication flow tests
  - `tests/integration/budget/` - Budget management tests
  - `tests/integration/expenses/` - Expense tracking tests

## Test File Naming Convention

- Unit tests: `[filename].spec.ts`
- Component tests: `[ComponentName].spec.ts`
- Integration tests: `[feature]-flow.spec.ts`

## Configuration

Vitest is configured in the `vitest.config.ts` file with the following settings:
- Environment setup for Vue components
- Coverage reporting configuration
- Alias mapping that matches the main application
- Global test setup and teardown

## Available Commands

Run all tests:
```bash
npm run test
```

Run tests in watch mode during development:
```bash
npm run test:watch
```

Generate test coverage report:
```bash
npm run test:coverage
```

Run specific test file or directory:
```bash
npm run test -- [path-to-test-file]
```

## Writing Tests

### Component Testing

Example of a component test using Vue Test Utils:

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from 'src/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.text()).toContain('expected text')
  })

  it('emits an event when button is clicked', async () => {
    const wrapper = mount(MyComponent)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('my-event')).toBeTruthy()
  })
})
```

### Store Testing

Example of testing a Pinia store:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMyStore } from 'src/stores/my-store'

describe('My Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default state', () => {
    const store = useMyStore()
    expect(store.count).toBe(0)
  })

  it('increments the counter', () => {
    const store = useMyStore()
    store.increment()
    expect(store.count).toBe(1)
  })
})
```

## Mocking

The testing environment includes utilities for mocking:
- Firebase services
- API responses
- Browser APIs
- Vue components

## Continuous Integration

Tests are automatically run as part of the CI pipeline on each push to ensure code quality and prevent regressions. 