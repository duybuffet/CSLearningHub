import { useState } from 'react';

type GateType = 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND';

const GATES: GateType[] = ['AND', 'OR', 'NOT', 'XOR', 'NAND'];

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
  return [0, 1].flatMap((a) => [0, 1].map((b) => ({ a, b, out: computeOutput(gate, a, b) })));
}

const GATE_DESCRIPTION: Record<GateType, string> = {
  AND:  'Output is 1 only when both inputs are 1.',
  OR:   'Output is 1 when at least one input is 1.',
  NOT:  'Output is the inverse of the input.',
  XOR:  'Output is 1 when the inputs differ.',
  NAND: 'Output is 0 only when both inputs are 1.',
};

// A bit cell: ink-filled when 1, outlined when 0.
function BitCell({ value, label, onClick }: { value: number; label: string; onClick?: () => void }) {
  const on = value === 1;
  const cls = `flex h-12 w-12 items-center justify-center rounded-btn border font-mono text-xl transition-colors duration-150 ${
    on ? 'border-text-primary bg-text-primary text-bg-primary' : 'border-border-subtle bg-bg-card text-text-muted'
  }`;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="font-sans text-xs text-text-muted">{label}</span>
      {onClick ? (
        <button onClick={onClick} aria-label={`Input ${label}, currently ${value}. Toggle`} className={`${cls} hover:border-accent`}>
          {value}
        </button>
      ) : (
        <div className={cls} aria-live="polite" aria-label={`Output ${value}`}>
          {value}
        </div>
      )}
    </div>
  );
}

export function LogicGateVisualizer() {
  const [gate, setGate] = useState<GateType>('AND');
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(0);

  const output = computeOutput(gate, inputA, inputB);
  const table = buildTruthTable(gate);
  const isSingleInput = gate === 'NOT';

  return (
    <div className="flex select-none flex-col gap-5 font-sans">
      <div role="group" aria-label="Gate" className="flex flex-wrap gap-1 rounded-btn bg-bg-panel p-0.5 self-start">
        {GATES.map((g) => (
          <button
            key={g}
            aria-pressed={gate === g}
            onClick={() => setGate(g)}
            className={`rounded-[5px] px-3 py-1.5 font-mono text-[13px] ${
              gate === g ? 'bg-bg-card text-text-primary shadow-[0_1px_2px_rgb(0_0_0/0.08)]' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <p className="text-[15px] text-text-secondary">{GATE_DESCRIPTION[gate]}</p>

      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-3">
          <BitCell label="A" value={inputA} onClick={() => setInputA((v) => 1 - v)} />
          {!isSingleInput && <BitCell label="B" value={inputB} onClick={() => setInputB((v) => 1 - v)} />}
        </div>
        <svg width="28" height="12" viewBox="0 0 28 12" className="mt-5 shrink-0 text-text-muted" aria-hidden="true">
          <path d="M0 6h24m-5-5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <div className="mt-5 flex h-14 w-20 items-center justify-center rounded-card border-2 border-accent font-mono text-[17px] text-accent">
          {gate}
        </div>
        <svg width="28" height="12" viewBox="0 0 28 12" className="mt-5 shrink-0 text-text-muted" aria-hidden="true">
          <path d="M0 6h24m-5-5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <BitCell label="Out" value={output} />
      </div>

      <table className="w-full max-w-xs border-collapse text-center font-mono text-sm">
        <thead>
          <tr className="border-b-2 border-text-primary/70 text-text-primary">
            <th className="py-1.5 font-medium">A</th>
            {!isSingleInput && <th className="py-1.5 font-medium">B</th>}
            <th className="py-1.5 font-medium">Out</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row, i) => {
            const isActive = isSingleInput ? row.a === inputA : row.a === inputA && row.b === inputB;
            return (
              <tr key={i} className={`border-b border-border-subtle ${isActive ? 'bg-marker/40 text-text-primary' : 'text-text-secondary'}`}>
                <td className="py-1.5">{row.a}</td>
                {!isSingleInput && <td className="py-1.5">{row.b}</td>}
                <td className="py-1.5">{row.out}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="text-sm text-text-muted">Tap A or B to flip an input. The highlighted row is the current case.</p>
    </div>
  );
}

export default LogicGateVisualizer;
