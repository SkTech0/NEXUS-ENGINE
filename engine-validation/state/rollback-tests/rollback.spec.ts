/**
 * Rollback tests — validate rollback/compensation transitions.
 * Does not modify engine logic; uses StateValidator.
 */

import { StateValidator } from '../../src/index';

describe('State / Rollback', () => {
  it('allows rollback transition', () => {
    const validator = new StateValidator();
    validator.allow('completed', 'rolling_back').allow('rolling_back', 'rolled_back');
    const result = validator.validateTransition({ from: 'completed', to: 'rolling_back' });
    expect(result.valid).toBe(true);
    const result2 = validator.validateTransition({ from: 'rolling_back', to: 'rolled_back' });
    expect(result2.valid).toBe(true);
  });

  it('validates rollback path', () => {
    const validator = new StateValidator();
    validator
      .setInitialState('completed')
      .allow('completed', 'rolling_back')
      .allow('rolling_back', 'rolled_back');
    const result = validator.validatePath([
      { from: 'completed', to: 'rolling_back' },
      { from: 'rolling_back', to: 'rolled_back' },
    ]);
    expect(result.valid).toBe(true);
  });
});
