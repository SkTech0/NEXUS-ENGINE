/**
 * Transition tests — validate state transition rules.
 * Does not modify engine logic; uses StateValidator.
 */

import { StateValidator } from '../../src/index';

describe('State / Transition', () => {
  it('rule with event', () => {
    const validator = new StateValidator();
    validator.addRule({ from: 'a', allowed: ['b'], event: 'go' });
    const result = validator.validateTransition({ from: 'a', to: 'b', event: 'go' });
    expect(result.valid).toBe(true);
  });

  it('multiple allowed targets', () => {
    const validator = new StateValidator();
    validator.allow('running', ['completed', 'failed', 'cancelled']);
    expect(validator.validateTransition({ from: 'running', to: 'completed' }).valid).toBe(true);
    expect(validator.validateTransition({ from: 'running', to: 'failed' }).valid).toBe(true);
    expect(validator.validateTransition({ from: 'running', to: 'unknown' }).valid).toBe(false);
  });
});
