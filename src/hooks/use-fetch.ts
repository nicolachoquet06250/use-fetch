import { useFetch, useFetch2 } from 'useFetch';

useFetch('/api/collaborateurs/{id}', 'get', {
    Accept: 'application/json'
}, {
    id: 'toto'
}).then(({ code, response }) => {
    
});

useFetch<
    '/api/agents',
    'get',
    'application/json'
>('/api/agents', 'get', {
    Accept: 'application/json'
}, {
    "order[nom]": 'asc',
    "email[]": [],
    email: '',
    "order[prenom]": 'desc',
    nom: ''
}).then(({ accept, response }) => {
    if (accept === 'application/json') {
        response
    }
})

useFetch<
    '/api/authentication-token',
    'post',
    'application/json'
>(
    '/api/authentication-token', 
    'post', 
    {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
)

useFetch2({
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