import { useState, useEffect } from 'react';
import { FiMail, FiPhone, FiClock, FiChevronDown, FiChevronUp, FiTrash2, FiFilter } from 'react-icons/fi';
import { contactAPI } from '../../api';
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['new', 'read', 'replied', 'archived'];
const STATUS_COLORS = {
  new:      'bg-blue-100 text-blue-700 border-blue-200',
  read:     'bg-gray-100 text-gray-600 border-gray-200',
  replied:  'bg-green-100 text-green-700 border-green-200',
  archived: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};
const STATUS_LABELS = {
  new: '🔵 New', read: '⚪ Read', replied: '🟢 Replied', archived: '🟡 Archived',
};

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [noteEdit, setNoteEdit] = useState({});
  const [deleting, setDeleting] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState([]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await contactAPI.getAll(params);
      setContacts(res.data.data);
      setPagination({ total: res.data.total, pages: res.data.pages });
      setStats(res.data.stats || []);
    } catch {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, [page, statusFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      await contactAPI.update(id, { status });
      setContacts((prev) =>
        prev.map((c) => c._id === id ? { ...c, status } : c)
      );
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleSaveNote = async (id) => {
    const adminNotes = noteEdit[id] ?? '';
    try {
      await contactAPI.update(id, { adminNotes });
      setContacts((prev) =>
        prev.map((c) => c._id === id ? { ...c, adminNotes } : c)
      );
      toast.success('Note saved');
    } catch {
      toast.error('Failed to save note');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete contact from "${name}"?`)) return;
    setDeleting(id);
    try {
      await contactAPI.delete(id);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      toast.success('Contact deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const getStatCount = (status) =>
    stats.find((s) => s._id === status)?.count || 0;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-dark">Contact Messages</h1>
        <p className="text-gray-500 text-sm mt-0.5">{pagination.total} total enquiries</p>
      </div>

      {/* Stats pills */}
      <div className="flex flex-wrap gap-3">
        {[
          { key: 'all', label: 'All', count: pagination.total },
          ...STATUS_OPTIONS.map((s) => ({ key: s, label: STATUS_LABELS[s], count: getStatCount(s) })),
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => { setStatusFilter(key); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              statusFilter === key
                ? 'bg-gold-400 text-dark shadow-gold'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              statusFilter === key ? 'bg-dark/20 text-dark' : 'bg-gray-100 text-gray-600'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse h-24">
              <div className="h-4 skeleton rounded mb-2 w-1/3" />
              <div className="h-3 skeleton rounded w-2/3" />
            </div>
          ))
        ) : contacts.length === 0 ? (
          <div className="card p-16 text-center">
            <FiMail className="text-5xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-display font-bold text-dark mb-2">No messages found</h3>
            <p className="text-gray-500">Contact form submissions will appear here.</p>
          </div>
        ) : (
          contacts.map((contact) => {
            const isOpen = expanded === contact._id;
            return (
              <div key={contact._id} className="card overflow-hidden">
                {/* Header row */}
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50
                             transition-colors"
                  onClick={() => {
                    setExpanded(isOpen ? null : contact._id);
                    if (!isOpen && contact.status === 'new') {
                      handleStatusChange(contact._id, 'read');
                    }
                  }}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-primary-500/10 rounded-full flex items-center
                                  justify-center text-primary-500 font-bold flex-shrink-0">
                    {contact.name?.[0]?.toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-dark text-sm">{contact.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium
                                        ${STATUS_COLORS[contact.status]}`}>
                        {contact.status}
                      </span>
                      {contact.service && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {contact.service}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5 truncate">
                      {contact.email}
                      {contact.phone && ` · ${contact.phone}`}
                    </p>
                  </div>

                  {/* Date + expand */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <FiClock size={11} />
                      {formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true })}
                    </p>
                    {isOpen ? (
                      <FiChevronUp className="text-gray-400 ml-auto mt-1" />
                    ) : (
                      <FiChevronDown className="text-gray-400 ml-auto mt-1" />
                    )}
                  </div>
                </div>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-4">
                    {/* Message */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                        Message
                      </p>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {contact.message}
                      </p>
                    </div>

                    {/* Contact details */}
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                      >
                        <FiMail size={14} /> {contact.email}
                      </a>
                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex items-center gap-2 text-sm text-green-600 hover:underline"
                        >
                          <FiPhone size={14} /> {contact.phone}
                        </a>
                      )}
                      <span className="text-xs text-gray-400">
                        Received: {format(new Date(contact.createdAt), 'MMM d, yyyy · h:mm a')}
                      </span>
                    </div>

                    {/* Admin notes */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                        Admin Notes
                      </label>
                      <textarea
                        value={noteEdit[contact._id] ?? contact.adminNotes ?? ''}
                        onChange={(e) =>
                          setNoteEdit((prev) => ({ ...prev, [contact._id]: e.target.value }))
                        }
                        placeholder="Add internal notes about this contact..."
                        rows={2}
                        className="form-input text-sm resize-none"
                      />
                      <button
                        onClick={() => handleSaveNote(contact._id)}
                        className="mt-1.5 text-xs text-gold-600 font-medium hover:underline"
                      >
                        Save Note →
                      </button>
                    </div>

                    {/* Actions row */}
                    <div className="flex items-center justify-between flex-wrap gap-3 pt-2
                                    border-t border-gray-100">
                      {/* Status changer */}
                      <div className="flex items-center gap-2">
                        <FiFilter className="text-gray-400 text-sm" />
                        <span className="text-xs text-gray-500">Mark as:</span>
                        <div className="flex gap-1.5">
                          {STATUS_OPTIONS.filter((s) => s !== contact.status).map((s) => (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(contact._id, s)}
                              className="text-xs px-2.5 py-1 border border-gray-200 rounded-full
                                         hover:border-gold-400 hover:text-gold-600 transition-colors capitalize"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quick reply + delete */}
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${contact.email}?subject=Re: Your enquiry at Kurtuba Locksmith`}
                          className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600
                                     px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                          onClick={() => handleStatusChange(contact._id, 'replied')}
                        >
                          <FiMail size={12} /> Reply via Email
                        </a>
                        <button
                          onClick={() => handleDelete(contact._id, contact.name)}
                          disabled={deleting === contact._id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50
                                     rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deleting === contact._id ? (
                            <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FiTrash2 size={15} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40
                       hover:border-gold-400 transition-colors"
          >
            ← Prev
          </button>
          <span className="px-4 py-2 text-sm bg-gold-400 text-dark rounded-lg font-medium">
            {page} / {pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40
                       hover:border-gold-400 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
