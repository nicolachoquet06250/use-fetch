import { useFetch2, useFetch3 } from 'useFetch';

useFetch2<
    '/api/authentication-token', 
    'post',
    'application/json'
>({
    url: '/api/authentication-token',
    method: 'post',
    headers: {
        Accept: 'application/json',
        "Content-Type": 'application/json'
    },
    body: {
        login: 'tralala',
        password: 'toto'
    }
});

useFetch3<
    '/api/authentication-token', 
    'post',
    'application/json'
>('/api/authentication-token', {
    method: 'post',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
    body: {
        login: 'sfsdfg',
        password: 'asdcsdsdfv'
    }
});