import axios from 'axios';
import { addAuthorizationToken } from './tokens';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    responseType: 'json',
});

api.interceptors.request.use(addAuthorizationToken);

export default api;
export * from './responses';
