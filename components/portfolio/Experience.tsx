'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Briefcase } from 'lucide-react';
import type { Experience } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

export default function Experience({ experiences }: { experiences: Experience[] }) {
  const [expanded, setExpanded] = useState<string | null>(experiences[0]?.id ?? null);

  return (
    <div className="min-h-[calc(100vh-56px)] py-14 sm:py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Page header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-10 sm:mb-14"
        >
          <p className="text-xs font-semibold text-[#AF52DE] uppercase tracking-widest mb-3">Experience</p>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#1C1C1E] tracking-tight">Work History</h1>
        </motion.div>

        {/* Timeline */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="relative">
          {/* Vertical line (desktop) */}
          <div className="absolute left-4 sm:left-5 top-4 bottom-4 w-px bg-[#E5E5EA] hidden sm:block" />

          <div className="space-y-4 sm:space-y-5">
            {experiences.map((exp, index) => {
              const isOpen = expanded === exp.id;
              return (
                <motion.div
                  key={exp.id}
                  variants={fadeUp}
                  className="flex gap-4 sm:gap-6"
                >
                  {/* Timeline dot (desktop) */}
                  <div className="hidden sm:flex flex-col items-center flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white"
                      style={{
                        background: index === 0 ? '#AF52DE' : '#F2F2F7',
                        color: index === 0 ? 'white' : '#8E8E93',
                        boxShadow: '0 0 0 3px #F2F2F7',
                      }}
                    >
                      <Briefcase className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 card overflow-hidden">
                    <button
                      className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 hover:bg-[#FAFAFA] transition-colors"
                      onClick={() => setExpanded(isOpen ? null : exp.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-semibold text-[#1C1C1E] text-sm sm:text-base leading-tight">
                            {exp.role}
                          </span>
                          {exp.is_current && (
                            <span
                              className="text-[10px] font-bold rounded-full px-2 py-0.5 flex-shrink-0"
                              style={{ background: 'rgba(52,199,89,0.1)', color: '#1A7A38' }}
                            >
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-[#007AFF]">{exp.company}</p>
                        <p className="text-xs text-[#8E8E93] mt-1">
                          {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-[#C7C7CC] mt-0.5">
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {isOpen && exp.description.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 sm:px-6 pb-5 sm:pb-6 border-t"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <ul className="space-y-2.5 pt-4">
                          {exp.description.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-[#636366] leading-relaxed">
                              <span className="mt-2 w-1 h-1 rounded-full bg-[#AF52DE] flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
