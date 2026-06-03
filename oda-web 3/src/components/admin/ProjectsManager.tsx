"use client";

import { useState, useRef } from "react";
import { Project } from "@/types";
import { IconDisplay, IconPicker } from "./IconPicker";
import Image from "next/image";
import {
  Plus, Trash2, ChevronUp, ChevronDown,
  Check, X, ImageIcon, GripVertical,
} from "lucide-react";

interface ProjectsManagerProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

const EMPTY: Omit<Project, "id" | "order"> = {
  title: "",
  description: "",
  image: "",
  url: "",
  tags: [],
  icon: "Rocket",
};

export function ProjectsManager({ projects, onChange }: ProjectsManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState(EMPTY);
  const [addingNew, setAddingNew] = useState(false);
  const [newProject, setNewProject] = useState(EMPTY);

  const sorted = [...projects].sort((a, b) => a.order - b.order);

  const handleMove = (id: string, dir: "up" | "down") => {
    const idx = sorted.findIndex((p) => p.id === id);
    const target = dir === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= sorted.length) return;
    onChange(sorted.map((p, i) => {
      if (i === idx) return { ...p, order: sorted[target].order };
      if (i === target) return { ...p, order: sorted[idx].order };
      return p;
    }));
  };

  const handleDelete = (id: string) => onChange(projects.filter((p) => p.id !== id));

  const handleSaveEdit = (id: string) => {
    onChange(projects.map((p) => (p.id === id ? { ...p, ...editData } : p)));
    setEditingId(null);
  };

  const handleAddNew = () => {
    if (!newProject.title) return;
    onChange([...projects, { ...newProject, id: Date.now().toString(), order: projects.length }]);
    setNewProject(EMPTY);
    setAddingNew(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium opacity-60 uppercase tracking-wider">
          المشاريع ({projects.length})
        </label>
        <button
          onClick={() => setAddingNew(true)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: "rgba(99,102,241,0.2)", color: "#6366f1" }}
        >
          <Plus size={12} /> إضافة مشروع
        </button>
      </div>

      {addingNew && (
        <ProjectForm
          data={newProject}
          onChange={setNewProject}
          onSave={handleAddNew}
          onCancel={() => { setAddingNew(false); setNewProject(EMPTY); }}
          saveLabel="إضافة"
        />
      )}

      <div className="flex flex-col gap-2">
        {sorted.map((project, idx) => (
          <div key={project.id}>
            {editingId === project.id ? (
              <ProjectForm
                data={editData}
                onChange={setEditData}
                onSave={() => handleSaveEdit(project.id)}
                onCancel={() => setEditingId(null)}
                saveLabel="حفظ"
              />
            ) : (
              <div
                className="glass-card flex items-center gap-3 px-3 py-3 cursor-pointer group"
                onClick={() => { setEditingId(project.id); setEditData({ title: project.title, description: project.description, image: project.image, url: project.url, tags: project.tags, icon: project.icon }); }}
              >
                <GripVertical size={14} className="opacity-30 flex-shrink-0" />

                {/* Thumbnail or Icon */}
                <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.07)" }}>
                  {project.image ? (
                    <Image src={project.image} alt={project.title} width={36} height={36} className="object-cover w-full h-full" />
                  ) : (
                    <IconDisplay icon={project.icon} size={18} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{project.title}</p>
                  <div className="flex gap-1 mt-0.5 flex-wrap">
                    {project.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-xs px-1.5 py-0.5 rounded-md"
                        style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded hover:bg-white/10 transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleMove(project.id, "up"); }}
                    disabled={idx === 0}>
                    <ChevronUp size={12} />
                  </button>
                  <button className="p-1.5 rounded hover:bg-white/10 transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleMove(project.id, "down"); }}
                    disabled={idx === sorted.length - 1}>
                    <ChevronDown size={12} />
                  </button>
                  <button className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {projects.length === 0 && !addingNew && (
        <p className="text-center opacity-30 text-xs py-6">لا توجد مشاريع — أضف مشروعاً أعلاه</p>
      )}
    </div>
  );
}

/* ── Project form ── */
function ProjectForm({
  data, onChange, onSave, onCancel, saveLabel,
}: {
  data: Omit<Project, "id" | "order">;
  onChange: (d: Omit<Project, "id" | "order">) => void;
  onSave: () => void;
  onCancel: () => void;
  saveLabel: string;
}) {
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);

  const handleImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string")
        onChange({ ...data, image: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !data.tags.includes(t)) onChange({ ...data, tags: [...data.tags, t] });
    setTagInput("");
  };

  const removeTag = (t: string) => onChange({ ...data, tags: data.tags.filter((x) => x !== t) });

  return (
    <div className="glass-card p-4 flex flex-col gap-3 border border-white/20">

      {/* Row: icon + title */}
      <div className="flex items-center gap-2">
        <button
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/15 hover:bg-white/10 transition-colors"
          style={{ background: "rgba(255,255,255,0.06)" }}
          onClick={() => setShowIconPicker((v) => !v)}
          title="اختر أيقونة"
        >
          <IconDisplay icon={data.icon} size={18} />
        </button>
        <input
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
          placeholder="اسم المشروع"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </div>

      {showIconPicker && (
        <IconPicker
          value={data.icon}
          onChange={(ic) => onChange({ ...data, icon: ic })}
          onClose={() => setShowIconPicker(false)}
        />
      )}

      {/* Description */}
      <textarea
        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 resize-none"
        placeholder="وصف قصير للمشروع"
        rows={2}
        value={data.description}
        onChange={(e) => onChange({ ...data, description: e.target.value })}
      />

      {/* URL */}
      <input
        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
        placeholder="رابط المشروع (اختياري)"
        value={data.url}
        onChange={(e) => onChange({ ...data, url: e.target.value })}
        dir="ltr"
      />

      {/* Project image */}
      <div>
        <label className="text-xs opacity-50 mb-1.5 block">صورة المشروع (اختياري)</label>
        <div
          className="relative w-full h-28 rounded-xl border border-dashed border-white/15 overflow-hidden flex items-center justify-center cursor-pointer hover:border-white/30 transition-colors group"
          style={{ background: "rgba(255,255,255,0.03)" }}
          onClick={() => imageRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleImage(f); }}
          onDragOver={(e) => e.preventDefault()}
        >
          {data.image ? (
            <>
              <Image src={data.image} alt="project" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs">تغيير الصورة</span>
              </div>
              <button
                className="absolute top-2 left-2 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); onChange({ ...data, image: "" }); }}
              >
                <X size={11} className="text-white" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-35 group-hover:opacity-60 transition-opacity">
              <ImageIcon size={22} />
              <span className="text-xs">ارفع صورة للمشروع</span>
            </div>
          )}
        </div>
        <input ref={imageRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImage(f); }} />
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <label className="text-xs opacity-50">التقنيات / التاغات</label>
        <div className="flex gap-2">
          <input
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
            placeholder="مثال: Node.js"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
          />
          <button onClick={addTag} className="px-3 py-2 rounded-xl text-xs bg-white/10 hover:bg-white/15 transition-colors">
            إضافة
          </button>
        </div>
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.tags.map((t) => (
              <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs"
                style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}>
                {t}
                <button onClick={() => removeTag(t)} className="opacity-60 hover:opacity-100 transition-opacity">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button onClick={onSave}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
          style={{ background: "#6366f1", color: "white" }}>
          <Check size={12} /> {saveLabel}
        </button>
        <button onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors">
          <X size={12} /> إلغاء
        </button>
      </div>
    </div>
  );
}
