'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { useState } from 'react';
import {
  LayoutDashboard, User, FolderOpen, Zap, Briefcase,
  BookOpen, FileText, LogOut, Menu, X, ExternalLink,
} from 'lucide-react';

const NAV = [
  { label: 'Dashboard',  href: '/admin/dashboard',  icon: LayoutDashboard, desc: 'Overview' },
  { label: 'Profile',    href: '/admin/profile',    icon: User,             desc: 'Personal info' },
  { label: 'Projects',   href: '/admin/projects',   icon: FolderOpen,       desc: 'Portfolio work' },
  { label: 'Skills',     href: '/admin/skills',     icon: Zap,              desc: 'Technologies' },
  { label: 'Experience', href: '/admin/experience', icon: Briefcase,        desc: 'Work history' },
  { label: 'Training',   href: '/admin/trainings',  icon: BookOpen,         desc: 'Certifications' },
  { label: 'Resume',     href: '/admin/resume',     icon: FileText,         desc: 'PDF generator' },
];

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success('You have been signed out.');
    router.push('/auth/login');
    router.refresh();
  }

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'var(--ios-blue)' }}
          >
            {userEmail.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1C1C1E]">Portfolio Admin</p>
            <p className="text-[11px] text-[#8E8E93] truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        {NAV.map(({ label, href, icon: Icon, desc }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-100 group"
              style={{
                background: active ? 'var(--ios-blue)' : 'transparent',
                color: active ? '#FFFFFF' : '#636366',
              }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium leading-tight">{label}</p>
                {!active && (
                  <p className="text-[10px] text-[#C7C7CC] leading-tight group-hover:text-[#8E8E93] transition-colors">
                    {desc}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 space-y-0.5" style={{ borderTop: '1px solid var(--border)' }}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#636366] hover:bg-[#F2F2F7] transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Live Portfolio
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors hover:bg-red-50"
          style={{ color: 'var(--ios-red)' }}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-60 bg-white"
        style={{ borderRight: '1px solid var(--border)' }}
      >
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-white"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <p className="font-semibold text-[#1C1C1E] text-sm">Portfolio Admin</p>
        <button
          onClick={() => setOpen(!open)}
          className="w-8 h-8 rounded-lg bg-[#F2F2F7] flex items-center justify-center"
        >
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div
            className="absolute inset-y-0 left-0 w-60 bg-white"
            style={{ borderRight: '1px solid var(--border)' }}
          >
            <div className="pt-14">
              <NavContent />
            </div>
          </div>
          <div
            className="absolute inset-0 -z-10 bg-black/20"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* Mobile spacer */}
      <div className="lg:hidden h-14" />
    </>
  );
}
