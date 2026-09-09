'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import type { ProjectImage } from '@/types';

interface Props {
  images: ProjectImage[];
  initialIndex?: number;
  projectTitle: string;
  onClose: () => void;
}

export default function ProjectGallery({ images, initialIndex = 0, projectTitle, onClose }: Props) {
  const [current, setCurrent] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent(i => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next]);

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-4 flex-shrink-0"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5">
          <Images className="w-4 h-4 text-white/60" />
          <div>
            <p className="text-white text-sm font-semibold leading-tight">{projectTitle}</p>
            <p className="text-white/50 text-xs">{current + 1} of {images.length}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Main image area */}
      <div
        className="flex-1 relative flex items-center justify-center px-2 sm:px-16 min-h-0"
        onClick={e => e.stopPropagation()}
      >
        {/* Prev arrow */}
        {images.length > 1 && (
          <button
            onClick={prev}
            className="absolute left-2 sm:left-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        )}

        {/* Image */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.img
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              src={images[current].url}
              alt={`${projectTitle} — image ${current + 1}`}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              style={{ maxHeight: 'calc(100vh - 220px)' }}
              draggable={false}
            />
          </AnimatePresence>
        </div>

        {/* Next arrow */}
        {images.length > 1 && (
          <button
            onClick={next}
            className="absolute right-2 sm:right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="flex-shrink-0 px-4 sm:px-6 pb-5 pt-3"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex gap-2 overflow-x-auto pb-1 justify-start sm:justify-center scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  opacity: i === current ? 1 : 0.45,
                  transform: i === current ? 'scale(1.08)' : 'scale(1)',
                  outline: i === current ? '2px solid white' : '2px solid transparent',
                  outlineOffset: '2px',
                }}
              >
                <img
                  src={img.url}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
