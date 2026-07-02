import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

type GateType = 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND';

interface TruthRow {
  a: number;
  b: number | null;
  out: number;
}

function computeOutput(gate: GateType, a: number, b: number): number {
  switch (gate) {
    case 'AND':  return a & b;
    case 'OR':   return a | b;
    case 'NOT':  return a === 1 ? 0 : 1;
    case 'XOR':  return a ^ b;
    case 'NAND': return (a & b) === 1 ? 0 : 1;
  }
}

function buildTruthTable(gate: GateType): TruthRow[] {
  if (gate === 'NOT') {
    return [
      { a: 0, b: null, out: 1 },
      { a: 1, b: null, out: 0 },
    ];
  }
  return [
    { a: 0, b: 0, out: computeOutput(gate, 0, 0) },
    { a: 0, b: 1, out: computeOutput(gate, 0, 1) },
    { a: 1, b: 0, out: computeOutput(gate, 1, 0) },
    { a: 1, b: 1, out: computeOutput(gate, 1, 1) },
  ];
}

const GATE_COLOR: Record<GateType, string> = {
  AND:  'accent-blue',
  OR:   'accent-green',
  NOT:  'accent-purple',
  XOR:  'accent-orange',
  NAND: 'accent-orange',
};

const GATE_DESCRIPTION: Record<GateType, string> = {
  AND:  'Output is 1 only when BOTH inputs are 1',
  OR:   'Output is 1 when AT LEAST ONE input is 1',
  NOT:  'Output is the INVERSE of the input',
  XOR:  'Output is 1 when inputs are DIFFERENT',
  NAND: 'Output is 0 only when BOTH inputs are 1',
};

function InputSwitch({ label, value, onChange }: { label: string; value: number; onChange: () => void }) {
  const on = value === 1;
  return (
    <button
      onClick={onChange}
      aria-label={`Input ${label}, currently ${value}`}
      className={`
        flex flex-col items-center gap-1.5 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-accent-orange focus:ring-offset-1 focus:ring-offset-bg-primary rounded-btn
      `}
    >
      <span className="text-text-muted text-xs font-mono font-semibold">{label}</span>
      <motion.div
        animate={{ backgroundColor: on ? 'var(--accent-green)' : 'var(--bg-panel)' }}
        transition={{ duration: 0.15 }}
        className={`
          w-12 h-12 sm:w-14 sm:h-14 rounded-btn border-2 font-mono font-bold text-xl
          flex items-center justify-center transition-shadow
          ${on
            ? 'border-accent-green text-bg-primary shadow-[0_0_12px_rgba(74,222,128,0.45)]'
            : 'border-border-subtle text-text-muted hover:border-accent-green/50'
          }
        `}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.3, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </button>
  );
}

export function LogicGateVisualizer() {
  const [gate, setGate] = useState<GateType>('AND');
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(0);

  const output = computeOutput(gate, inputA, inputB);
  const table = buildTruthTable(gate);
  const isSingleInput = gate === 'NOT';
  const accentClass = `text-${GATE_COLOR[gate]}`;

  return (
    <div className="flex flex-col gap-5 p-4 select-none">
      {/* Gate selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {(['AND', 'OR', 'NOT', 'XOR', 'NAND'] as GateType[]).map((g) => (
          <button
            key={g}
            onClick={() => setGate(g)}
            className={`
              px-3 py-1.5 rounded-btn text-sm font-mono font-semibold border transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-accent-orange
              ${gate === g
                ? `border-${GATE_COLOR[g]} text-${GATE_COLOR[g]} bg-${GATE_COLOR[g]}/10`
                : 'border-border-subtle text-text-muted hover:border-border-subtle/60 hover:text-text-secondary'
              }
            `}
          >
            {g}
          </button>
        ))}
      </div>

      <p className="text-center text-text-secondary text-xs">{GATE_DESCRIPTION[gate]}</p>

      {/* IO diagram */}
      <div className="flex items-center justify-center gap-4 sm:gap-6">
        {/* Inputs */}
        <div className={`flex flex-col gap-4 ${isSingleInput ? 'justify-center' : ''}`}>
          <InputSwitch label="A" value={inputA} onChange={() => setInputA((v) => 1 - v)} />
          {!isSingleInput && (
            <InputSwitch label="B" value={inputB} onChange={() => setInputB((v) => 1 - v)} />
          )}
        </div>

        {/* Gate symbol */}
        <div className={`
          flex flex-col items-center justify-center
          w-20 h-16 sm:w-24 sm:h-20 rounded-card border-2 font-mono font-bold text-lg sm:text-xl
          transition-all duration-200
          border-${GATE_COLOR[gate]} ${accentClass}
          bg-${GATE_COLOR[gate]}/10
          shadow-[0_0_16px_var(--${GATE_COLOR[gate]}-glow,rgba(96,165,250,0.25))]
        `}>
          {gate}
        </div>

        {/* Arrow + output */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-text-muted text-[10px] font-mono">OUT</span>
          <motion.div
            key={`${gate}-${inputA}-${inputB}`}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={`
              w-12 h-12 sm:w-14 sm:h-14 rounded-btn border-2 font-mono font-bold text-xl
              flex items-center justify-center transition-all duration-200
              ${output === 1
                ? 'border-accent-green text-accent-green bg-accent-green/10 shadow-[0_0_14px_rgba(74,222,128,0.4)]'
                : 'border-border-subtle text-text-muted bg-bg-panel'
              }
            `}
          >
            {output}
          </motion.div>
        </div>
      </div>

      {/* Truth table */}
      <div className="rounded-card bg-bg-code border border-border-subtle overflow-hidden">
        <table className="w-full text-center text-sm font-mono">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="py-2 px-3 text-text-muted font-semibold">A</th>
              {!isSingleInput && <th className="py-2 px-3 text-text-muted font-semibold">B</th>}
              <th className={`py-2 px-3 font-semibold ${accentClass}`}>OUT</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row, i) => {
              const isActive = isSingleInput
                ? row.a === inputA
                : row.a === inputA && row.b === inputB;
              return (
                <motion.tr
                  key={i}
                  animate={{ backgroundColor: isActive ? 'rgba(255,255,255,0.06)' : 'transparent' }}
                  transition={{ duration: 0.2 }}
                  className="border-b border-border-subtle last:border-0"
                >
                  <td className={`py-2 px-3 ${isActive ? 'text-text-primary font-bold' : 'text-text-secondary'}`}>
                    {row.a}
                  </td>
                  {!isSingleInput && (
                    <td className={`py-2 px-3 ${isActive ? 'text-text-primary font-bold' : 'text-text-secondary'}`}>
                      {row.b}
                    </td>
                  )}
                  <td className={`py-2 px-3 font-bold ${isActive ? accentClass : 'text-text-muted'}`}>
                    {row.out}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-text-muted text-xs text-center">Tap A or B to toggle inputs</p>
    </div>
  );
}

export default LogicGateVisualizer;
