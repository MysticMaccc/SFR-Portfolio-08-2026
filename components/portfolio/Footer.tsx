import type { Profile } from '@/types';

export default function Footer({ profile }: { profile: Profile | null }) {
  return (
    <footer className="py-8 px-5 bg-[#FAFAFA]">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-[#8E8E93]">
          © {new Date().getFullYear()} {profile?.name ?? 'Sherwin Christopher F. Roxas'}
        </p>
        <div className="flex items-center gap-4">
          {profile?.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#8E8E93] hover:text-[#1C1C1E] transition-colors"
            >
              GitHub
            </a>
          )}
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="text-xs text-[#8E8E93] hover:text-[#1C1C1E] transition-colors"
            >
              Email
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
