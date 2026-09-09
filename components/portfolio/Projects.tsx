'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Star, Images } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { Project, ProjectImage } from '@/types';

const ProjectGallery = dynamic(() => import('./ProjectGallery'), { ssr: false });

const FILTERS = ['All', 'Web', 'Mobile'];

const CATEGORY_BADGE: Record<string, { bg: string; text: string }> = {
  web:    { bg: 'rgba(0,122,255,0.08)',  text: '#005EC4' },
  mobile: { bg: 'rgba(52,199,89,0.1)',   text: '#1A7A38' },
  other:  { bg: 'rgba(142,142,147,0.1)', text: '#636366' },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

interface Props {
  projects: Project[];
  projectImages?: Record<string, ProjectImage[]>;
}

interface GalleryState {
  project: Project;
  images: ProjectImage[];
  initialIndex: number;
}

export default function Projects({ projects, projectImages = {} }: Props) {
  const [filter, setFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [gallery, setGallery] = useState<GalleryState | null>(null);

  const filtered = filter === 'All'
    ? projects
    : projects.filter(p => p.category.toLowerCase() === filter.toLowerCase());

  const visible = showAll ? filtered : filtered.slice(0, 6);

  function openGallery(project: Project, initialIndex = 0) {
    const images = projectImages[project.id] ?? [];
    if (images.length === 0) return;
    setGallery({ project, images, initialIndex });
  }

  return (
    <>
      <div className="min-h-[calc(100vh-56px)] py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          {/* Page header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mb-8 sm:mb-12"
          >
            <p className="text-xs font-semibold text-[#34C759] uppercase tracking-widest mb-3">Projects</p>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#1C1C1E] tracking-tight">Portfolio</h1>
          </motion.div>

          {/* Filter tabs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 }}
            className="flex gap-2 mb-8 sm:mb-10"
          >
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => { setFilter(f); setShowAll(false); }}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: filter === f ? '#1C1C1E' : '#FFFFFF',
                  color: filter === f ? '#FFFFFF' : '#636366',
                  border: `1px solid ${filter === f ? '#1C1C1E' : 'var(--border)'}`,
                }}
              >
                {f}
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {visible.map(project => {
                const badge = CATEGORY_BADGE[project.category] ?? CATEGORY_BADGE.other;
                const images = projectImages[project.id] ?? [];
                const hasImages = images.length > 0;
                const coverImage = images[0]?.url;

                return (
                  <motion.div
                    key={project.id}
                    variants={fadeUp}
                    layout
                    className="card flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg bg-white overflow-hidden"
                  >
                    {/* Image banner (if images exist) */}
                    {hasImages && (
                      <div
                        className="relative w-full aspect-video overflow-hidden cursor-pointer group"
                        onClick={() => openGallery(project, 0)}
                      >
                        <img
                          src={coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 bg-black/60 rounded-xl px-3 py-1.5">
                            <Images className="w-3.5 h-3.5 text-white" />
                            <span className="text-white text-xs font-semibold">View Photos</span>
                          </div>
                        </div>
                        {/* Image count badge */}
                        {images.length > 1 && (
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 rounded-lg px-2 py-0.5">
                            <Images className="w-3 h-3 text-white" />
                            <span className="text-white text-[10px] font-semibold">{images.length}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-5 flex flex-col flex-1">
                      {/* Top row */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider rounded-lg px-2.5 py-1"
                          style={{ background: badge.bg, color: badge.text }}
                        >
                          {project.category}
                        </span>
                        {project.featured && (
                          <Star className="w-3.5 h-3.5 fill-[#FF9500] text-[#FF9500]" />
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-[#1C1C1E] text-sm sm:text-base mb-2 leading-snug">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-[#636366] leading-relaxed flex-1 mb-4">
                        {project.description}
                      </p>

                      {/* Tech stack */}
                      {project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {project.tech_stack.map(t => (
                            <span
                              key={t}
                              className="text-[10px] font-medium rounded-md px-2 py-0.5"
                              style={{ background: '#F2F2F7', color: '#636366' }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Bottom row: links + gallery button */}
                      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex gap-4">
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-semibold text-[#007AFF] hover:opacity-70 transition-opacity"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Live
                            </a>
                          )}
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-medium text-[#636366] hover:text-[#1C1C1E] transition-colors"
                            >
                              <Github className="w-3.5 h-3.5" />
                              Source
                            </a>
                          )}
                        </div>

                        {/* Gallery trigger (only if images exist and no banner shown already) */}
                        {hasImages && !coverImage && (
                          <button
                            onClick={() => openGallery(project, 0)}
                            className="flex items-center gap-1 text-xs font-medium text-[#636366] hover:text-[#007AFF] transition-colors"
                          >
                            <Images className="w-3.5 h-3.5" />
                            {images.length} photo{images.length > 1 ? 's' : ''}
                          </button>
                        )}

                        {hasImages && coverImage && (
                          <button
                            onClick={() => openGallery(project, 0)}
                            className="flex items-center gap-1 text-xs font-medium text-[#636366] hover:text-[#007AFF] transition-colors"
                          >
                            <Images className="w-3.5 h-3.5" />
                            {images.length} photo{images.length > 1 ? 's' : ''}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {filtered.length > 6 && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.4 }}
              className="mt-8 text-center"
            >
              <button
                onClick={() => setShowAll(!showAll)}
                className="ios-btn-secondary text-sm"
              >
                {showAll ? 'Show Less' : `Show All ${filtered.length}`}
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Lightbox gallery */}
      <AnimatePresence>
        {gallery && (
          <ProjectGallery
            images={gallery.images}
            initialIndex={gallery.initialIndex}
            projectTitle={gallery.project.title}
            onClose={() => setGallery(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
