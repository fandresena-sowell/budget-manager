import { config } from '@vue/test-utils'
import { afterEach, vi } from 'vitest'
import { Quasar, type QuasarPluginOptions } from 'quasar'
import * as components from 'quasar'
import * as directives from 'quasar'

// Mock Quasar components and directives
config.global.plugins.push([Quasar, {
  components,
  directives
} as QuasarPluginOptions])

// Mock window location/navigation
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost/',
    pathname: '/',
    search: '',
    hash: '',
    replace: vi.fn(),
    assign: vi.fn()
  },
  writable: true
})

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})

// Clean up function that runs after each test
afterEach(() => {
  vi.restoreAllMocks()
  localStorageMock.clear()
})
