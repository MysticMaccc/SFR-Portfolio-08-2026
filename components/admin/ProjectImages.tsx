'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { Upload, X, Loader2, ImageIcon, GripVertical } from 'lucide-react';
import type { ProjectImage } from '@/types';

interface Props {
  projectId: string;
}

export default function ProjectImages({ projectId }: Props) {
  const supabase = createClient();
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const { data } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index');
    setImages(data ?? []);
  }

  useEffect(() => { load(); }, [projectId]);

  async function uploadFiles(files: File[]) {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;
    setUploading(true);

    let successCount = 0;
    for (const file of imageFiles) {
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `${projectId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(path, file, { contentType: file.type });

      if (uploadError) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(path);

      const { error: dbError } = await supabase.from('project_images').insert({
        project_id: projectId,
        url: publicUrl,
        storage_path: path,
        order_index: images.length + successCount,
      });

      if (!dbError) successCount++;
    }

    await load();
    setUploading(false);
    if (successCount > 0) toast.success(`${successCount} image${successCount > 1 ? 's' : ''} uploaded!`);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleDelete(image: ProjectImage) {
    setDeleting(image.id);
    if (image.storage_path) {
      await supabase.storage.from('project-images').remove([image.storage_path]);
    }
    await supabase.from('project_images').delete().eq('id', image.id);
    await load();
    setDeleting(null);
    toast.success('Image removed.');
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    uploadFiles(files);
  }

  return (
    <div className="pt-4 border-t mt-4" style={{ borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-[#636366] uppercase tracking-wider">Project Images</p>
          <p className="text-[10px] text-[#8E8E93] mt-0.5">
            {images.length === 0
              ? 'No images yet — add screenshots or mockups'
              : `${images.length} image${images.length !== 1 ? 's' : ''} — visitors can view in a gallery`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#007AFF] hover:opacity-70 disabled:opacity-40 transition-opacity"
        >
          {uploading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Upload className="w-3.5 h-3.5" />
          }
          {uploading ? 'Uploading…' : 'Upload Photos'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => uploadFiles(Array.from(e.target.files ?? []))}
        />
      </div>

      {/* Drop zone (empty state) */}
      {images.length === 0 && (
        <div
          className="rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer"
          style={{ borderColor: dragOver ? '#007AFF' : 'var(--border)', background: dragOver ? 'rgba(0,122,255,0.04)' : 'transparent' }}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="w-10 h-10 rounded-xl bg-[#F2F2F7] flex items-center justify-center mx-auto mb-3">
            <ImageIcon className="w-5 h-5 text-[#C7C7CC]" />
          </div>
          <p className="text-sm font-medium text-[#8E8E93]">Click or drag images here</p>
          <p className="text-xs text-[#C7C7CC] mt-1">JPG, PNG, WebP supported</p>
        </div>
      )}

      {/* Image grid */}
      {images.length > 0 && (
        <div
          className="rounded-xl border-2 border-dashed p-3 transition-colors"
          style={{ borderColor: dragOver ? '#007AFF' : 'transparent', background: dragOver ? 'rgba(0,122,255,0.04)' : 'transparent' }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, i) => (
              <div
                key={img.id}
                className="relative group aspect-square rounded-xl overflow-hidden bg-[#F2F2F7]"
                style={{ border: '1px solid var(--border)' }}
              >
                {/* Image */}
                <img
                  src={img.url}
                  alt={`Image ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleDelete(img)}
                    disabled={deleting === img.id}
                    className="w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 disabled:bg-black/40"
                  >
                    {deleting === img.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <X className="w-3.5 h-3.5" />
                    }
                  </button>
                </div>
                {/* Order badge */}
                <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-md bg-black/50 flex items-center justify-center">
                  <span className="text-[9px] text-white font-bold">{i + 1}</span>
                </div>
              </div>
            ))}

            {/* Add more button */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors hover:bg-[#F2F2F7] disabled:opacity-50"
              style={{ borderColor: 'var(--border)' }}
            >
              {uploading
                ? <Loader2 className="w-5 h-5 text-[#C7C7CC] animate-spin" />
                : <Upload className="w-5 h-5 text-[#C7C7CC]" />
              }
              <span className="text-[10px] text-[#C7C7CC] font-medium">Add</span>
            </button>
          </div>

          <p className="text-[10px] text-[#C7C7CC] mt-2 text-center">
            Drag & drop more images here or click Add
          </p>
        </div>
      )}
    </div>
  );
}
