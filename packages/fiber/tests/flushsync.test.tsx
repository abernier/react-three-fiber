import { flushSync } from '../src/core/renderer'

describe('flushSync', () => {
  it('should exist and be callable', () => {
    expect(typeof flushSync).toBe('function')

    // Test that flushSync can be called with a callback
    let called = false
    const result = flushSync(() => {
      called = true
      return 'test-result'
    })

    expect(called).toBe(true)
    expect(result).toBe('test-result')
  })
})
