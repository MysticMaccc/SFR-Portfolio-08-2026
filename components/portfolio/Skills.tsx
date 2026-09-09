'use client';

import { motion } from 'framer-motion';
import type { Skill } from '@/types';

const LEVEL_COLOR: Record<string, { bg: string; text: string }> = {
  advanced:     { bg: 'rgba(52,199,89,0.12)',  text: '#1A7A38' },
  intermediate: { bg: 'rgba(0,122,255,0.08)',  text: '#005EC4' },
  beginner:     { bg: 'rgba(255,149,0,0.1)',   text: '#7A4800' },
};

const CATEGORY_ACCENTS = [
  '#007AFF', '#FF9500', '#AF52DE', '#34C759',
  '#FF2D55', '#5AC8FA', '#FF6B35', '#FFCC00',
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

export default function Skills({ skills }: { skills: Skill[] }) {
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const categories = Object.entries(grouped);

  return (
    <div className="min-h-[calc(100vh-56px)] py-14 sm:py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-10 sm:mb-14"
        >
          <p className="text-xs font-semibold text-[#FF9500] uppercase tracking-widest mb-3">Skills</p>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#1C1C1E] tracking-tight">Technical Skills</h1>
        </motion.div>

        {/* Category grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {categories.map(([category, items], index) => {
            const accent = CATEGORY_ACCENTS[index % CATEGORY_ACCENTS.length];
            return (
              <motion.div
                key={category}
                variants={fadeUp}
                className="card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderLeft: `3px solid ${accent}` }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-3"
                  style={{ color: accent }}
                >
                  {category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {items.map(skill => {
                    const style = LEVEL_COLOR[skill.level] ?? LEVEL_COLOR.intermediate;
                    return (
                      <span
                        key={skill.id}
                        className="skill-pill"
                        style={{ background: style.bg, color: style.text }}
                      >
                        {skill.name}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Legend */}
        {skills.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 sm:gap-6 mt-10 pt-6 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            <p className="text-xs text-[#8E8E93] font-medium">Proficiency:</p>
            {Object.entries(LEVEL_COLOR).map(([level, style]) => (
              <span key={level} className="flex items-center gap-1.5 text-xs" style={{ color: style.text }}>
                <span className="w-2 h-2 rounded-sm" style={{ background: style.bg, border: `1px solid ${style.text}30` }} />
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
