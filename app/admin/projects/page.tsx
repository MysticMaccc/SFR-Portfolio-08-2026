'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { defaultPortfolioData } from '@/lib/defaultData';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Save, FolderOpen, Star, Info, Images } from 'lucide-react';
import type { Project } from '@/types';
import ProjectImages from '@/components/admin/ProjectImages';

const CATEGORIES = ['web', 'mobile', 'other'];
const empty: Omit<Project, 'id' | 'created_at' | 'updated_at'> = {
  title: '', description: '', tech_stack: [], category: 'web',
  url: '', github_url: '', image_url: '', featured: false, order_index: 0,
};

export default function ProjectsPage() {
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(empty);
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from('projects').select('*').order('order_index');
    setProjects(data?.length ? data : defaultPortfolioData.projects);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setForm({ ...empty, order_index: projects.length });
    setTechInput('');
    setShowForm(true);
  }

  function openEdit(p: Project) {
    setEditing(p);
    setForm({
      title: p.title, description: p.description, tech_stack: p.tech_stack,
      category: p.category, url: p.url ?? '', github_url: p.github_url ?? '',
      image_url: p.image_url ?? '', featured: p.featured, order_index: p.order_index,
    });
    setTechInput('');
    setShowForm(true);
  }

  function addTech(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = techInput.trim().replace(/,$/, '');
      if (val && !form.tech_stack.includes(val)) {
        setForm({ ...form, tech_stack: [...form.tech_stack, val] });
      }
      setTechInput('');
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = editing
      ? await supabase.from('projects').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id)
      : await supabase.from('projects').insert(form);
    if (error) toast.error('Could not save. Please try again.');
    else { toast.success(editing ? 'Project updated!' : 'Project added!'); setShowForm(false); load(); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) toast.error('Could not delete. Please try again.');
    else { toast.success('Project removed.'); load(); }
  }

  const CATEGORY_COLOR: Record<string, { bg: string; text: string }> = {
    web:    { bg: 'rgba(0,122,255,0.08)',  text: '#005EC4' },
    mobile: { bg: 'rgba(52,199,89,0.1)',   text: '#1A7A38' },
    other:  { bg: 'rgba(142,142,147,0.1)', text: '#636366' },
  };

  if (loading) return <div className="flex items-center justify-center h-48"><p className="text-sm text-[#8E8E93]">Loading projects…</p></div>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#34C759]/10 flex items-center justify-center">
            <FolderOpen className="w-4 h-4 text-[#34C759]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1C1C1E]">Projects</h1>
            <p className="text-xs text-[#8E8E93]">{projects.length} project{projects.length !== 1 ? 's' : ''} in your portfolio</p>
          </div>
        </div>
        <button onClick={openNew} className="ios-btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Tip */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl mb-5 mt-4"
        style={{ background: 'rgba(52,199,89,0.06)', border: '1px solid rgba(52,199,89,0.15)' }}>
        <Info className="w-4 h-4 text-[#34C759] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#1A7A38] leading-relaxed">
          Projects are shown on your public portfolio. Mark your best ones as <strong>Featured</strong> — they appear highlighted at the top. The order number controls the display order (lower = first).
        </p>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-lg max-h-[92vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-[#1C1C1E]">
                  {editing ? 'Edit Project' : 'Add New Project'}
                </h2>
                <p className="text-xs text-[#8E8E93] mt-0.5">
                  {editing ? 'Update the details below.' : 'Fill in the details for your new project.'}
                </p>
              </div>
              <button onClick={() => setShowForm(false)} className="text-[#8E8E93] hover:text-[#1C1C1E] p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#636366] mb-1.5">Project Name *</label>
                <input className="ios-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Online Enrollment System" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#636366] mb-1.5">Description</label>
                <textarea className="ios-input resize-none" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What does this project do? Who is it for?" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#636366] mb-1.5">Category</label>
                <select className="ios-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#636366] mb-1">
                  Tech Stack
                </label>
                <p className="text-[10px] text-[#8E8E93] mb-1.5">Type a technology and press Enter or comma to add it.</p>
                <input
                  className="ios-input"
                  value={techInput}
                  onChange={e => setTechInput(e.target.value)}
                  onKeyDown={addTech}
                  placeholder="e.g. React, Laravel, MySQL…"
                />
                {form.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tech_stack.map(t => (
                      <span key={t} className="flex items-center gap-1 text-xs font-medium rounded-lg px-2.5 py-1" style={{ background: 'rgba(0,122,255,0.08)', color: '#005EC4' }}>
                        {t}
                        <button type="button" onClick={() => setForm({ ...form, tech_stack: form.tech_stack.filter(x => x !== t) })}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#636366] mb-1.5">Live URL (optional)</label>
                  <input className="ios-input" type="url" value={form.url ?? ''} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://…" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#636366] mb-1.5">GitHub URL (optional)</label>
                  <input className="ios-input" type="url" value={form.github_url ?? ''} onChange={e => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/…" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#636366] mb-1.5">Display Order</label>
                  <input className="ios-input" type="number" min={0} value={form.order_index} onChange={e => setForm({ ...form, order_index: Number(e.target.value) })} />
                  <p className="text-[10px] text-[#8E8E93] mt-1">Lower number appears first.</p>
                </div>
                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-2.5 cursor-pointer mt-4">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={e => setForm({ ...form, featured: e.target.checked })}
                      className="w-4 h-4 accent-[#007AFF]"
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#1C1C1E] flex items-center gap-1">
                        Featured <Star className="w-3 h-3 text-[#FF9500]" />
                      </p>
                      <p className="text-[10px] text-[#8E8E93]">Highlighted in portfolio</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="ios-btn-primary disabled:opacity-60">
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving…' : (editing ? 'Update Project' : 'Add Project')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="ios-btn-secondary">
                  Cancel
                </button>
              </div>
            </form>

            {/* Image management — only for existing projects */}
            {editing ? (
              <ProjectImages projectId={editing.id} />
            ) : (
              <div className="pt-4 border-t mt-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(0,122,255,0.05)', border: '1px solid rgba(0,122,255,0.1)' }}>
                  <Images className="w-4 h-4 text-[#007AFF] flex-shrink-0" />
                  <p className="text-xs text-[#005EC4]">
                    Save this project first, then reopen it to upload images.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {projects.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#F2F2F7] flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-6 h-6 text-[#8E8E93]" />
          </div>
          <p className="font-semibold text-[#1C1C1E] mb-1">No projects yet</p>
          <p className="text-sm text-[#8E8E93] mb-4">Add your first project to showcase your work.</p>
          <button onClick={openNew} className="ios-btn-primary mx-auto">
            <Plus className="w-4 h-4" /> Add Your First Project
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map(p => {
            const badge = CATEGORY_COLOR[p.category] ?? CATEGORY_COLOR.other;
            return (
              <div key={p.id} className="card p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-[#1C1C1E] truncate">{p.title}</p>
                    {p.featured && <Star className="w-3.5 h-3.5 text-[#FF9500] fill-[#FF9500] flex-shrink-0" />}
                    <span className="text-[10px] font-medium rounded px-1.5 py-0.5 flex-shrink-0" style={{ background: badge.bg, color: badge.text }}>
                      {p.category}
                    </span>
                  </div>
                  {p.description && (
                    <p className="text-xs text-[#8E8E93] mt-0.5 truncate">{p.description}</p>
                  )}
                  {p.tech_stack.length > 0 && (
                    <p className="text-[10px] text-[#C7C7CC] mt-1">
                      {p.tech_stack.slice(0, 5).join(' · ')}{p.tech_stack.length > 5 ? ` +${p.tech_stack.length - 5}` : ''}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(p)}
                    className="w-8 h-8 rounded-xl bg-[#F2F2F7] text-[#636366] hover:bg-[#007AFF]/10 hover:text-[#007AFF] flex items-center justify-center transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="w-8 h-8 rounded-xl bg-[#F2F2F7] text-[#636366] hover:bg-red-50 hover:text-[#FF3B30] flex items-center justify-center transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
