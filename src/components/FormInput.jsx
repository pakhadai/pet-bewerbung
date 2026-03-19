/**
 * FormInput - Debounced sync to parent to avoid re-rendering entire wizard on every keystroke.
 * Updates parent state on blur (immediate) and on change (debounced 300ms).
 * When field prop is set, registers for beforeunload flush to prevent data loss on quick close.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Input from './Input';
import { pendingFormValues, FLUSH_EVENT } from '../utils/formInputFlush';

const DEBOUNCE_MS = 300;

const FormInput = React.memo(({ value = '', onChange, field, ...rest }) => {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef(null);
  const lastSentRef = useRef(value);
  const localValueRef = useRef(localValue);
  localValueRef.current = localValue;

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
        onChange(v);
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

  // Flush pending debounced value on unmount (prevents data loss when user clicks "Next" before debounce fires)
  useEffect(() => () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
      flushToParent(localValueRef.current);
    }
  }, [flushToParent]);

  // Register for beforeunload flush (prevents data loss when user closes tab before debounce)
  useEffect(() => {
    if (!field) return;
    const handler = () => {
      pendingFormValues[field] = localValueRef.current;
    };
    window.addEventListener(FLUSH_EVENT, handler);
    return () => window.removeEventListener(FLUSH_EVENT, handler);
  }, [field]);

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
