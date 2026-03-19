/**
 * FormInput - Debounced sync to parent to avoid re-rendering entire wizard on every keystroke.
 * Updates parent state on blur (immediate) and on change (debounced 300ms).
 */
import React, { useState, useEffect, useRef } from 'react';
import Input from './Input';

const DEBOUNCE_MS = 300;

const FormInput = React.forwardRef(({ value = '', onChange, ...rest }, ref) => {
  const [localValue, setLocalValue] = useState(value);
  const lastSentRef = useRef(value);
  const localValueRef = useRef(localValue);
  localValueRef.current = localValue;

  useEffect(() => {
    if (value !== localValue && value !== lastSentRef.current) {
      setLocalValue(value);
      lastSentRef.current = value;
    }
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== lastSentRef.current && onChange) {
        lastSentRef.current = localValue;
        onChange(localValue);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(handler);
  }, [localValue, onChange]);

  const handleChange = (e) => setLocalValue(e.target.value);

  const handleBlur = (e) => {
    if (localValue !== lastSentRef.current && onChange) {
      lastSentRef.current = localValue;
      onChange(localValue);
    }
    rest.onBlur?.(e);
  };

  // Flush pending value on unmount (prevents data loss when user clicks "Next" before debounce)
  useEffect(() => () => {
    const v = localValueRef.current;
    if (v !== lastSentRef.current && onChange) {
      lastSentRef.current = v;
      onChange(v);
    }
  }, [onChange]);

  return (
    <Input
      ref={ref}
      {...rest}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
});

FormInput.displayName = 'FormInput';
export default FormInput;
