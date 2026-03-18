/**
 * FormInput - Syncs to parent on both change and blur
 * Calls onChange immediately so parent state (and validation) stays in sync
 */
import React, { useState, useEffect, useRef } from 'react';
import Input from './Input';

const FormInput = React.memo(({ value = '', onChange, ...rest }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = (e) => {
    const v = e.target.value;
    setLocalValue(v);
    const syntheticEvent = { ...e, target: { ...e.target, value: v } };
    onChange?.(syntheticEvent);
  };

  const handleBlur = (e) => {
    rest.onBlur?.(e);
  };

  const { onBlur: _ob, ...inputRest } = rest;
  return (
    <Input
      {...inputRest}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
