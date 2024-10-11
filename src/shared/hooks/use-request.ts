import { showToast } from '@/services/toast-service';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';


export type QueryStatus = 'idle' | 'error' | 'success' | 'loading';

export interface useRequestOptions<T, Data> {
    // NOTE: notifyErrorEnabled is just the initial value; further changes to it are not reflected in the user interface.
    notifyErrorEnabled?: boolean;
    enabled?: boolean;
    dependencies?: any[];
    onSuccess?: (data: T) => void;
    selectData?: (response: T) => Data;
    placeholderData?: Data;
}

/**
 * This hook allows you to work with requests efficiently
 * @param {promise} queryFn - initial value for useState
 */
export default function useRequest<T, Data = T>(
    queryFn: (signal: AbortSignal) => Promise<T>,
    _options?: useRequestOptions<T, Data>
) {
    const [status, setStatus] = useState<QueryStatus>('idle');
    const [data, setData] = useState<Data | null>(_options?.placeholderData ?? null);
    const [error, setError] = useState<unknown>();
    const [loading, setLoading] = useState(_options?.enabled ?? true);
    const abortControllerRef = useRef<AbortController | null>(null);

    const notifyError = (err: unknown) => {
        showToast({
            message: err,
            type: 'error',
        });
    };

    const options: Required<useRequestOptions<T, Data>> = useMemo(() => {
        return {
            enabled: _options?.enabled ?? true,
            notifyErrorEnabled: _options?.notifyErrorEnabled ?? true,
            dependencies: _options?.dependencies || [],
            onSuccess: _options?.onSuccess ?? (() => {}),
            // @ts-expect-error
            selectData: _options?.selectData ?? ((data) => data as Data),
            placeholderData: data!,
        };
    }, [_options]);

    const queryFnRef = useRef({
        query: queryFn,
        onSuccess: options.onSuccess,
        selectData: options.selectData,
    });

    queryFnRef.current.query = queryFn;
    queryFnRef.current.onSuccess = options.onSuccess;
    queryFnRef.current.selectData = options.selectData;

    const handleError = (signal: AbortSignal) => (error: unknown) => {
        if (signal.aborted) return;

        setError(error);
        setStatus('error');
        setLoading(false);
        if (options.notifyErrorEnabled) {
            notifyError(error);
        }
    };

    const runQuery = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;

        const handleSuccess = (res: T) => {
            queryFnRef.current.onSuccess(res);
            setData(queryFnRef.current.selectData(res));
            setStatus('success');
            setLoading(false);
        };

        setStatus('loading');
        setLoading(true);

        queryFnRef.current.query(signal).then(handleSuccess).catch(handleError(signal));
    }, []);

    const optimisticUpdate = useCallback((newData: T) => {
        setData(queryFnRef.current.selectData(newData));
    }, []);

    const optimisticUpdateSelectedData = useCallback((newData: Data) => {
        setData(newData);
    }, []);

    useEffect(() => {
        if (options.enabled) {
            runQuery();
        }

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [...options.dependencies]);

    return {
        data,
        loading,
        error,
        status,
        refetch: runQuery,
        optimisticUpdate,
        optimisticUpdateSelectedData,
    };
}
