'use client';

import { useState, useEffect } from 'react';

interface Document {
  id: string;
  client_id: string;
  entity_id: string;
  doc_type: string;
  name: string;
  raw_markdown_content: string | null;
  download_url_token: string;
  status: string;
  downloaded_at: string | null;
  submitted_at: string | null;
  created_at: string;
  client_name?: string;
  entity_name?: string;
}

const docTypeLabels: Record<string, string> = {
  articles_of_organization: 'Articles of Organization',
  operating_agreement: 'Operating Agreement',
  ein_letter: 'EIN Letter',
  subscription_agreement: 'Subscription Agreement',
  corporate_tree: 'Corporate Tree',
  board_resolution: 'Board Resolution',
  tax_return: 'Tax Return',
  annual_report: 'Annual Report',
  resolution: 'Resolution',
  trust_deed: 'Trust Deed',
  other: 'Other',
};

const docTypeIcons: Record<string, React.ReactNode> = {
  operating_agreement: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  subscription_agreement: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  corporate_tree: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="6" rx="1" /><rect x="1" y="16" width="8" height="6" rx="1" /><rect x="15" y="16" width="8" height="6" rx="1" />
      <line x1="12" y1="8" x2="12" y2="13" /><line x1="5" y1="13" x2="19" y2="13" /><line x1="5" y1="13" x2="5" y2="16" /><line x1="19" y1="13" x2="19" y2="16" />
    </svg>
  ),
  articles_of_organization: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M9 15l2 2 4-4" />
    </svg>
  ),
};

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  generated: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Generated' },
  draft: { bg: '#F1F5F9', text: '#64748B', label: 'Draft' },
  downloaded: { bg: '#FEF3C7', text: '#B45309', label: 'Downloaded' },
  pending_review: { bg: '#FED7AA', text: '#C2410C', label: 'Pending Review' },
  submitted: { bg: '#E0E7FF', text: '#4338CA', label: 'Submitted' },
  signed: { bg: '#DCFCE7', text: '#15803D', label: 'Signed' },
  verified: { bg: '#D1FAE5', text: '#065F46', label: 'Verified' },
  filed: { bg: '#ECFDF5', text: '#047857', label: 'Filed' },
  archived: { bg: '#F1F5F9', text: '#475569', label: 'Archived' },
};

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filter, setFilter] = useState('all');
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  useEffect(() => {
    fetch('/api/documents').then((r) => r.json()).then(setDocuments);
  }, []);

  const filtered = filter === 'all' ? documents : documents.filter((d) => d.doc_type === filter);

  const summaryCards = [
    { label: 'Total Documents', value: documents.length.toString(), color: '#0052FF' },
    { label: 'Generated', value: documents.filter((d) => d.status === 'generated').length.toString(), color: '#00D4AA' },
    { label: 'Awaiting Signature', value: documents.filter((d) => ['downloaded', 'pending_review'].includes(d.status)).length.toString(), color: '#F59E0B' },
    { label: 'Verified', value: documents.filter((d) => ['signed', 'verified', 'filed'].includes(d.status)).length.toString(), color: '#15803D' },
  ];

  async function handleStatusUpdate(docId: string, newStatus: string) {
    await fetch('/api/documents', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: docId, status: newStatus }),
    });
    setDocuments((docs) => docs.map((d) => d.id === docId ? { ...d, status: newStatus } : d));
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Document Management</h1>
        <p className="text-slate-500 text-sm mt-1">Generated legal documents, download tracking, and signed re-submission pipeline.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-5" style={{ border: '1px solid #E2E8F0', borderLeft: `4px solid ${card.color}` }}>
            <div className="text-sm text-slate-500">{card.label}</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'operating_agreement', 'subscription_agreement', 'articles_of_organization', 'corporate_tree'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={
              filter === type
                ? { backgroundColor: '#0A1628', color: '#FFFFFF' }
                : { backgroundColor: '#F1F5F9', color: '#64748B' }
            }
          >
            {type === 'all' ? 'All Documents' : docTypeLabels[type]}
          </button>
        ))}
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Document</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Entity</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => {
                const ss = statusStyles[doc.status] || { bg: '#F1F5F9', text: '#475569', label: doc.status };
                const icon = docTypeIcons[doc.doc_type] || docTypeIcons.operating_agreement;
                return (
                  <tr key={doc.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(0,82,255,0.1)', color: '#0052FF' }}>
                          {icon}
                        </span>
                        <div>
                          <div className="font-medium text-slate-900 text-sm">{doc.name}</div>
                          {doc.client_name && <div className="text-xs text-slate-500">{doc.client_name}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">{docTypeLabels[doc.doc_type] || doc.doc_type}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">{doc.entity_name || '-'}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: ss.bg, color: ss.text }}>{ss.label}</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">{new Date(doc.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {doc.raw_markdown_content && (
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="text-xs px-2.5 py-1 rounded-lg font-medium transition-colors"
                            style={{ backgroundColor: 'rgba(0,82,255,0.1)', color: '#0052FF' }}
                          >
                            Preview
                          </button>
                        )}
                        {doc.download_url_token && doc.raw_markdown_content && (
                          <a
                            href={`/api/documents/download/${doc.download_url_token}`}
                            className="text-xs px-2.5 py-1 rounded-lg font-medium transition-colors"
                            style={{ backgroundColor: 'rgba(0,212,170,0.1)', color: '#00A080' }}
                          >
                            Download
                          </a>
                        )}
                        {doc.status === 'submitted' && (
                          <button
                            onClick={() => handleStatusUpdate(doc.id, 'verified')}
                            className="text-xs px-2.5 py-1 rounded-lg font-medium transition-colors"
                            style={{ backgroundColor: 'rgba(21,128,61,0.1)', color: '#15803D' }}
                          >
                            Verify
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">No documents found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h3 className="font-semibold text-slate-900">{previewDoc.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{docTypeLabels[previewDoc.doc_type]}</p>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 leading-relaxed">{previewDoc.raw_markdown_content}</pre>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3">
              {previewDoc.download_url_token && (
                <a
                  href={`/api/documents/download/${previewDoc.download_url_token}`}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: '#00D4AA' }}
                >
                  Download .md
                </a>
              )}
              <button onClick={() => setPreviewDoc(null)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
