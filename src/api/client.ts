import { API_URL } from '@/constants/global-config';
import { auth_service } from '@/services/auth-service';
import axios, { AxiosRequestHeaders } from 'axios';

const axios_instance = axios.create({
    baseURL: API_URL,
});

axios_instance.interceptors.request.use(async (config) => {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve(1);
        }, 1000);
    });

    if (!['/signup'].some((path) => config.url?.includes(path))) {
        if (!config.headers) {
            config.headers = {} as AxiosRequestHeaders;
        }

        const method = config.method?.toUpperCase() ?? 'GET';
        const body = config.data ?? '';
        const url = config.url ?? '';

        const { key, sign } = auth_service.prepareSign(method, body, url);

        config.headers['Key'] = key;
        config.headers['Sign'] = sign;
    }
    return config;
});

export { axios_instance as client_v1 };
