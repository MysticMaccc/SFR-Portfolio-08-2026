import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  User, FolderOpen, Zap, Briefcase,
  BookOpen, FileText, ExternalLink, ArrowRight,
} from 'lucide-react';

const SECTIONS = [
  {
    label: 'Profile',
    href: '/admin/profile',
    icon: User,
    color: '#007AFF',
    desc: 'Update your name, bio, contact details, and profile photo.',
    tip: 'Keep your bio concise — 2 to 3 sentences works best.',
  },
  {
    label: 'Projects',
    href: '/admin/projects',
    icon: FolderOpen,
    color: '#34C759',
    desc: 'Add, edit, or remove projects from your portfolio.',
    tip: 'Mark your best work as "Featured" so it appears first.',
  },
  {
    label: 'Skills',
    href: '/admin/skills',
    icon: Zap,
    color: '#FF9500',
    desc: 'Organize your technical skills into categories.',
    tip: 'Group related skills together — e.g. Frontend, Backend, Tools.',
  },
  {
    label: 'Experience',
    href: '/admin/experience',
    icon: Briefcase,
    color: '#AF52DE',
    desc: 'Add your work history with responsibilities.',
    tip: 'Use bullet points for each key responsibility — one idea per line.',
  },
  {
    label: 'Training',
    href: '/admin/trainings',
    icon: BookOpen,
    color: '#FF2D55',
    desc: 'List your certifications and completed courses.',
    tip: 'Add the year for each course so visitors see your timeline.',
  },
  {
    label: 'Resume',
    href: '/admin/resume',
    icon: FileText,
    color: '#5AC8FA',
    desc: 'Generate and download your PDF resume from live data.',
    tip: 'Update your profile and projects first for a complete resume.',
  },
];

export default async function DashboardPage() {
  const supabase = createClient();
  const [profileRes, projectsRes, skillsRes] = await Promise.all([
    supabase.from('profiles').select('name').single(),
    supabase.from('projects').select('id', { count: 'exact' }),
    supabase.from('skills').select('id', { count: 'exact' }),
  ]);

  const firstName = profileRes.data?.name?.split(' ')[0] ?? 'there';
  const projectCount = projectsRes.count ?? 0;
  const skillCount = skillsRes.count ?? 0;

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1C1C1E]">
          Welcome back, {firstName}
        </h1>
        <p className="text-sm text-[#636366] mt-1">
          Your portfolio is live and looking good. Here's what you can manage below.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Projects', value: projectCount },
          { label: 'Skills', value: skillCount },
          { label: 'Status', value: 'Live' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className="text-xl font-bold text-[#1C1C1E]">{s.value}</p>
            <p className="text-xs text-[#8E8E93] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Sections grid */}
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {SECTIONS.map(({ label, href, icon: Icon, color, desc, tip }) => (
          <Link
            key={href}
            href={href}
            className="card p-5 hover:bg-[#FAFAFA] transition-colors group block"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: color + '15', color }}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm text-[#1C1C1E]">{label}</p>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C7C7CC] group-hover:text-[#636366] transition-colors" />
                </div>
                <p className="text-xs text-[#636366] mt-0.5 leading-relaxed">{desc}</p>
                <p className="text-[10px] text-[#8E8E93] mt-1.5 leading-relaxed">
                  Tip: {tip}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View live site */}
      <div className="card p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#1C1C1E]">View your live portfolio</p>
          <p className="text-xs text-[#8E8E93] mt-0.5">
            Changes you make here are reflected immediately on the public site.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="ios-btn-secondary flex-shrink-0 text-sm py-2 px-3"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Open
        </a>
      </div>
    </div>
  );
}
