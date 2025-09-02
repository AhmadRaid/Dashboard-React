import { CommonProps } from '@/@types/common';
import { InputHTMLAttributes, ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyValue = any;

export interface RadioGroupProps extends CommonProps {
    color?: string;
    disabled?: boolean;
    name?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange?: (values: AnyValue, e: MouseEvent) => void;
    radioGutter?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: AnyValue;
    vertical?: boolean;
}

export interface RadioProps extends CommonProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    checked?: boolean;
    color?: string;
    defaultChecked?: boolean;
    disabled?: boolean;
    labelRef?: string;
    name?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange?: (value: AnyValue, e: MouseEvent) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: AnyValue;
    vertical?: boolean;
    readOnly?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field?: AnyValue;
}

export type RadioGroupContextProps = {
    vertical?: boolean;
    name?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: AnyValue;
    color?: string;
    disabled?: boolean;
    radioGutter?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange?: (nextValue: AnyValue, e: MouseEvent) => void;
};