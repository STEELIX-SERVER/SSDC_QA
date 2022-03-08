import http from 'k6/http';
import { check, sleep } from 'k6';
// import { Counter } from 'k6/metrics';

// export const requests = new Counter('http_reqs');

//   export const options = {
//     stages: [
//       { target: 20, duration: '1m' },
//       { target: 15, duration: '1m' },
//       { target: 0, duration: '1m' },
//     ],
//     thresholds: {
//       requests: ['count < 100'],
//     },
//   };

  export default function () {

    const url = 'http://localhost:3000/api/qa/questions/1/answers';
    const payload = JSON.stringify({
      body: "postgres answer add test",
      name: "R_tester",
      email: "post@gres.com"
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };



    const res = http.post(url, payload, params);

    sleep(1);

    const checkRes = check(res, {
      'status is 200': (r) => r.status === 200
      // 'response body': (r) => r.body.indexOf('Feel free to browse') !== -1,
    });
  }

// run in terminam to test for 30 seconds with 30 virtual users
// k6 run -d 30s -u 30 ./script.js



