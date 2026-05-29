"use client";

import { useState } from "react";
import { SocialLink } from "@/types";
import { AVAILABLE_ICONS } from "@/lib/constants";
import * as Icons from "lucide-react";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Check,
  X,
} from "lucide-react";

function DynamicIcon({ name, size = 16 }: { name: string; size?: number }) {
  const LucideIcon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
  if (!LucideIcon) return <Icons.Link size={size} />;
  return <LucideIcon size={size} />;
}

interface LinksManagerProps {
  links: SocialLink[];
  onChange: (links: SocialLink[]) => void;
}

const EMPTY_LINK: Omit<SocialLink, "id" | "order"> = {
  title: "",
  url: "",
  icon: "Link",
};

export function LinksManager({ links, onChange }: LinksManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState(EMPTY_LINK);
  const [addingNew, setAddingNew] = useState(false);
  const [newLink, setNewLink] = useState(EMPTY_LINK);
  const [showIconPicker, setShowIconPicker] = useState<string | null>(null);

  const sorted = [...links].sort((a, b) => a.order - b.order);

  const handleMove = (id: string, dir: "up" | "down") => {
    const idx = sorted.findIndex((l) => l.id === id);
    const target = dir === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= sorted.length) return;
    const updated = sorted.map((l, i) => {
      if (i === idx) return { ...l, order: sorted[target].order };
      if (i === target) return { ...l, order: sorted[idx].order };
      return l;
    });
    onChange(updated);
  };

  const handleDelete = (id: string) => {
    onChange(links.filter((l) => l.id !== id));
  };

  const handleSaveEdit = (id: string) => {
    onChange(links.map((l) => (l.id === id ? { ...l, ...editData } : l)));
    setEditingId(null);
  };

  const handleAddNew = () => {
    if (!newLink.title || !newLink.url) return;
    const link: SocialLink = {
      ...newLink,
      id: Date.now().toString(),
      order: links.length,
    };
    onChange([...links, link]);
    setNewLink(EMPTY_LINK);
    setAddingNew(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium opacity-60 uppercase tracking-wider">
          الروابط ({links.length})
        </label>
        <button
          onClick={() => setAddingNew(true)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: "rgba(99,102,241,0.2)", color: "#6366f1" }}
        >
          <Plus size={12} />
          إضافة رابط
        </button>
      </div>

      {/* New link form */}
      {addingNew && (
        <LinkForm
          data={newLink}
          onChange={setNewLink}
          showIconPicker={showIconPicker === "new"}
          onToggleIcons={() =>
            setShowIconPicker(showIconPicker === "new" ? null : "new")
          }
          onSave={handleAddNew}
          onCancel={() => {
            setAddingNew(false);
            setNewLink(EMPTY_LINK);
          }}
          saveLabel="إضافة"
        />
      )}

      {/* Links list */}
      <div className="flex flex-col gap-2">
        {sorted.map((link, idx) => (
          <div key={link.id}>
            {editingId === link.id ? (
              <LinkForm
                data={editData}
                onChange={setEditData}
                showIconPicker={showIconPicker === link.id}
                onToggleIcons={() =>
                  setShowIconPicker(
                    showIconPicker === link.id ? null : link.id
                  )
                }
                onSave={() => handleSaveEdit(link.id)}
                onCancel={() => setEditingId(null)}
                saveLabel="حفظ"
              />
            ) : (
              <div
                className="glass-card flex items-center gap-3 px-3 py-3 cursor-pointer group"
                onClick={() => {
                  setEditingId(link.id);
                  setEditData({
                    title: link.title,
                    url: link.url,
                    icon: link.icon,
                  });
                }}
              >
                <GripVertical size={14} className="opacity-30 flex-shrink-0" />

                <span className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.08)" }}>
                  <DynamicIcon name={link.icon} size={15} />
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{link.title}</p>
                  <p className="text-xs opacity-40 truncate">{link.url}</p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-1.5 rounded hover:bg-white/10 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(link.id, "up");
                    }}
                    disabled={idx === 0}
                  >
                    <ChevronUp size={12} />
                  </button>
                  <button
                    className="p-1.5 rounded hover:bg-white/10 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(link.id, "down");
                    }}
                    disabled={idx === sorted.length - 1}
                  >
                    <ChevronDown size={12} />
                  </button>
                  <button
                    className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(link.id);
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {links.length === 0 && !addingNew && (
        <p className="text-center opacity-30 text-xs py-6">
          لا توجد روابط — أضف رابطاً أعلاه
        </p>
      )}
    </div>
  );
}

/* ── Link form (add / edit) ── */
function LinkForm({
  data,
  onChange,
  showIconPicker,
  onToggleIcons,
  onSave,
  onCancel,
  saveLabel,
}: {
  data: Omit<SocialLink, "id" | "order">;
  onChange: (d: Omit<SocialLink, "id" | "order">) => void;
  showIconPicker: boolean;
  onToggleIcons: () => void;
  onSave: () => void;
  onCancel: () => void;
  saveLabel: string;
}) {
  return (
    <div className="glass-card p-4 flex flex-col gap-3 border border-white/20">
      {/* Icon + Title row */}
      <div className="flex items-center gap-2">
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white border border-white/20 hover:bg-white/10 transition-colors"
          style={{ background: "rgba(255,255,255,0.06)" }}
          onClick={onToggleIcons}
          title="اختر أيقونة"
        >
          <Icons.Link size={16} />
        </button>
        <input
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
          placeholder="العنوان (مثل: GitHub)"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </div>

      {/* Icon picker */}
      {showIconPicker && (
        <div className="grid grid-cols-6 gap-1.5 p-2 rounded-xl bg-white/5">
          {AVAILABLE_ICONS.map((name) => {
            const LucideIcon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
            if (!LucideIcon) return null;
            return (
              <button
                key={name}
                className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
                  data.icon === name ? "bg-indigo-500/40" : "hover:bg-white/10"
                }`}
                title={name}
                onClick={() => onChange({ ...data, icon: name })}
              >
                <LucideIcon size={16} />
              </button>
            );
          })}
        </div>
      )}

      {/* URL */}
      <input
        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
        placeholder="الرابط (https://...)"
        value={data.url}
        onChange={(e) => onChange({ ...data, url: e.target.value })}
        dir="ltr"
      />

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
          style={{ background: "#6366f1", color: "white" }}
        >
          <Check size={12} />
          {saveLabel}
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X size={12} />
          إلغاء
        </button>
      </div>
    </div>
  );
}
