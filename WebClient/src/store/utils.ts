import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Action } from 'redux';

export type PickAction<A extends Action<string>, T extends A['type']> = Extract<A, { type: T }>;

export interface RequestAction<ActionT extends string = string, RequestT = undefined> extends Action<ActionT> {
    isRequestAction: true;
    payload: {
        request: Omit<AxiosRequestConfig, 'data'> & { data?: RequestT };
    };
}

export interface ResponseSuccessAction<ActionT extends string = string, ResponseT = undefined> extends Action<ActionT> {
    payload: AxiosResponse<ResponseT>;
}

export interface ResponseFailedAction<ActionT extends string = string, ResponseT = undefined> extends Action<ActionT> {
    error: AxiosError<ResponseT>;
}

export type RequestActionBundle<
    RequestActionT extends string = string,
    SuccessActionT extends string = string,
    FailedActionT extends string = string,
    RequestT = undefined,
    ResponseT = undefined,
> = (
        RequestAction<RequestActionT, RequestT> |
        ResponseSuccessAction<SuccessActionT, ResponseT> |
        ResponseFailedAction<FailedActionT, ResponseT>
    );

export type InvokeActionBundle<
    InvokeActionT extends string,
    SuccessActionT extends string,
    FailedActionT extends string,
    P extends (unknown[] | undefined) = undefined,
    RetT = undefined,
> = (
        InvokeAction<InvokeActionT, P, SuccessActionT, FailedActionT> |
        InvokeActionSuccess<SuccessActionT, RetT> |
        InvokeActionError<FailedActionT>
    );

export interface InvokeAction<
    TAction extends string,
    P extends (unknown[] | undefined) = undefined,
    TActionSuccess extends (string | undefined) = undefined,
    TActionError extends (string | undefined) = undefined,
> {
    type: TAction;
    successActionType: TActionSuccess;
    errorActionType: TActionError;
    isInvokeAction: true;
    methodName: string;
    args?: P;
}

export interface InvokeActionSuccess<T extends string, TRet = undefined> {
    type: T;
    result: TRet;
}

export interface InvokeActionError<T extends string> {
    type: T;
    error: Error;
}

export const objectHasOwnProperty = (object: unknown, propName: string | number | symbol) => (
    ({}).hasOwnProperty.call(object, propName)
);

export type AsyncRetT<T> = T extends ((...args: unknown[]) => Promise<infer R>) ? R : never;
