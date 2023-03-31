import { useFetch } from 'useFetch';

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