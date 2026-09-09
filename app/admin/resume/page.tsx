'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { defaultPortfolioData } from '@/lib/defaultData';
import type { PortfolioData } from '@/types';
import { FileText, Info, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ResumeDownloadButton = dynamic(
  () => import('@/components/resume/ResumeDownloadButton'),
  {
    ssr: false,
    loading: () => (
      <span className="ios-btn-primary opacity-50 cursor-not-allowed text-sm">
        Loading PDF engine…
      </span>
    ),
  }
);

const CHECKLIST = [
  { label: 'Profile',    href: '/admin/profile',    key: 'profile',    check: (d: PortfolioData) => !!(d.profile?.name && d.profile?.bio) },
  { label: 'Experience', href: '/admin/experience', key: 'experience', check: (d: PortfolioData) => d.experiences.length > 0 },
  { label: 'Projects',   href: '/admin/projects',   key: 'projects',   check: (d: PortfolioData) => d.projects.length > 0 },
  { label: 'Skills',     href: '/admin/skills',     key: 'skills',     check: (d: PortfolioData) => d.skills.length > 0 },
  { label: 'Training',   href: '/admin/trainings',  key: 'trainings',  check: (d: PortfolioData) => d.trainings.length > 0 },
];

export default function ResumePage() {
  const supabase = createClient();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [profile, projects, skills, experiences, trainings] = await Promise.all([
        supabase.from('profiles').select('*').single(),
        supabase.from('projects').select('*').order('order_index'),
        supabase.from('skills').select('*').order('order_index'),
        supabase.from('experiences').select('*').order('order_index'),
        supabase.from('trainings').select('*').order('order_index'),
      ]);
      setData({
        profile: profile.data ?? defaultPortfolioData.profile,
        projects: projects.data?.length ? projects.data : defaultPortfolioData.projects,
        skills: skills.data?.length ? skills.data : defaultPortfolioData.skills,
        experiences: experiences.data?.length ? experiences.data : defaultPortfolioData.experiences,
        trainings: trainings.data?.length ? trainings.data : defaultPortfolioData.trainings,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !data) {
    return <div className="flex items-center justify-center h-48"><p className="text-sm text-[#8E8E93]">Loading resume data…</p></div>;
  }

  const allReady = CHECKLIST.every(c => c.check(data));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-[#5AC8FA]/15 flex items-center justify-center">
          <FileText className="w-4 h-4 text-[#007AFF]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#1C1C1E]">Resume Generator</h1>
          <p className="text-xs text-[#8E8E93]">Download a PDF resume built from your live portfolio data</p>
        </div>
      </div>

      {/* How it works tip */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl mb-5 mt-4"
        style={{ background: 'rgba(0,122,255,0.06)', border: '1px solid rgba(0,122,255,0.12)' }}>
        <Info className="w-4 h-4 text-[#007AFF] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#005EC4] leading-relaxed">
          Your PDF resume is generated directly from your Supabase data — the same data shown on your public portfolio. No uploading needed. Every time you click Download, it reflects your latest changes.
        </p>
      </div>

      {/* Readiness checklist */}
      <div className="card p-5 mb-4">
        <p className="text-sm font-semibold text-[#1C1C1E] mb-1">Resume completeness</p>
        <p className="text-xs text-[#8E8E93] mb-4">Make sure these sections are filled in for the best resume.</p>
        <div className="space-y-2">
          {CHECKLIST.map(({ label, href, check }) => {
            const done = check(data);
            return (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {done ? (
                    <CheckCircle className="w-4 h-4 text-[#34C759]" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-[#C7C7CC]" />
                  )}
                  <span className="text-sm" style={{ color: done ? '#1C1C1E' : '#8E8E93' }}>{label}</span>
                </div>
                {!done && (
                  <Link href={href} className="flex items-center gap-1 text-xs text-[#007AFF] hover:underline">
                    Fill in <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="card p-4 text-center">
          <p className="text-xl font-bold text-[#1C1C1E]">{data.experiences.length}</p>
          <p className="text-xs text-[#8E8E93] mt-0.5">Positions</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xl font-bold text-[#1C1C1E]">{data.projects.length}</p>
          <p className="text-xs text-[#8E8E93] mt-0.5">Projects</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xl font-bold text-[#1C1C1E]">{data.trainings.length}</p>
          <p className="text-xs text-[#8E8E93] mt-0.5">Certifications</p>
        </div>
      </div>

      {/* Download */}
      <div className="card p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#1C1C1E]">
            {data.profile?.name ?? 'Your'} — Resume
          </p>
          <p className="text-xs text-[#8E8E93] mt-0.5">
            {allReady
              ? 'All sections are complete. Your resume is ready to download.'
              : 'Some sections are incomplete — the PDF will still generate, but adding more detail helps.'}
          </p>
        </div>
        <ResumeDownloadButton data={data} />
      </div>
    </div>
  );
}
