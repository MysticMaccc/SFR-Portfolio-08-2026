'use client';

import { motion } from 'framer-motion';
import { ExternalLink, BookOpen } from 'lucide-react';
import type { Training } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

export default function Trainings({ trainings }: { trainings: Training[] }) {
  const grouped = trainings.reduce<Record<string, Training[]>>((acc, t) => {
    if (!acc[t.provider]) acc[t.provider] = [];
    acc[t.provider].push(t);
    return acc;
  }, {});

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
          <p className="text-xs font-semibold text-[#FF2D55] uppercase tracking-widest mb-3">Training</p>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#1C1C1E] tracking-tight">Certifications</h1>
        </motion.div>

        {/* Groups */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
          {Object.entries(grouped).map(([provider, courses]) => (
            <motion.div key={provider} variants={fadeUp} className="card overflow-hidden">
              {/* Provider header */}
              <div
                className="px-5 sm:px-6 py-3.5 border-b flex items-center gap-2.5"
                style={{ background: '#FAFAFA', borderColor: 'var(--border)' }}
              >
                <div className="w-6 h-6 rounded-lg bg-[#FF2D55]/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-3.5 h-3.5 text-[#FF2D55]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1C1C1E] uppercase tracking-wider">{provider}</p>
                  <p className="text-[10px] text-[#8E8E93]">
                    {courses.length} course{courses.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Courses */}
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {courses.map(t => {
                  const hasUrl = !!t.certificate_url;
                  const Row = hasUrl ? 'a' : 'div';
                  const rowProps = hasUrl
                    ? { href: t.certificate_url!, target: '_blank', rel: 'noopener noreferrer' }
                    : {};

                  return (
                    <Row
                      key={t.id}
                      {...rowProps}
                      className={[
                        'flex items-center justify-between px-5 sm:px-6 py-4 gap-3',
                        hasUrl
                          ? 'hover:bg-[#F2F2F7] transition-colors cursor-pointer group'
                          : '',
                      ].join(' ')}
                    >
                      <div className="min-w-0 flex-1">
                        <p
                          className={[
                            'text-sm leading-snug',
                            hasUrl
                              ? 'text-[#1C1C1E] group-hover:text-[#007AFF] transition-colors font-medium'
                              : 'text-[#1C1C1E]',
                          ].join(' ')}
                        >
                          {t.title}
                        </p>
                        {t.year && (
                          <p className="text-xs text-[#8E8E93] mt-0.5">{t.year}</p>
                        )}
                      </div>

                      {hasUrl && (
                        <div className="flex-shrink-0 flex items-center gap-1.5 text-[#C7C7CC] group-hover:text-[#007AFF] transition-colors">
                          <span className="text-xs font-medium hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">
                            Open
                          </span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </Row>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
