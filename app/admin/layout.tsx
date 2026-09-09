import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/Sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex">
      <AdminSidebar userEmail={user.email ?? ''} />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8 min-h-screen">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
