import { toast } from 'react-toastify';
import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import set from 'lodash/set';
import { CreateUserResponse, TokenResponse } from './responses';

const accessTokenKey = 'at';
const refreshTokenKey = 'rt';

interface AccessTokenInStorage {
    val: string;
    exp: number;
}

export const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    responseType: 'json',
});

const storage =
    process.env.NODE_ENV !== 'production' ? sessionStorage : localStorage;

export const getAccessToken = async (): Promise<string | null> => {
    const accesTokenString = storage.getItem(accessTokenKey);
    const refreshToken = storage.getItem(refreshTokenKey);

    if (accesTokenString) {
        const token: AccessTokenInStorage = JSON.parse(accesTokenString);

        if (token.exp > Date.now()) {
            return token.val;
        }
    }

    if (!refreshToken) {
        return null;
    }

    let resp: AxiosResponse<TokenResponse>;
    try {
        resp = await api.get<TokenResponse>('/Users/tokenRefresh', {
            headers: { Authorization: `Bearer ${refreshToken}` },
        });
    } catch (e) {
        console.error('Token refresh request failed', e);
        toast.error(`Błąd tokenów: ${(e as AxiosError).message}`);
        return null;
    }

    const newToken: AccessTokenInStorage = {
        val: resp.data.token,
        exp: +new Date(resp.data.expiresOn),
    };

    storage.setItem(accessTokenKey, JSON.stringify(newToken));

    return newToken.val;
};

export const setTokens = ({
    token,
    refreshToken,
    expiresOn,
}: CreateUserResponse) => {
    storage.setItem(refreshTokenKey, refreshToken);

    const tokenObj: AccessTokenInStorage = {
        val: token,
        exp: +new Date(expiresOn),
    };

    storage.setItem(accessTokenKey, JSON.stringify(tokenObj));
};

export const addAuthorizationToken = async (
    config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
    if (config.url?.match(/Users\/token/)) {
        return config;
    }

    const token = await getAccessToken();

    if (token) {
        set(config, 'headers.Authorization', `Bearer ${token}`);
    }

    return config;
};

api.interceptors.request.use(addAuthorizationToken);
