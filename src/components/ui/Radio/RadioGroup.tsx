import {
  useMemo,
  useCallback,
} from 'react';
import classNames from 'classnames';
import { RadioGroupProps } from './types';

const RadioGroup = (props: RadioGroupProps) => {
  const {
    className,
    value,
    onChange,
    disabled,
    readOnly,
    vertical,
    name,
    children,
  } = props;

  const radioGroupDefaultProps = useMemo(() => ({
    value,
    onChange,
    disabled,
    readOnly,
    name,
  }), [value, onChange, disabled, readOnly, name]);

  const onRadioGroupChange = useCallback((val) => {
    onChange?.(val);
  }, [onChange]);

  return (
    <RadioContext.Provider
      value={{
        ...radioGroupDefaultProps,
        onChange: onRadioGroupChange,
      }}
    >
      <div
        className={classNames(
          'radio-group',
          vertical && 'radio-group-vertical',
          className
        )}
      >
        {children}
      </div>
    </RadioContext.Provider>
  );
};

export default RadioGroup;