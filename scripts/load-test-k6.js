/**
 * k6 load test — Health, Engine, AI infer.
 * Run: k6 run -e BASE_URL=http://localhost:5000 -e DURATION=30 -e VUS=5 scripts/load-test-k6.js
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE = __ENV.BASE_URL || 'http://localhost:5000';
const DURATION = __ENV.DURATION || '30';
const VUS = __ENV.VUS || '5';

export const options = {
  vus: parseInt(VUS, 10),
  duration: `${DURATION}s`,
  thresholds: {
    http_req_failed: ['rate<0.1'],
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {
  let res = http.get(`${BASE}/api/Health`);
  check(res, { 'Health status 200': (r) => r.status === 200 });
  sleep(0.5);

  res = http.get(`${BASE}/api/Engine`);
  check(res, { 'Engine status 200': (r) => r.status === 200 });
  sleep(0.3);

  res = http.post(
    `${BASE}/api/Engine/execute`,
    JSON.stringify({ action: 'load-test', parameters: {} }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(res, { 'Execute status 200': (r) => r.status === 200 });
  sleep(0.2);

  res = http.post(
    `${BASE}/api/AI/infer`,
    JSON.stringify({ modelId: 'default', inputs: { x: 1 } }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(res, { 'AI infer status 200': (r) => r.status === 200 });
  sleep(0.5);
}
