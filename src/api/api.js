import axios from 'axios';

const api = axios.create({
    baseURL: 'https://a0c761cdabb5748b.mokky.dev',
    withCredentials: true,
})

export default api;