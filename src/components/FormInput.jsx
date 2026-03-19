/**
 * FormInput - Controlled input with local display state.
 * Calls onChange on every keystroke (no debounce inside the component).
 * Storage writes are debounced inside formStore — not here.
 * No unmount flush: onBlur already syncs immediately on focus loss.
 */
import React, { useState, useEffect } from 'react';
import Input from './Input';

const FormInput = React.forwardRef(({ value = '', onChange, onBlur, ...rest }, ref) => {
  const [localValue, setLocalValue] = useState(value);

  // Sync if external value changes (e.g., form reset, language switch)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
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
});

FormInput.displayName = 'FormInput';
export default FormInput;
