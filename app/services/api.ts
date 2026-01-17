import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Verificar si estamos en el cliente
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta (ej. 401)
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            // Si el token expiró o es inválido, limpiar y redirigir (opcional)
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // window.location.href = '/login'; // Descomentar si deseamos redirección forzada
            }
        }
        return Promise.reject(error);
    }
);

export default api;
