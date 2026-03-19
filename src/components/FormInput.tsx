import React, { useState, useEffect } from 'react';
import Input, { InputProps } from './Input';

export interface FormInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ value = '', onChange, onBlur, ...rest }, ref) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      onChange?.(newValue);
    };

    return (
      <Input
        ref={ref}
        {...rest}
        value={localValue}
        onChange={handleChange}
        onBlur={onBlur}
      />
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
