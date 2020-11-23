import { AxiosRequestConfig, AxiosResponse } from 'axios';
import api from '.';
import { TokenResponse, CreateUserResponse } from './responses';

const accessTokenKey = 'at';
const refreshTokenKey = 'rt';

interface AccessTokenInStorage {
    val: string;
    exp: number;
}

export const getAccessToken = async (): Promise<string | null> => {
    const value = localStorage.getItem(accessTokenKey);

    if (!value)
        return null;

    const token: AccessTokenInStorage = JSON.parse(value);

    if (token.exp > Date.now())
        return token.val;

    const refreshToken = localStorage.getItem(refreshTokenKey);

    if (!refreshTokenKey)
        return null;

    let resp: AxiosResponse<TokenResponse>;
    try {
        resp = await api.get<TokenResponse>(
            '/Authentication/tokenRefresh',
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`
                }
            }
        );
    } catch (e) {
        console.error('Token refresh request failed', e);
        return null;
    }

    const newToken: AccessTokenInStorage = {
        val: resp.data.token,
        exp: +(new Date(resp.data.expiresOn))
    };

    localStorage.setItem(accessTokenKey, JSON.stringify(newToken));

    return newToken.val;
};

export const setTokens = ({ token, refreshToken, expiresOn }: CreateUserResponse) => {
    localStorage.setItem(refreshTokenKey, refreshToken);

    const tokenObj: AccessTokenInStorage = {
        val: token,
        exp: +(new Date(expiresOn))
    };

    localStorage.setItem(accessTokenKey, JSON.stringify(tokenObj));
};

export const addAuthorizationToken = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    if (config.url?.match(/Authentication\//))
        return config;

    const token = await getAccessToken();

    if (token)
        config.headers['Authorization'] = `Bearer ${token}`;

    return config;
};
