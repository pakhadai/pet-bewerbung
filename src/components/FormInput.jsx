/**
 * FormInput - Debounced sync to parent to avoid re-rendering entire wizard on every keystroke.
 * Updates parent state on blur (immediate) and on change (debounced 300ms).
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Input from './Input';

const DEBOUNCE_MS = 300;

const FormInput = React.memo(({ value = '', onChange, ...rest }) => {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef(null);
  const lastSentRef = useRef(value);

  useEffect(() => {
    if (value !== localValue && value !== lastSentRef.current) {
      setLocalValue(value);
      lastSentRef.current = value;
    }
  }, [value]);

  const flushToParent = useCallback(
    (v) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      if (v !== lastSentRef.current && onChange) {
        lastSentRef.current = v;
        const syntheticEvent = {
          target: { value: v },
          preventDefault: () => {},
          stopPropagation: () => {},
        };
        onChange(syntheticEvent);
      }
    },
    [onChange]
  );

  const handleChange = (e) => {
    const v = e.target.value;
    setLocalValue(v);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => flushToParent(v), DEBOUNCE_MS);
  };

  const handleBlur = (e) => {
    flushToParent(localValue);
    rest.onBlur?.(e);
  };

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

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
