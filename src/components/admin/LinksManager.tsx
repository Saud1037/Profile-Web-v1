"use client";

import { useState } from "react";
import { SocialLink } from "@/types";
import { IconDisplay, IconPicker } from "./IconPicker";
import {
  Plus, Trash2, GripVertical,
  ChevronUp, ChevronDown, Check, X,
} from "lucide-react";

interface LinksManagerProps {
  links: SocialLink[];
  onChange: (links: SocialLink[]) => void;
}

const EMPTY: Omit<SocialLink, "id" | "order"> = { title: "", url: "", icon: "Link" };

export function LinksManager({ links, onChange }: LinksManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState(EMPTY);
  const [addingNew, setAddingNew] = useState(false);
  const [newLink, setNewLink] = useState(EMPTY);

  const sorted = [...links].sort((a, b) => a.order - b.order);

  const handleMove = (id: string, dir: "up" | "down") => {
    const idx = sorted.findIndex((l) => l.id === id);
    const target = dir === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= sorted.length) return;
    onChange(sorted.map((l, i) => {
      if (i === idx) return { ...l, order: sorted[target].order };
      if (i === target) return { ...l, order: sorted[idx].order };
      return l;
    }));
  };

  const handleDelete = (id: string) => onChange(links.filter((l) => l.id !== id));

  const handleSaveEdit = (id: string) => {
    onChange(links.map((l) => (l.id === id ? { ...l, ...editData } : l)));
    setEditingId(null);
  };

  const handleAddNew = () => {
    if (!newLink.title || !newLink.url) return;
    onChange([...links, { ...newLink, id: Date.now().toString(), order: links.length }]);
    setNewLink(EMPTY);
    setAddingNew(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium opacity-60 uppercase tracking-wider">
          الروابط ({links.length})
        </label>
        <button onClick={() => setAddingNew(true)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: "rgba(99,102,241,0.2)", color: "#6366f1" }}>
          <Plus size={12} /> إضافة رابط
        </button>
      </div>

      {addingNew && (
        <LinkForm data={newLink} onChange={setNewLink}
          onSave={handleAddNew} onCancel={() => { setAddingNew(false); setNewLink(EMPTY); }}
          saveLabel="إضافة" />
      )}

      <div className="flex flex-col gap-2">
        {sorted.map((link, idx) => (
          <div key={link.id}>
            {editingId === link.id ? (
              <LinkForm data={editData} onChange={setEditData}
                onSave={() => handleSaveEdit(link.id)} onCancel={() => setEditingId(null)}
                saveLabel="حفظ" />
            ) : (
              <div
                className="glass-card flex items-center gap-3 px-3 py-3 cursor-pointer group"
                onClick={() => { setEditingId(link.id); setEditData({ title: link.title, url: link.url, icon: link.icon }); }}
              >
                <GripVertical size={14} className="opacity-30 flex-shrink-0" />
                <span className="w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.08)" }}>
                  <IconDisplay icon={link.icon} size={16} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{link.title}</p>
                  <p className="text-xs opacity-40 truncate">{link.url}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded hover:bg-white/10 transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleMove(link.id, "up"); }} disabled={idx === 0}>
                    <ChevronUp size={12} />
                  </button>
                  <button className="p-1.5 rounded hover:bg-white/10 transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleMove(link.id, "down"); }} disabled={idx === sorted.length - 1}>
                    <ChevronDown size={12} />
                  </button>
                  <button className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleDelete(link.id); }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {links.length === 0 && !addingNew && (
        <p className="text-center opacity-30 text-xs py-6">لا توجد روابط — أضف رابطاً أعلاه</p>
      )}
    </div>
  );
}

/* ── Link form ── */
function LinkForm({
  data, onChange, onSave, onCancel, saveLabel,
}: {
  data: Omit<SocialLink, "id" | "order">;
  onChange: (d: Omit<SocialLink, "id" | "order">) => void;
  onSave: () => void;
  onCancel: () => void;
  saveLabel: string;
}) {
  const [showIconPicker, setShowIconPicker] = useState(false);

  return (
    <div className="glass-card p-4 flex flex-col gap-3 border border-white/20">
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
          placeholder="العنوان (مثل: GitHub)"
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

      <input
        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
        placeholder="الرابط (https://...)"
        value={data.url}
        onChange={(e) => onChange({ ...data, url: e.target.value })}
        dir="ltr"
      />

      <div className="flex gap-2">
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
