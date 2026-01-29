/**
 * Recovery tests — validate recovery transitions (failed → recovered, etc.).
 * Does not modify engine logic; uses StateValidator.
 */

import { StateValidator } from '../../src/index';

describe('State / Recovery', () => {
  it('allows recovery transition', () => {
    const validator = new StateValidator();
    validator
      .allow('failed', 'recovering')
      .allow('recovering', ['recovered', 'degraded']);
    const result = validator.validateTransition({ from: 'failed', to: 'recovering' });
    expect(result.valid).toBe(true);
    const result2 = validator.validateTransition({ from: 'recovering', to: 'recovered' });
    expect(result2.valid).toBe(true);
  });

  it('validates recovery path', () => {
    const validator = new StateValidator();
    validator
      .setInitialState('failed')
      .allow('failed', 'recovering')
      .allow('recovering', 'recovered');
    const result = validator.validatePath([
      { from: 'failed', to: 'recovering' },
      { from: 'recovering', to: 'recovered' },
    ]);
    expect(result.valid).toBe(true);
  });
});
