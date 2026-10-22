import React, { useEffect, useState } from 'react';
import { Bell, Plus, Edit, Trash2, X, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Notice } from '../../types';
import { api } from '../../services/api';

export const NoticesPage: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    content: '',
    priority: 'NORMAL',
    targetRole: 'ALL',
    isPublished: true,
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await api.getNotices();
      if (res.success) setNotices(res.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res;
      if (editingId) {
        res = await api.updateNotice(editingId, form);
      } else {
        res = await api.createNotice(form);
      }

      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        setShowModal(false);
        setEditingId(null);
        setForm({
          title: '',
          content: '',
          priority: 'NORMAL',
          targetRole: 'ALL',
          isPublished: true,
        });
        fetchNotices();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Operation failed' });
    }
  };

  const handleEdit = (n: Notice) => {
    setEditingId(n.id);
    setForm({
      title: n.title,
      content: n.content,
      priority: n.priority,
      targetRole: n.targetRole,
      isPublished: n.isPublished,
    });
    setShowModal(true);
  };

  const handleDelete = async (n: Notice) => {
    if (!window.confirm(`Delete notice "${n.title}"?`)) return;
    try {
      const res = await api.deleteNotice(n.id);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        fetchNotices();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Delete failed' });
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white uppercase tracking-wider">
            Notices & Events Board
          </h2>
          <p className="text-xs text-[#888888] mt-0.5">
            Publish member news, holiday hours, workshops, and coaching alerts.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setForm({
              title: '',
              content: '',
              priority: 'NORMAL',
              targetRole: 'ALL',
              isPublished: true,
            });
            setShowModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-red-900/30 uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>Post Announcement</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-lg text-xs flex items-center justify-between border ${
            message.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
              : 'bg-red-950/70 border-red-800 text-red-300'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map((n) => (
          <div key={n.id} className="gym-card p-6 bg-[#141414] border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    n.priority === 'URGENT'
                      ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                      : n.priority === 'HIGH'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-blue-950 text-blue-400 border border-blue-800'
                  }`}
                >
                  {n.priority}
                </span>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#222222] text-[#CCCCCC]">
                  Target: {n.targetRole}
                </span>

                <span className="text-[11px] text-[#777777] font-mono">
                  {new Date(n.publishedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>

                <span className="text-[11px] text-emerald-400 font-semibold">
                  {n.isPublished ? '● Published' : '○ Draft'}
                </span>
              </div>

              <h3 className="text-lg font-bold font-heading text-white">{n.title}</h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">{n.content}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#222222]">
              <button
                onClick={() => handleEdit(n)}
                className="px-3 py-1.5 bg-[#222222] hover:bg-[#333333] text-white rounded text-xs flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(n)}
                className="px-3 py-1.5 bg-[#222222] hover:bg-red-900/40 text-white rounded text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-xl max-w-md w-full p-6 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
              <h3 className="font-heading font-bold text-lg uppercase">
                {editingId ? 'Edit Announcement' : 'Post New Announcement'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-[#888888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  placeholder="e.g. Special Holiday Hours / New Machines"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  >
                    <option value="LOW">LOW</option>
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Target Audience</label>
                  <select
                    value={form.targetRole}
                    onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  >
                    <option value="ALL">ALL (Public & Members)</option>
                    <option value="MEMBER">MEMBERS ONLY</option>
                    <option value="TRAINER">COACHING STAFF ONLY</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Content *</label>
                <textarea
                  rows={4}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white resize-none"
                  placeholder="Detailed announcement text..."
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pubCheck"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="rounded text-[#E50914] focus:ring-0"
                />
                <label htmlFor="pubCheck" className="text-white">
                  Publish Immediately
                </label>
              </div>

              <div className="pt-3 border-t border-[#242424] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[#222222] text-[#888888] hover:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E50914] hover:bg-red-700 text-white font-bold rounded"
                >
                  Save Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
