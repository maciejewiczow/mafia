import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { produce, Draft } from 'immer';
import { Action } from 'redux';

export type PickAction<A extends Action<string>, T extends A['type']> = Extract<A, { type: T }>

export interface RequestAction<ActionT = string, RequestT = unknown> extends Action<ActionT> {
    payload: {
        request: Omit<AxiosRequestConfig, 'data'> & { data?: RequestT };
    };
}

export interface ResponseSuccessAction<ActionT = string, ResponseT = unknown> extends Action<ActionT> {
    payload: AxiosResponse<ResponseT>;
}

export interface ResponseFailedAction<ActionT = string, ResponseT = unknown> extends Action<ActionT> {
    error: AxiosError<ResponseT>;
}

export type RequestActionBundle<
    RequestActionT = string,
    SuccessActionT = string,
    FailedActionT = string,
    RequestT = unknown,
    ResponseT = unknown
> = (
    RequestAction<RequestActionT, RequestT> |
    ResponseSuccessAction<SuccessActionT, ResponseT> |
    ResponseFailedAction<FailedActionT, ResponseT>
)
