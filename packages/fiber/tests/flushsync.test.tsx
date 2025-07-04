import { flushSync } from '../src/core/renderer'

describe('flushSync', () => {
  it('should exist and be callable', () => {
    expect(typeof flushSync).toBe('function')
  })

  it('should execute callback synchronously and return result', () => {
    let called = false
    const result = flushSync(() => {
      called = true
      return 'test-result'
    })

    expect(called).toBe(true)
    expect(result).toBe('test-result')
  })

  it('should handle callbacks that return different types', () => {
    // Test with string
    expect(flushSync(() => 'string')).toBe('string')

    // Test with number
    expect(flushSync(() => 42)).toBe(42)

    // Test with object
    const obj = { test: true }
    expect(flushSync(() => obj)).toBe(obj)

    // Test with undefined
    expect(flushSync(() => undefined)).toBeUndefined()
  })

  it('should propagate errors from the callback', () => {
    expect(() => {
      flushSync(() => {
        throw new Error('test error')
      })
    }).toThrow('test error')
  })

  it('should handle nested calls', () => {
    let outerCalled = false
    let innerCalled = false

    const result = flushSync(() => {
      outerCalled = true
      return flushSync(() => {
        innerCalled = true
        return 'nested-result'
      })
    })

    expect(outerCalled).toBe(true)
    expect(innerCalled).toBe(true)
    expect(result).toBe('nested-result')
  })
})
