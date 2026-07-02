import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const PLACE_VALUES = [128, 64, 32, 16, 8, 4, 2, 1] as const;

function toBinaryString(bits: boolean[]): string {
  return bits.map((b) => (b ? '1' : '0')).join('');
}

function toDecimal(bits: boolean[]): number {
  return bits.reduce((acc, bit, i) => acc + (bit ? PLACE_VALUES[i] : 0), 0);
}

export function BinaryNumberVisualizer() {
  const [bits, setBits] = useState<boolean[]>(Array(8).fill(false));

  function toggleBit(index: number) {
    setBits((prev) => prev.map((b, i) => (i === index ? !b : b)));
  }

  const decimal = toDecimal(bits);
  const binaryStr = toBinaryString(bits);

  return (
    <div className="flex flex-col items-center gap-6 p-4 select-none">
      {/* Place value labels */}
      <div className="flex gap-2 sm:gap-3">
        {PLACE_VALUES.map((val, i) => (
          <div key={i} className="flex flex-col items-center gap-1 w-9 sm:w-12">
            <span className="text-[10px] sm:text-xs text-text-muted font-mono">{val}</span>
          </div>
        ))}
      </div>

      {/* Bit toggles */}
      <div className="flex gap-2 sm:gap-3">
        {bits.map((on, i) => (
          <motion.button
            key={i}
            onClick={() => toggleBit(i)}
            whileTap={{ scale: 0.88 }}
            aria-label={`Bit ${7 - i}, place value ${PLACE_VALUES[i]}, currently ${on ? '1' : '0'}`}
            className={`
              relative w-9 h-9 sm:w-12 sm:h-12 rounded-btn font-mono font-bold text-lg sm:text-xl
              border-2 transition-colors duration-150 cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-accent-orange focus:ring-offset-1 focus:ring-offset-bg-primary
              ${on
                ? 'bg-accent-orange border-accent-orange text-bg-primary shadow-[0_0_12px_rgba(245,166,35,0.5)]'
                : 'bg-bg-panel border-border-subtle text-text-muted hover:border-accent-orange/50 hover:text-text-secondary'
              }
            `}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={on ? 'on' : 'off'}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="block"
              >
                {on ? '1' : '0'}
              </motion.span>
            </AnimatePresence>

            {/* glow dot when on */}
            {on && (
              <motion.span
                layoutId={`dot-${i}`}
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent-orange"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Active place value chips */}
      <div className="flex flex-wrap justify-center gap-1.5 min-h-[28px]">
        <AnimatePresence>
          {bits.map((on, i) =>
            on ? (
              <motion.span
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="px-2 py-0.5 rounded-full bg-accent-orange/20 text-accent-orange text-xs font-mono font-semibold border border-accent-orange/30"
              >
                {PLACE_VALUES[i]}
              </motion.span>
            ) : null,
          )}
        </AnimatePresence>
      </div>

      {/* Result display */}
      <div className="w-full max-w-xs rounded-card bg-bg-code border border-border-subtle p-4 flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="text-text-muted text-xs uppercase tracking-wider">Binary</span>
          <span className="font-mono text-accent-blue text-base sm:text-lg tracking-widest">{binaryStr}</span>
        </div>
        <div className="h-px bg-border-subtle" />
        <div className="flex items-baseline justify-between">
          <span className="text-text-muted text-xs uppercase tracking-wider">Decimal</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={decimal}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="font-mono text-accent-green text-2xl sm:text-3xl font-bold tabular-nums"
            >
              {decimal}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <p className="text-text-muted text-xs text-center">Tap any bit to toggle it on/off</p>
    </div>
  );
}

export default BinaryNumberVisualizer;
