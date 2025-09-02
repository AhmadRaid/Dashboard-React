/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    forwardRef,
    useState,
    useMemo,
    useContext,
    useCallback,
    useEffect,
} from 'react';
import classNames from 'classnames';
import RadioGroupContext from './context';
import { RadioProps } from './types';

// Mock useConfig for demonstration, replace with your actual hook
const useConfig = () => ({
    themeColor: 'blue',
    primaryColorLevel: '600',
});

const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
    const {
        name: nameContext,
        disabled: disabledContext,
        value: groupValue,
        onChange: onGroupChange,
        color: colorContext,
        vertical: verticalContext,
        radioGutter,
    } = useContext(RadioGroupContext);

    const {
        children,
        className,
        checked: checkedProp,
        color,
        defaultChecked,
        disabled = disabledContext,
        field,
        labelRef,
        name = nameContext,
        onChange,
        readOnly,
        value,
        vertical = verticalContext,
        ...rest
    } = props;

    const { themeColor, primaryColorLevel } = useConfig();

    const getChecked = () => {
        return typeof groupValue !== 'undefined' ? groupValue === value : checkedProp;
    };

    const [radioChecked, setRadioChecked] = useState(getChecked());

    const radioColor = color || colorContext || `${themeColor}-${primaryColorLevel}`;

    const controlProps = useMemo(() => {
        if (typeof groupValue !== 'undefined') {
            return { checked: radioChecked };
        }
        return { checked: checkedProp, defaultChecked };
    }, [radioChecked, checkedProp, defaultChecked, groupValue]);

    const onRadioChange = useCallback(
        (e: any) => {
            if (disabled || readOnly) {
                return;
            }
            onGroupChange?.(value, e);
            onChange?.(value, e);
        },
        [disabled, setRadioChecked, onChange, value, onGroupChange, groupValue, readOnly]
    );

    useEffect(() => {
        const propChecked = getChecked();
        if (radioChecked !== propChecked) {
            setRadioChecked(propChecked);
        }
    }, [value, checkedProp, groupValue, radioChecked]);

    const radioDefaultClass = `radio text-${radioColor}`;
    const radioColorClass = disabled && 'disabled';
    const labelDisabledClass = disabled && 'disabled';

    const radioClass = classNames(radioDefaultClass, radioColorClass);
    const labelClass = classNames(
        'radio-label',
        labelDisabledClass,
        className,
        'inline-flex',
        `${radioGutter ? 'm' + (vertical ? 'b-' : 'r-') + radioGutter : ''}`
    );

    return (
        <label ref={labelRef} className={labelClass}>
            <input
                ref={ref}
                type="radio"
                className={radioClass}
                disabled={disabled}
                value={value}
                name={name}
                readOnly={readOnly}
                onChange={onRadioChange}
                {...controlProps}
                {...field}
                {...rest}
            />
            {children ? (
                <span className={classNames('ltr:ml-2 rtl:mr-2', disabled ? 'opacity-50' : '')}>
                    {children}
                </span>
            ) : null}
        </label>
    );
});

Radio.displayName = 'Radio';

export default Radio;