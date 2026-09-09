'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { defaultPortfolioData } from '@/lib/defaultData';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Save, Briefcase, Info } from 'lucide-react';
import type { Experience } from '@/types';

const empty: Omit<Experience, 'id' | 'created_at'> = {
  company: '', role: '', start_date: '', end_date: '', is_current: false,
  description: [], order_index: 0,
};

export default function ExperiencePage() {
  const supabase = createClient();
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState(empty);
  const [descInput, setDescInput] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from('experiences').select('*').order('order_index');
    setItems(data?.length ? data : defaultPortfolioData.experiences);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setForm({ ...empty, order_index: items.length });
    setDescInput('');
    setShowForm(true);
  }

  function openEdit(exp: Experience) {
    setEditing(exp);
    setForm({
      company: exp.company, role: exp.role, start_date: exp.start_date,
      end_date: exp.end_date ?? '', is_current: exp.is_current,
      description: exp.description, order_index: exp.order_index,
    });
    setDescInput(exp.description.join('\n'));
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      description: descInput.split('\n').map(d => d.trim()).filter(Boolean),
    };
    const { error } = editing
      ? await supabase.from('experiences').update(payload).eq('id', editing.id)
      : await supabase.from('experiences').insert(payload);
    if (error) toast.error('Could not save. Please try again.');
    else { toast.success(editing ? 'Experience updated!' : 'Experience added!'); setShowForm(false); load(); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this work experience entry?')) return;
    const { error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) toast.error('Could not delete. Please try again.');
    else { toast.success('Experience removed.'); load(); }
  }

  if (loading) return <div className="flex items-center justify-center h-48"><p className="text-sm text-[#8E8E93]">Loading experience…</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#AF52DE]/10 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-[#AF52DE]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1C1C1E]">Experience</h1>
            <p className="text-xs text-[#8E8E93]">{items.length} position{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button onClick={openNew} className="ios-btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Position
        </button>
      </div>

      <div className="flex items-start gap-2.5 p-3.5 rounded-xl mb-5 mt-4"
        style={{ background: 'rgba(175,82,222,0.06)', border: '1px solid rgba(175,82,222,0.15)' }}>
        <Info className="w-4 h-4 text-[#AF52DE] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#5B1A7A] leading-relaxed">
          Add one entry per job position. For responsibilities, write each one on its own line — they'll appear as bullet points on your portfolio.
        </p>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-lg max-h-[92vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-[#1C1C1E]">
                  {editing ? 'Edit Position' : 'Add Work Experience'}
                </h2>
                <p className="text-xs text-[#8E8E93] mt-0.5">
                  {editing ? 'Update this work experience.' : 'Add a job position to your history.'}
                </p>
              </div>
              <button onClick={() => setShowForm(false)} className="text-[#8E8E93] hover:text-[#1C1C1E] p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#636366] mb-1.5">Company Name *</label>
                <input
                  className="ios-input"
                  value={form.company}
                  onChange={e => setForm({ ...form, company: e.target.value })}
                  required
                  placeholder="e.g. NYK-FIL Maritime E-Training, Inc."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#636366] mb-1.5">Job Title / Role *</label>
                <input
                  className="ios-input"
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  required
                  placeholder="e.g. Senior Developer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#636366] mb-1.5">Start Year *</label>
                  <input
                    className="ios-input"
                    value={form.start_date}
                    onChange={e => setForm({ ...form, start_date: e.target.value })}
                    required
                    placeholder="e.g. 2021"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#636366] mb-1.5">End Year</label>
                  <input
                    className="ios-input"
                    value={form.end_date ?? ''}
                    onChange={e => setForm({ ...form, end_date: e.target.value })}
                    placeholder={form.is_current ? 'Present' : 'e.g. 2025'}
                    disabled={form.is_current}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_current}
                  onChange={e => setForm({ ...form, is_current: e.target.checked, end_date: e.target.checked ? '' : form.end_date })}
                  className="w-4 h-4 accent-[#007AFF]"
                />
                <span className="text-xs font-semibold text-[#1C1C1E]">I currently work here</span>
              </label>

              <div>
                <label className="block text-xs font-semibold text-[#636366] mb-1">Key Responsibilities</label>
                <p className="text-[10px] text-[#8E8E93] mb-1.5">
                  Write one responsibility per line. These appear as bullet points.
                </p>
                <textarea
                  className="ios-input resize-none"
                  rows={6}
                  value={descInput}
                  onChange={e => setDescInput(e.target.value)}
                  placeholder={"Led development of web and mobile applications\nManaged project timelines and resource allocation\nConducted code reviews and mentored junior developers"}
                />
                <p className="text-[10px] text-[#C7C7CC] mt-1">
                  {descInput.split('\n').filter(l => l.trim()).length} bullet point{descInput.split('\n').filter(l => l.trim()).length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="ios-btn-primary disabled:opacity-60">
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving…' : (editing ? 'Update' : 'Add Position')}
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
            <Briefcase className="w-6 h-6 text-[#8E8E93]" />
          </div>
          <p className="font-semibold text-[#1C1C1E] mb-1">No experience added yet</p>
          <p className="text-sm text-[#8E8E93] mb-4">Add your work history to show your career progression.</p>
          <button onClick={openNew} className="ios-btn-primary mx-auto">
            <Plus className="w-4 h-4" /> Add First Position
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(exp => (
            <div key={exp.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-[#1C1C1E]">{exp.role}</p>
                    {exp.is_current && (
                      <span
                        className="text-[10px] font-semibold rounded-full px-2 py-0.5"
                        style={{ background: 'rgba(52,199,89,0.1)', color: '#1A7A38' }}
                      >
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#007AFF] mt-0.5">{exp.company}</p>
                  <p className="text-xs text-[#8E8E93] mt-0.5">
                    {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(exp)}
                    className="w-8 h-8 rounded-xl bg-[#F2F2F7] text-[#636366] hover:bg-[#007AFF]/10 hover:text-[#007AFF] flex items-center justify-center transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="w-8 h-8 rounded-xl bg-[#F2F2F7] text-[#636366] hover:bg-red-50 hover:text-[#FF3B30] flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {exp.description.length > 0 && (
                <ul className="mt-3 pt-3 border-t space-y-1.5" style={{ borderColor: 'var(--border)' }}>
                  {exp.description.slice(0, 3).map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#636366]">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#C7C7CC] flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                  {exp.description.length > 3 && (
                    <li className="text-xs text-[#8E8E93]">
                      +{exp.description.length - 3} more — click edit to see all
                    </li>
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
