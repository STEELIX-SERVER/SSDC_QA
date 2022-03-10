import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

export const requests = new Counter('http_reqs');

  export const options = {
    vus: 100,
    duration: '15s',

  //   stages: [
  //     { target: 20, duration: '1m' },
  //     { target: 15, duration: '1m' },
  //     { target: 0, duration: '1m' },
  //   ],
  //   thresholds: {
  //     requests: ['count < 100'],
  //   },
  };

  export default function () {

    const res = http.get('http://localhost:3000/api/qa/questions/1/answers');

    sleep(1);

    const checkRes = check(res, {
      'status is 200': (r) => r.status === 200,
      'transaction time < 200ms': (r) => r.timings.duration < 200,
      'transaction time < 500ms': (r) => r.timings.duration < 500,
      'transaction time < 1000ms': (r) => r.timings.duration < 1000,
      'transaction time < 2000ms': (r) => r.timings.duration < 2000
    });
  }

// run in terminam to test for 30 seconds wit h30 virtual users
// k6 run -d 30s -u 30 ./script.js



