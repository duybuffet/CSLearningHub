import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuizQuestion } from '@/types/content-schema-types';

interface QuizQuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  total: number;
  onAnswered: (correct: boolean) => void;
}

export function QuizQuestionCard({
  question,
  questionNumber,
  total,
  onAnswered,
}: QuizQuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  function handleSelect(idx: number) {
    if (answered) return;
    setSelected(idx);
  }

  function getOptionStyle(idx: number): string {
    const base =
      'w-full text-left px-4 py-3 rounded-btn border text-sm leading-relaxed transition-colors duration-150 ';
    if (!answered) {
      return base + 'border-border-subtle bg-bg-panel text-text-primary hover:border-accent-blue hover:bg-bg-code cursor-pointer';
    }
    if (idx === question.correct) {
      return base + 'border-accent-green bg-accent-green/10 text-accent-green cursor-default';
    }
    if (idx === selected) {
      return base + 'border-red-500 bg-red-500/10 text-red-400 cursor-default';
    }
    return base + 'border-border-subtle bg-bg-panel text-text-muted cursor-default opacity-50';
  }

  function getOptionLabel(idx: number): string {
    if (!answered) return '';
    if (idx === question.correct) return ' ✓';
    if (idx === selected) return ' ✗';
    return '';
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4"
    >
      <p className="text-xs text-text-muted font-mono">
        Question {questionNumber} / {total}
      </p>

      <p className="text-text-primary text-base font-medium leading-relaxed">
        {question.question}
      </p>

      <div className="flex flex-col gap-2">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            className={getOptionStyle(idx)}
            onClick={() => handleSelect(idx)}
            disabled={answered}
          >
            <span className="font-mono text-text-muted mr-2 text-xs">
              {String.fromCharCode(65 + idx)}.
            </span>
            {opt}
            {getOptionLabel(idx)}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-btn border border-accent-blue/30 bg-accent-blue/10 px-4 py-3 text-sm text-text-secondary"
          >
            <span className="font-semibold text-accent-blue">Explanation: </span>
            {question.explanation}
          </motion.div>
        )}
      </AnimatePresence>

      {answered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end"
        >
          <button
            onClick={() => onAnswered(selected === question.correct)}
            className="px-5 py-2.5 rounded-btn bg-accent-orange text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Next →
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
