import { AxiosError } from 'axios';
import { toast, TypeOptions } from 'react-toastify';

export type PromiseToastType = {
    type: 'promise';
    promise: Promise<any>;
    pendingMessage: string | { render(): React.ReactNode };
    errorMessage: string | { render(data?: { data?: unknown }): React.ReactNode };
    successMessage?: string | { render(data?: { data?: unknown }): React.ReactNode };
};

export function showToast(
    params:
        | {
              //
              message: unknown;
              type: TypeOptions;
          }
        | PromiseToastType
) {
    if (params.type === 'promise') {
        showPromiseToast(params);
        return;
    }

    let msg = 'Something went wrong!';

    console.log('params.message', params.message);

    try {
        if (typeof params.message === 'string') {
            msg = params.message;
        } else if (
            params.message instanceof AxiosError &&
            typeof params.message.response?.data?.reason === 'string'
        ) {
            msg = params.message.response?.data?.reason;
        } else if (params.message instanceof AxiosError && params.message.message) {
            msg =
                (typeof params.message.response?.data?.message
                    ? params.message.response?.data?.message
                    : null) ??
                params.message.message ??
                'Something went wrong';
        } else if (params.message instanceof Error) {
            msg = params.message.message;
        }
    } catch (error) {
        console.log('Error on trying to get error message from unknown value: ', error);
    }

    toast(msg, {
        type: params.type,
    });
}

function showPromiseToast(params: PromiseToastType) {
    toast.promise(params.promise, {
        pending: params.pendingMessage,
        error: params.errorMessage,
        ...(params.successMessage ? { success: params.successMessage } : {}),
    });
}
