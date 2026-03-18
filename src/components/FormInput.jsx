/**
 * FormInput - Reduces re-renders by syncing to parent only on blur
 * Accepts onChange (event) for compatibility with Input, syncs value on blur
 */
import React, { useState, useEffect, useRef } from 'react';
import Input from './Input';

const FormInput = React.memo(({ value = '', onChange, ...rest }) => {
  const [localValue, setLocalValue] = useState(value);
  const lastSyncedRef = useRef(value);

  useEffect(() => {
    if (value !== lastSyncedRef.current) {
      setLocalValue(value);
      lastSyncedRef.current = value;
    }
  }, [value]);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = (e) => {
    if (localValue !== lastSyncedRef.current) {
      lastSyncedRef.current = localValue;
      const syntheticEvent = { ...e, target: { ...e.target, value: localValue } };
      onChange?.(syntheticEvent);
    }
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
