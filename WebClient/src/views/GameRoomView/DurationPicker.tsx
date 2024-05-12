import React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import dayjs from 'dayjs';

export interface DurationPickerProps {
    className?: string;
    onChange?: (duration: string) => void;
    value?: string;
}

export const DurationPicker: React.FC<DurationPickerProps> = ({
    value,
    onChange,
}) => {
    const matches = value?.match(/(\d{2}):(\d{2}):(\d{2})/);

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(
            dayjs()
                .set('hour', 0)
                .set('minute', e.target.valueAsNumber)
                .set(
                    'second',
                    +((matches && matches.length > 3 && matches[3]) || 0),
                )
                .format('HH:mm:ss'),
        );
    };

    const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(
            dayjs()
                .set('hour', 0)
                .set(
                    'minute',
                    +((matches && matches.length > 2 && matches[2]) || 0),
                )
                .set('second', e.target.valueAsNumber)
                .format('HH:mm:ss'),
        );
    };

    return (
        <InputGroup>
            <Form.Control
                type="number"
                min="0"
                max="59"
                step="1"
                value={
                    (matches && matches.length > 2 && matches[2]) || undefined
                }
                onChange={handleMinutesChange}
            />
            <InputGroup.Text>min</InputGroup.Text>
            <Form.Control
                type="number"
                min="0"
                max="59"
                step="1"
                value={
                    (matches && matches.length > 3 && matches[3]) || undefined
                }
                onChange={handleSecondsChange}
            />
            <InputGroup.Text>sec</InputGroup.Text>
        </InputGroup>
    );
};
