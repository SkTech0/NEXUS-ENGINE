/**
 * Calibration tests — validate confidence calibration (confidence in [0,1], consistency).
 * Does not modify engine logic; uses InvariantEngine.
 */

import { InvariantEngine } from '../../src';

describe('AI / Calibration', () => {
  it('confidence in [0,1]', () => {
    const inv = new InvariantEngine<{ confidence: number }>();
    inv.add({
      name: 'confidenceRange',
      check: (s) => s.confidence >= 0 && s.confidence <= 1,
    });
    expect(inv.validate({ confidence: 0.5 }).valid).toBe(true);
    expect(inv.validate({ confidence: 1.2 }).valid).toBe(false);
  });

  it('prediction_confidence field when present', () => {
    const inv = new InvariantEngine<{ prediction_confidence?: number }>();
    inv.add({
      name: 'predictionConfidenceRange',
      check: (s) =>
        s.prediction_confidence === undefined ||
        (s.prediction_confidence >= 0 && s.prediction_confidence <= 1),
    });
    expect(inv.validate({ prediction_confidence: 0.9 }).valid).toBe(true);
  });
});
