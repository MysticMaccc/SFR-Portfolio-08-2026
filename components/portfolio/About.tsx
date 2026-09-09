'use client';

import type { ElementType } from 'react';
import { motion } from 'framer-motion';
import { Github, Mail, Phone, Globe } from 'lucide-react';
import type { Profile, Experience } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

export default function About({
  profile,
  experiences,
}: {
  profile: Profile | null;
  experiences: Experience[];
}) {
  const startYear = experiences.length
    ? Math.min(...experiences.map(e => parseInt(e.start_date)))
    : 2018;
  const yearsExp = new Date().getFullYear() - startYear;

  const contacts = [
    profile?.email    && { icon: Mail,   label: profile.email,  href: `mailto:${profile.email}` },
    profile?.phone    && { icon: Phone,  label: profile.phone,  href: `tel:${profile.phone}` },
    profile?.github   && { icon: Github, label: profile.github.replace('https://github.com/', 'github.com/'), href: profile.github, external: true },
    profile?.portfolio_url && { icon: Globe, label: profile.portfolio_url.replace('https://', ''), href: profile.portfolio_url, external: true },
  ].filter(Boolean) as { icon: ElementType; label: string; href: string | null; external?: boolean }[];

  const stats = [
    { value: `${yearsExp}+`, label: 'Years Experience' },
    { value: `${experiences.length > 0 ? experiences.length : '2'}+`, label: 'Companies' },
    { value: '11+', label: 'Projects' },
    { value: '38+', label: 'Skills' },
  ];

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
          <p className="text-xs font-semibold text-[#007AFF] uppercase tracking-widest mb-3">About</p>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#1C1C1E] tracking-tight leading-tight">
            {profile?.name ?? 'Full Stack Developer'}
          </h1>
        </motion.div>

        {/* Content grid */}
        <div className="grid md:grid-cols-3 gap-5 sm:gap-6">

          {/* Bio — left 2/3 */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.15 }}
            className="md:col-span-2"
          >
            <div className="card p-6 sm:p-8 h-full">
              <p className="text-[#1C1C1E] font-semibold text-sm mb-1">
                {profile?.title ?? 'Full Stack Developer'}
              </p>

              <p className="text-sm text-[#636366] leading-relaxed mt-3">
                {profile?.bio ??
                  'Full Stack Developer with 7+ years of experience designing and building scalable web and mobile applications. Specialized in React/Next.js and Laravel ecosystems. Experienced in leading projects from requirement gathering through deployment.'}
              </p>

              {contacts.length > 0 && (
                <div className="mt-6 pt-6 border-t space-y-3" style={{ borderColor: 'var(--border)' }}>
                  {contacts.map(({ icon: Icon, label, href, external }) =>
                    href ? (
                      <a
                        key={label}
                        href={href}
                        target={external ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-[#636366] hover:text-[#007AFF] transition-colors group"
                      >
                        <span className="w-7 h-7 rounded-lg bg-[#F2F2F7] flex items-center justify-center flex-shrink-0 group-hover:bg-[#007AFF]/08 transition-colors">
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        {label}
                      </a>
                    ) : (
                      <div key={label} className="flex items-center gap-3 text-sm text-[#636366]">
                        <span className="w-7 h-7 rounded-lg bg-[#F2F2F7] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        {label}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Stats — right 1/3 */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-1 gap-3 sm:gap-4 content-start"
          >
            {stats.map(s => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                className="card p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-3xl sm:text-4xl font-bold text-[#1C1C1E] tracking-tight">{s.value}</p>
                <p className="text-xs text-[#8E8E93] mt-1.5 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
