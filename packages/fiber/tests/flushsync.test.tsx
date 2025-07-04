import * as React from 'react'
import * as THREE from 'three'
import { createCanvas } from '@react-three/test-renderer/src/createTestCanvas'
import { flushSync } from '../src/core/renderer'
import { createRoot, act, extend, ReconcilerRoot } from '../src/index'

extend(THREE as any)

describe('flushSync', () => {
  let root: ReconcilerRoot<HTMLCanvasElement> = null!

  beforeEach(() => {
    const canvas = createCanvas()
    root = createRoot(canvas)
  })

  afterEach(async () => {
    if (root) {
      await act(async () => root.unmount())
    }
  })
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

  it('should work with React component state updates', async () => {
    let currentFoo: number = 0
    let setFooRef: React.Dispatch<React.SetStateAction<number>> | null = null

    function Foo() {
      const [foo, setFoo] = React.useState(0)
      currentFoo = foo
      setFooRef = setFoo

      return <group userData={{ foo }} />
    }

    // Render initial component
    await act(async () => {
      root.render(<Foo />)
    })

    expect(currentFoo).toBe(0)
    expect(setFooRef).not.toBeNull()

    // Test flushSync with state update
    await act(async () => {
      flushSync(() => {
        setFooRef!(1)
      })
    })

    expect(currentFoo).toBe(1)

    // Test that flushSync returns value correctly even with state updates
    let result: string = ''
    await act(async () => {
      result = flushSync(() => {
        setFooRef!(42)
        return 'state-updated'
      })
    })

    expect(currentFoo).toBe(42)
    expect(result).toBe('state-updated')
  })
})
