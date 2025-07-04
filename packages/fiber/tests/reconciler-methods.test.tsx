import { reconciler } from '../src/core/reconciler'

describe('reconciler methods', () => {
  it('should log available methods on reconciler', () => {
    console.log('Reconciler methods:', Object.getOwnPropertyNames(reconciler))
    console.log('Reconciler prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(reconciler)))
    console.log('Has flushSync:', 'flushSync' in reconciler)
    console.log('flushSync type:', typeof reconciler.flushSync)
    console.log('Has flushSyncFromReconciler:', 'flushSyncFromReconciler' in reconciler)
    console.log('Has flushSyncWork:', 'flushSyncWork' in reconciler)
  })

  it('should test if flushSync exists', () => {
    // Test if flushSync is defined according to TypeScript
    console.log('reconciler.flushSync:', reconciler.flushSync)
    expect(reconciler.flushSync).toBeDefined()
  })
})
