'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { defaultPortfolioData } from '@/lib/defaultData';
import Navigation from '@/components/portfolio/Navigation';
import Footer from '@/components/portfolio/Footer';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FileText, Download, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Profile } from '@/types';

const ResumeDownloadButton = dynamic(
  () => import('@/components/resume/ResumeDownloadButton'),
  { ssr: false, loading: () => (
    <span className="ios-btn-primary opacity-50 cursor-not-allowed">
      <Download className="w-4 h-4" /> Loading…
    </span>
  )}
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94], delay: d } }),
};

const SECTIONS = [
  { label: 'About',      href: '/about' },
  { label: 'Skills',     href: '/skills' },
  { label: 'Experience', href: '/experience' },
  { label: 'Projects',   href: '/projects' },
  { label: 'Training',   href: '/training' },
];

export default function ResumePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase.from('profiles').select('*').single().then(({ data }) => {
      setProfile(data ?? defaultPortfolioData.profile);
    });
  }, []);

  const displayProfile = profile ?? defaultPortfolioData.profile;

  return (
    <>
      <Navigation profile={displayProfile} />
      <main className="pt-14 min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

          {/* Page header */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-10 sm:mb-14">
            <p className="text-xs font-semibold text-[#007AFF] uppercase tracking-widest mb-3">Resume</p>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#1C1C1E] tracking-tight">Curriculum Vitae</h1>
          </motion.div>

          {/* Profile card */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.1} className="card p-6 sm:p-7 mb-6">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{ background: 'var(--ios-blue)' }}
              >
                {(displayProfile?.name ?? 'SR').split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <p className="text-lg font-bold text-[#1C1C1E] leading-tight">{displayProfile?.name}</p>
                <p className="text-[#007AFF] font-medium text-sm mt-0.5">{displayProfile?.title}</p>
                {displayProfile?.email && (
                  <p className="text-xs text-[#8E8E93] mt-1">{displayProfile.email}</p>
                )}
              </div>
            </div>

            {displayProfile?.bio && (
              <p className="text-sm text-[#636366] leading-relaxed mt-5 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
                {displayProfile.bio}
              </p>
            )}
          </motion.div>

          {/* Download section */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.2} className="card p-6 mb-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#007AFF]/08 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-[#007AFF]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1C1C1E]">PDF Resume</p>
                <p className="text-xs text-[#8E8E93] mt-0.5">Generated from live portfolio data</p>
              </div>
            </div>
            <ResumeDownloadButton />
          </motion.div>

          {/* Portfolio links */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.3}>
            <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider mb-3">Explore Portfolio</p>
            <div className="space-y-2">
              {SECTIONS.map(s => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all duration-200 hover:border-[#007AFF]/30 hover:bg-[#007AFF]/02 group"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <span className="text-sm font-medium text-[#1C1C1E]">{s.label}</span>
                  <ArrowRight className="w-4 h-4 text-[#C7C7CC] group-hover:text-[#007AFF] transition-colors" />
                </Link>
              ))}
            </div>
          </motion.div>

        </div>
      </main>
      <Footer profile={displayProfile} />
    </>
  );
}
