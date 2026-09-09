'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { defaultPortfolioData } from '@/lib/defaultData';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Save, BookOpen, Info } from 'lucide-react';
import type { Training } from '@/types';

const empty: Omit<Training, 'id' | 'created_at'> = {
  title: '', provider: '', year: '', certificate_url: '', order_index: 0,
};

export default function TrainingsPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Training | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from('trainings').select('*').order('order_index');
    setItems(data?.length ? data : defaultPortfolioData.trainings);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setForm({ ...empty, order_index: items.length });
    setShowForm(true);
  }

  function openEdit(t: Training) {
    setEditing(t);
    setForm({
      title: t.title, provider: t.provider, year: t.year ?? '',
      certificate_url: t.certificate_url ?? '', order_index: t.order_index,
    });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = editing
      ? await supabase.from('trainings').update(form).eq('id', editing.id)
      : await supabase.from('trainings').insert(form);
    if (error) toast.error('Could not save. Please try again.');
    else { toast.success(editing ? 'Course updated!' : 'Course added!'); setShowForm(false); load(); }
    setSaving(false);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Remove "${title}"?`)) return;
    const { error } = await supabase.from('trainings').delete().eq('id', id);
    if (error) toast.error('Could not delete. Please try again.');
    else { toast.success('Course removed.'); load(); }
  }

  const grouped = items.reduce<Record<string, Training[]>>((acc, t) => {
    if (!acc[t.provider]) acc[t.provider] = [];
    acc[t.provider].push(t);
    return acc;
  }, {});

  if (loading) return <div className="flex items-center justify-center h-48"><p className="text-sm text-[#8E8E93]">Loading certifications…</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF2D55]/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-[#FF2D55]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1C1C1E]">Training</h1>
            <p className="text-xs text-[#8E8E93]">
              {items.length} course{items.length !== 1 ? 's' : ''} across {Object.keys(grouped).length} provider{Object.keys(grouped).length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button onClick={openNew} className="ios-btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      <div className="flex items-start gap-2.5 p-3.5 rounded-xl mb-5 mt-4"
        style={{ background: 'rgba(255,45,85,0.06)', border: '1px solid rgba(255,45,85,0.12)' }}>
        <Info className="w-4 h-4 text-[#FF2D55] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#8B0000] leading-relaxed">
          Courses are grouped by provider on your portfolio. Keep the provider name consistent — e.g. always "Udemy" not "udemy" or "Udemy.com" — so they group correctly.
        </p>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-[#1C1C1E]">
                  {editing ? 'Edit Course' : 'Add Certification or Course'}
                </h2>
                <p className="text-xs text-[#8E8E93] mt-0.5">
                  This will appear in the Training section of your portfolio.
                </p>
              </div>
              <button onClick={() => setShowForm(false)} className="text-[#8E8E93] hover:text-[#1C1C1E] p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#636366] mb-1.5">Course / Certification Title *</label>
                <input
                  className="ios-input"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="e.g. SCRUM Master Certified Training"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#636366] mb-1">Provider / Platform *</label>
                <p className="text-[10px] text-[#8E8E93] mb-1.5">
                  Choose an existing provider or type a new one.
                </p>
                <input
                  className="ios-input"
                  value={form.provider}
                  onChange={e => setForm({ ...form, provider: e.target.value })}
                  required
                  placeholder="e.g. Udemy, APEX Global, FIT Academy…"
                  list="providers-list"
                />
                <datalist id="providers-list">
                  {Object.keys(grouped).map(p => <option key={p} value={p} />)}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#636366] mb-1.5">Year Completed</label>
                <input
                  className="ios-input"
                  value={form.year ?? ''}
                  onChange={e => setForm({ ...form, year: e.target.value })}
                  placeholder="e.g. 2023"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#636366] mb-1">Training / Certificate URL (optional)</label>
                <p className="text-[10px] text-[#8E8E93] mb-1.5">
                  Paste the link to the certificate, course page, or training file. When added, visitors can click the training item on your portfolio to open it in a new tab.
                </p>
                <input
                  className="ios-input"
                  type="url"
                  value={form.certificate_url ?? ''}
                  onChange={e => setForm({ ...form, certificate_url: e.target.value })}
                  placeholder="https://…"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="ios-btn-primary disabled:opacity-60">
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving…' : (editing ? 'Update Course' : 'Add Course')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="ios-btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#F2F2F7] flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-[#8E8E93]" />
          </div>
          <p className="font-semibold text-[#1C1C1E] mb-1">No courses added yet</p>
          <p className="text-sm text-[#8E8E93] mb-4">Add certifications and training courses you've completed.</p>
          <button onClick={openNew} className="ios-btn-primary mx-auto">
            <Plus className="w-4 h-4" /> Add First Course
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([provider, courses]) => (
            <div key={provider} className="card overflow-hidden">
              <div className="px-4 py-3 border-b" style={{ background: '#FAFAFA', borderColor: 'var(--border)' }}>
                <p className="text-xs font-semibold text-[#636366] uppercase tracking-wider">{provider}</p>
                <p className="text-[10px] text-[#8E8E93]">{courses.length} course{courses.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {courses.map(t => (
                  <div key={t.id} className="flex items-center justify-between px-4 py-3 gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm text-[#1C1C1E] truncate">{t.title}</p>
                        {t.certificate_url && (
                          <span className="text-[10px] font-semibold rounded px-1.5 py-0.5 flex-shrink-0" style={{ background: 'rgba(0,122,255,0.08)', color: '#005EC4' }}>
                            Has URL
                          </span>
                        )}
                      </div>
                      {t.year && <p className="text-xs text-[#8E8E93]">{t.year}</p>}
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => openEdit(t)}
                        className="w-7 h-7 rounded-lg bg-[#F2F2F7] text-[#636366] hover:bg-[#007AFF]/10 hover:text-[#007AFF] flex items-center justify-center transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id, t.title)}
                        className="w-7 h-7 rounded-lg bg-[#F2F2F7] text-[#636366] hover:bg-red-50 hover:text-[#FF3B30] flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
