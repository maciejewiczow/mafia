import React from 'react';
import { act } from 'react-dom/test-utils';
import FakeTimers from '@sinonjs/fake-timers';
import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import { useCountdown } from './useCountdown';

const testId = 'idididi';

const FakeComponent: React.FC<{
    to?: string | number | Date | dayjs.Dayjs;
}> = ({ to }) => {
    const countdown = useCountdown(to);

    return <span data-testid={testId}>{countdown}</span>;
};

describe('useCountdown', () => {
    let clock: FakeTimers.InstalledClock;

    beforeEach(() => {
        clock = FakeTimers.install({ now: new Date() });
    });

    afterEach(() => {
        clock.uninstall();
    });

    it('returns 0s when no argument is passed', () => {
        render(<FakeComponent />);

        const component = screen.getByTestId(testId);

        expect(component).toHaveTextContent(/^0$/);
    });

    it('refreshes every second, counting down to 0', () => {
        render(<FakeComponent to={dayjs().add(10, 'second')} />);

        const component = screen.getByTestId(testId);

        expect(component).toHaveTextContent(/^10000$/);

        act(() => {
            clock.tick(3000);
        });

        expect(component).toHaveTextContent(/^7000$/);

        act(() => {
            clock.tick(7000);
        });

        expect(component).toHaveTextContent(/^0$/);
    });

    it('does not count past zero', () => {
        render(<FakeComponent to={dayjs().add(1, 'second')} />);

        const component = screen.getByTestId(testId);

        expect(component).toHaveTextContent(/^1000$/);

        act(() => {
            clock.tick(1000);
        });

        expect(component).toHaveTextContent(/^0$/);

        act(() => {
            clock.tick(7000);
        });

        expect(component).toHaveTextContent(/^0$/);
    });

    it('returns 0 when given a date in the past', () => {
        render(<FakeComponent to={dayjs().add(-3, 'second')} />);

        const component = screen.getByTestId(testId);

        expect(component).toHaveTextContent(/^0$/);
    });
});
