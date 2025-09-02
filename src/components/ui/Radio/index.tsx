import _Radio from './Radio';
import Group from './Group';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import { RadioGroupProps, RadioProps } from './types';

export type { RadioProps, RadioGroupProps };

type CompoundedComponent = ForwardRefExoticComponent<RadioProps & RefAttributes<HTMLHtmlElement>> & {
    Group: typeof Group;
};

const Radio = _Radio as CompoundedComponent;

Radio.Group = Group;

export default Radio;