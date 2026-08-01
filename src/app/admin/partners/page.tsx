'use client';

import { useEffect, useState } from 'react';

interface Partner {
  id: string;
  name: string;
  partner_type: string;
  description: string;
  website: string;
  contact_email: string;
  specialties: string;
  status: string;
  integration_type: string;
}

const typeLabels: Record<string, string> = {
  attorney: 'Attorney',
  cpa: 'CPA / Tax',
  registered_agent: 'Registered Agent',
  exchange: 'Exchange',
  accounting_software: 'Accounting Software',
  custodian: 'Custodian',
};

const typeColors: Record<string, { bg: string; text: string }> = {
  attorney: { bg: '#EEF2FF', text: '#4338CA' },
  cpa: { bg: 'rgba(0,212,170,0.1)', text: '#00A080' },
  registered_agent: { bg: '#DBEAFE', text: '#1D4ED8' },
  exchange: { bg: '#F3E8FF', text: '#7C3AED' },
  accounting_software: { bg: '#FEF3C7', text: '#B45309' },
  custodian: { bg: '#DCFCE7', text: '#15803D' },
};

const statusStyles: Record<string, { bg: string; text: string }> = {
  active: { bg: '#DCFCE7', text: '#15803D' },
  preferred: { bg: '#DBEAFE', text: '#1D4ED8' },
  inactive: { bg: '#F1F5F9', text: '#64748B' },
};

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetch('/api/partners')
      .then((r) => r.json())
      .then((data: Partner[]) => {
        setPartners(
          data.map((p) => ({
            ...p,
            specialties: typeof p.specialties === 'string' ? p.specialties : JSON.stringify(p.specialties),
          }))
        );
      });
  }, []);

  const filtered = filterType ? partners.filter((p) => p.partner_type === filterType) : partners;

  const grouped = filtered.reduce(
    (acc, p) => {
      if (!acc[p.partner_type]) acc[p.partner_type] = [];
      acc[p.partner_type].push(p);
      return acc;
    },
    {} as Record<string, Partner[]>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Partner Network</h1>
          <p className="text-slate-500 text-sm mt-1">{partners.length} active partners</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterType('')}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={
            !filterType
              ? { backgroundColor: '#0A1628', color: '#FFFFFF' }
              : { backgroundColor: '#F1F5F9', color: '#64748B' }
          }
          onMouseEnter={(e) => { if (filterType) e.currentTarget.style.backgroundColor = '#E2E8F0'; }}
          onMouseLeave={(e) => { if (filterType) e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
        >
          All
        </button>
        {Object.entries(typeLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilterType(key)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={
              filterType === key
                ? { backgroundColor: '#0A1628', color: '#FFFFFF' }
                : { backgroundColor: '#F1F5F9', color: '#64748B' }
            }
            onMouseEnter={(e) => { if (filterType !== key) e.currentTarget.style.backgroundColor = '#E2E8F0'; }}
            onMouseLeave={(e) => { if (filterType !== key) e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Partners by Type */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([type, items]) => {
          const tc = typeColors[type] || { bg: '#F1F5F9', text: '#475569' };
          return (
            <div key={type}>
              <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: tc.bg, color: tc.text }}
                >
                  {items.length}
                </span>
                {typeLabels[type] || type}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((partner) => {
                  let specialties: string[] = [];
                  try {
                    specialties = JSON.parse(partner.specialties);
                  } catch {
                    specialties = [];
                  }
                  const ss = statusStyles[partner.status] || { bg: '#F1F5F9', text: '#64748B' };

                  return (
                    <div key={partner.id} className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-slate-900">{partner.name}</h3>
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: ss.bg, color: ss.text }}
                        >
                          {partner.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed mb-3">{partner.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {specialties.map((s) => (
                          <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                      {partner.integration_type && (
                        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00D4AA' }} />
                          Integration: <span className="font-medium">{partner.integration_type}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
