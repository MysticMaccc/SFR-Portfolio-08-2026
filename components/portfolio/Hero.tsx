'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Github, Mail, Phone } from 'lucide-react';
import type { Profile } from '@/types';
import dynamic from 'next/dynamic';

const ResumeDownloadButton = dynamic(
  () => import('@/components/resume/ResumeDownloadButton'),
  { ssr: false }
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
};

export default function Hero({ profile }: { profile: Profile | null }) {
  const name = profile?.name ?? 'Sherwin Christopher F. Roxas';
  const title = profile?.title ?? 'Full Stack Developer';

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white pt-14 overflow-hidden">
      {/* Subtle background accent */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(0,122,255,0.04) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom left, rgba(0,122,255,0.03) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-3xl w-full mx-auto px-5 sm:px-8 py-16 sm:py-24 text-center">
        {/* Name */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold text-[#1C1C1E] mb-4 sm:mb-5"
          style={{ letterSpacing: '-0.03em', lineHeight: 1.05 }}
        >
          {name}
        </motion.h1>

        {/* Title */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.1}
          className="text-lg sm:text-xl font-medium text-[#007AFF] mb-8 sm:mb-10"
        >
          {title}
        </motion.p>

        {/* Divider */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.18}
          className="flex items-center justify-center gap-4 mb-8 sm:mb-10"
        >
          <div className="h-px bg-[#E5E5EA] w-16 sm:w-24" />
          <div className="w-1 h-1 rounded-full bg-[#C7C7CC]" />
          <div className="h-px bg-[#E5E5EA] w-16 sm:w-24" />
        </motion.div>

        {/* Contact row */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.25}
          className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-6 mb-10 sm:mb-12"
        >
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-2 text-sm text-[#636366] hover:text-[#007AFF] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{profile.email}</span>
            </a>
          )}
          {profile?.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="flex items-center gap-2 text-sm text-[#636366] hover:text-[#007AFF] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{profile.phone}</span>
            </a>
          )}
          {profile?.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#636366] hover:text-[#007AFF] transition-colors"
            >
              <Github className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{profile.github.replace('https://github.com/', '')}</span>
            </a>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.35}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/projects" className="ios-btn-primary w-full sm:w-auto justify-center">
            View Projects
          </Link>
          <ResumeDownloadButton />
        </motion.div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#E5E5EA]" />
    </div>
  );
}
