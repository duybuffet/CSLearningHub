import type { ComponentType } from 'react';
import { BinaryNumberVisualizer } from './binary-number-visualizer';
import { LogicGateVisualizer } from './logic-gate-visualizer';

const registry: Record<string, ComponentType> = {
  'binary': BinaryNumberVisualizer,
  'logic-gate': LogicGateVisualizer,
};

export function getVisualizer(name: string): ComponentType | undefined {
  return registry[name];
}
