/**
 * Lifecycle tests — validate state lifecycle correctness.
 * Does not modify engine logic; uses StateValidator.
 */

import { StateValidator } from '../../src/index';

describe('State / Lifecycle', () => {
  it('allows valid transition', () => {
    const validator = new StateValidator();
    validator.setInitialState('pending').allow('pending', 'running').allow('running', ['completed', 'failed']);
    const result = validator.validateTransition({ from: 'pending', to: 'running' });
    expect(result.valid).toBe(true);
  });

  it('rejects invalid transition', () => {
    const validator = new StateValidator();
    validator.allow('pending', 'running').allow('running', ['completed', 'failed']);
    const result = validator.validateTransition({ from: 'pending', to: 'failed' });
    expect(result.valid).toBe(false);
  });

  it('validates path from initial state', () => {
    const validator = new StateValidator();
    validator
      .setInitialState('idle')
      .allow('idle', 'running')
      .allow('running', 'completed');
    const result = validator.validatePath([
      { from: 'idle', to: 'running' },
      { from: 'running', to: 'completed' },
    ]);
    expect(result.valid).toBe(true);
  });
});
