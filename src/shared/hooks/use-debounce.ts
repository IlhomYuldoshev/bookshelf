import { useEffect, useRef, useState } from 'react';

export const useDebounce = <T = any>(value: T, delay = 500): T => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const timerRef = useRef<any>(null);

    useEffect(() => {
        timerRef.current = setTimeout(() => setDebouncedValue(value), delay);

        return () => {
            clearTimeout(timerRef.current);
        };
    }, [value, delay]);

    return debouncedValue;
};
