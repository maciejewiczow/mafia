import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';

export const useCountdown = (to: string | number | Date | dayjs.Dayjs = new Date()) => {
    const [remaining, setRemaining] = useState<number>(dayjs(to).diff(new Date(), 'millisecond'));
    const intervalRef = useRef<number>();

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setRemaining(dayjs(to).diff(new Date(), 'millisecond'));
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [to]);

    useEffect(() => {
        if (remaining <= 0)
            clearInterval(intervalRef.current);
    }, [remaining]);

    return Math.max(remaining, 0);
};
