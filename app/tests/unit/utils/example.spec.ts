import { describe, it, expect } from 'vitest'

/**
 * This is a simple example of a unit test using Vitest.
 * This file demonstrates basic test structure and assertions.
 */

// Function to test
function sum(a: number, b: number): number {
  return a + b
}

// Test suite
describe('Example utility functions', () => {
  // Individual test case
  it('adds two numbers correctly', () => {
    // Arrange
    const a = 1
    const b = 2
    const expected = 3

    // Act
    const result = sum(a, b)

    // Assert
    expect(result).toBe(expected)
  })

  // Another test case
  it('handles negative numbers', () => {
    expect(sum(-1, -2)).toBe(-3)
  })

  // Test with multiple assertions
  it('returns the correct type', () => {
    const result = sum(1, 2)
    expect(typeof result).toBe('number')
    expect(Number.isInteger(result)).toBe(true)
  })
})
