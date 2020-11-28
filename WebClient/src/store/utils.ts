import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Action, ActionCreator } from 'redux';

export type PickAction<A extends Action<string>, T extends A['type']> = Extract<A, { type: T }>

// FIXME: fix action creator arguments typing to not be any
export type TypedActionCreator<A extends Action<string>, T extends A['type']> = ActionCreator<PickAction<A, T>>;

export interface RequestAction<ActionT = string, RequestT = undefined> extends Action<ActionT> {
    isRequestAction: true;
    payload: {
        request: Omit<AxiosRequestConfig, 'data'> & { data?: RequestT };
    };
}

export interface ResponseSuccessAction<ActionT = string, ResponseT = undefined> extends Action<ActionT> {
    payload: AxiosResponse<ResponseT>;
}

export interface ResponseFailedAction<ActionT = string, ResponseT = undefined> extends Action<ActionT> {
    error: AxiosError<ResponseT>;
}

export type RequestActionBundle<
    RequestActionT = string,
    SuccessActionT = string,
    FailedActionT = string,
    RequestT = undefined,
    ResponseT = undefined
> = (
    RequestAction<RequestActionT, RequestT> |
    ResponseSuccessAction<SuccessActionT, ResponseT> |
    ResponseFailedAction<FailedActionT, ResponseT>
)

export const objectHasOwnProperty = (object: unknown, propName: string | number | symbol) => (
    ({}).hasOwnProperty.call(object, propName)
);

export type AsyncRetT<T> = T extends ((...args: any[]) => Promise<infer R>) ? R : never;
