import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
    withCredentials: true, // <--- Esto equivale a credentials: 'include'
    withXSRFToken: true // <--- Esto le dice a Axios que maneje el token CSRF de Laravel
});

export default api;