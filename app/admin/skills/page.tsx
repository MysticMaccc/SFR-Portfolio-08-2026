'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { defaultPortfolioData } from '@/lib/defaultData';
import toast from 'react-hot-toast';
import { Plus, Trash2, X, Zap, Info } from 'lucide-react';
import type { Skill } from '@/types';

const LEVELS = [
  { value: 'beginner',     label: 'Beginner',     color: '#FF9500' },
  { value: 'intermediate', label: 'Intermediate',  color: '#007AFF' },
  { value: 'advanced',     label: 'Advanced',      color: '#34C759' },
];

const LEVEL_STYLE: Record<string, { bg: string; text: string }> = {
  advanced:     { bg: 'rgba(52,199,89,0.1)',   text: '#1A7A38' },
  intermediate: { bg: 'rgba(0,122,255,0.08)',  text: '#005EC4' },
  beginner:     { bg: 'rgba(255,149,0,0.1)',   text: '#7A4800' },
};

const empty: Omit<Skill, 'id' | 'created_at'> = {
  category: '', name: '', level: 'intermediate', order_index: 0,
};

export default function SkillsPage() {
  const supabase = createClient();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from('skills').select('*').order('category').order('order_index');
    setSkills(data?.length ? data : defaultPortfolioData.skills);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.category.trim() || !form.name.trim()) {
      toast.error('Please fill in both category and skill name.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('skills').insert({ ...form, order_index: skills.length });
    if (error) toast.error('Could not add skill. Please try again.');
    else { toast.success(`"${form.name}" added!`); setShowForm(false); load(); }
    setSaving(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove "${name}" from your skills?`)) return;
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) toast.error('Could not delete. Please try again.');
    else { toast.success('Skill removed.'); load(); }
  }

  if (loading) return <div className="flex items-center justify-center h-48"><p className="text-sm text-[#8E8E93]">Loading skills…</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF9500]/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#FF9500]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1C1C1E]">Skills</h1>
            <p className="text-xs text-[#8E8E93]">
              {skills.length} skills across {Object.keys(grouped).length} categories
            </p>
          </div>
        </div>
        <button onClick={() => { setForm(empty); setShowForm(true); }} className="ios-btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      <div className="flex items-start gap-2.5 p-3.5 rounded-xl mb-5 mt-4"
        style={{ background: 'rgba(255,149,0,0.06)', border: '1px solid rgba(255,149,0,0.15)' }}>
        <Info className="w-4 h-4 text-[#FF9500] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#7A4800] leading-relaxed">
          Skills are grouped by category on your portfolio. Use consistent category names (e.g. "Frontend", "Backend") so they group correctly. The color of each pill indicates proficiency level.
        </p>
      </div>

      {/* Add skill modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[#1C1C1E]">Add Skill</h2>
                <p className="text-xs text-[#8E8E93] mt-0.5">Add a new skill to your portfolio.</p>
              </div>
              <button onClick={() => setShowForm(false)} className="text-[#8E8E93] hover:text-[#1C1C1E] p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#636366] mb-1">Category *</label>
                <p className="text-[10px] text-[#8E8E93] mb-1.5">
                  Choose an existing category or type a new one.
                </p>
                <input
                  className="ios-input"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  required
                  placeholder="e.g. Frontend, Backend, Mobile…"
                  list="skill-categories"
                />
                <datalist id="skill-categories">
                  {Object.keys(grouped).map(c => <option key={c} value={c} />)}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#636366] mb-1.5">Skill Name *</label>
                <input
                  className="ios-input"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. React JS, Laravel, MySQL…"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#636366] mb-1.5">Proficiency Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {LEVELS.map(l => (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => setForm({ ...form, level: l.value })}
                      className="py-2 rounded-xl text-xs font-semibold border transition-colors"
                      style={{
                        background: form.level === l.value ? l.color + '15' : '#F2F2F7',
                        color: form.level === l.value ? l.color : '#636366',
                        borderColor: form.level === l.value ? l.color + '40' : 'transparent',
                      }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={saving} className="ios-btn-primary disabled:opacity-60">
                  {saving ? 'Adding…' : 'Add Skill'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="ios-btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grouped skills */}
      {Object.keys(grouped).length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#F2F2F7] flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-[#8E8E93]" />
          </div>
          <p className="font-semibold text-[#1C1C1E] mb-1">No skills added yet</p>
          <p className="text-sm text-[#8E8E93] mb-4">Start adding your technical skills.</p>
          <button onClick={() => { setForm(empty); setShowForm(true); }} className="ios-btn-primary mx-auto">
            <Plus className="w-4 h-4" /> Add First Skill
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="card p-4">
              <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider mb-3">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map(s => {
                  const style = LEVEL_STYLE[s.level] ?? LEVEL_STYLE.intermediate;
                  return (
                    <div
                      key={s.id}
                      className="flex items-center gap-1 rounded-lg pl-2.5 pr-1.5 py-1"
                      style={{ background: style.bg, color: style.text }}
                    >
                      <span className="text-xs font-medium">{s.name}</span>
                      <button
                        onClick={() => handleDelete(s.id, s.name)}
                        className="opacity-50 hover:opacity-100 transition-opacity ml-0.5 p-0.5 rounded"
                        title={`Remove ${s.name}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Level legend */}
      {skills.length > 0 && (
        <div className="flex items-center gap-4 mt-5 px-1">
          <p className="text-xs text-[#8E8E93]">Level:</p>
          {LEVELS.map(l => (
            <span key={l.value} className="flex items-center gap-1.5 text-xs" style={{ color: l.color }}>
              <span className="w-2 h-2 rounded-sm" style={{ background: l.color + '25' }} />
              {l.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
