import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CurrencyInput({ value, onChange, placeholder = '0', disabled, className }: CurrencyInputProps) {
  const [focused, setFocused] = useState(false);
  const [raw, setRaw] = useState('');

  const fmt = (n: number) => n === 0 ? '' : n.toLocaleString('fr-FR');

  const handleFocus = useCallback(() => {
    setFocused(true);
    setRaw(value ? value.toString() : '');
  }, [value]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    const cleaned = raw.replace(/\s/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed) && parsed >= 0) onChange(Math.round(parsed));
    else if (raw === '') onChange(0);
  }, [raw, onChange]);

  return (
    <div className="relative">
      <Input
        type="text"
        inputMode="numeric"
        value={focused ? raw : fmt(value)}
        onChange={e => setRaw(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`pr-10 text-right font-mono text-sm ${className || ''}`}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs pointer-events-none">€</span>
    </div>
  );
}
