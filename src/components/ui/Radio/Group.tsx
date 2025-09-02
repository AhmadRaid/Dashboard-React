/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useState, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { RadioGroupContextProvider } from './context';
import { RadioGroupProps } from './types';

const Group = forwardRef<HTMLDivElement, RadioGroupProps>((props, ref) => {
    const {
        color,
        disabled,
        name,
        onChange,
        radioGutter = 3,
        value: valueProp,
        vertical = false,
        className,
        ...rest
    } = props;

    const [value, setValue] = useState(valueProp);

    const onRadioGroupChange = useCallback(
        (nextValue: any, e: MouseEvent) => {
            setValue(nextValue);
            onChange?.(nextValue, e);
        },
        [onChange, setValue]
    );

    const contextValue = useMemo(
        () => ({
            vertical,
            name,
            value: typeof value === 'undefined' ? null : value,
            color,
            disabled,
            radioGutter,
            onChange: onRadioGroupChange,
        }),
        [disabled, onRadioGroupChange, vertical, name, color, radioGutter, value]
    );

    const radioGroupClass = classNames('radio-group', vertical && 'vertical', className);

    return (
        <RadioGroupContextProvider value={contextValue}>
            <div ref={ref} className={radioGroupClass} {...rest}>
                {props.children}
            </div>
        </RadioGroupContextProvider>
    );
});

Group.displayName = 'RadioGroup';

export default Group;