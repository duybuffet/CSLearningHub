import { useState } from 'react';

const PLACE_VALUES = [128, 64, 32, 16, 8, 4, 2, 1] as const;

export function BinaryNumberVisualizer() {
  const [bits, setBits] = useState<boolean[]>(Array(8).fill(false));

  const toggleBit = (index: number) => setBits((prev) => prev.map((b, i) => (i === index ? !b : b)));
  const decimal = bits.reduce((acc, bit, i) => acc + (bit ? PLACE_VALUES[i] : 0), 0);
  const terms = PLACE_VALUES.filter((_, i) => bits[i]);

  return (
    <div className="flex select-none flex-col gap-5 font-sans">
      {/* Place values above their bit; each bit toggles */}
      <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
        {bits.map((on, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span className="font-mono text-[11px] tabular-nums text-text-muted sm:text-xs">{PLACE_VALUES[i]}</span>
            <button
              onClick={() => toggleBit(i)}
              aria-label={`Bit ${7 - i}, place value ${PLACE_VALUES[i]}, currently ${on ? 1 : 0}. Toggle`}
              aria-pressed={on}
              className={`aspect-square w-full max-w-12 rounded-btn border font-mono text-lg transition-colors duration-150 sm:text-xl ${
                on ? 'border-text-primary bg-text-primary text-bg-primary' : 'border-border-subtle bg-bg-card text-text-muted hover:border-accent'
              }`}
            >
              {on ? 1 : 0}
            </button>
          </div>
        ))}
      </div>

      {/* The sum spelled out: which place values add up to the number */}
      <div className="border-t border-border-subtle pt-4" aria-live="polite">
        <p className="font-mono text-[15px] text-text-secondary">
          {terms.length ? terms.join(' + ') : 'Tap a bit to turn it on'}
          {terms.length > 1 && <span className="text-text-muted"> =</span>}
        </p>
        <p className="mt-1 font-serif text-[40px] leading-none tabular-nums text-text-primary">{decimal}</p>
        <p className="mt-2 font-mono text-sm text-text-muted">
          0b{bits.map((b) => (b ? '1' : '0')).join('')}, 0x{decimal.toString(16).toUpperCase().padStart(2, '0')}
        </p>
      </div>

    </div>
  );
}

export default BinaryNumberVisualizer;
