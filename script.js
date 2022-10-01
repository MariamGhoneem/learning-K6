import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 10,
    duration: '3s',
};
export default function () {
    var domain = 'https://test.k6.io/';
    let res = http.get(domain,{tags:{name:'Home'}});
    check(res,{
        'status was 200': (r) => r.status == 200,
        'verify page': (r) => r.body.includes('Public pages'),
        'body size is 11,278 bytes': (r) => r.body.length == 11278,
    });
    sleep(1);

    res = http.get(domain + 'flip_coin.php',{
        tags:{name: 'flip'}});
    check(res,{
        'status was 200': (r) => r.status == 200,
        'verify page': (r) => r.body.includes('Your bet'),
    });
    sleep(1);

    const payload = JSON.stringify({
        bet: 'heads',
    });

    const params = {
        tags:{
            name: 'clickheads'
        },
    };
    res = http.post(domain + 'flip_coin.php', payload, params);
    check(res,{
        'status was 200': (r) => r.status == 200,
        'verify page': (r) => r.body.includes('Your bet: heads.'),
    });
}