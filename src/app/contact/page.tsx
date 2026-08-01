'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    clientType: '',
    holdings: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Nav */}
      <nav className="bg-[#0A1628] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#00D4AA] rounded-lg flex items-center justify-center">
                <span className="text-[#0A1628] font-black text-sm">BTE</span>
              </div>
              <span className="font-bold text-white text-lg">Blockchain Trust Enterprise</span>
            </Link>
            <Link href="/" className="text-sm text-slate-300 hover:text-white transition-colors">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-[#00D4AA]/10 text-[#00D4AA] px-3 py-1 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-[#00D4AA] rounded-full"></span>
              Get Started
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0A1628] leading-tight">
              Start Your{' '}
              <span className="bg-gradient-to-r from-[#00D4AA] to-[#0052FF] bg-clip-text text-transparent">
                Entity Formation
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Schedule a free structural assessment with our team. We&apos;ll determine the optimal
              entity type, jurisdiction, and governance setup for your specific situation.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0052FF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#0052FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#0A1628]">Email Us</h3>
                  <p className="text-slate-600 mt-1">contact@blockchaintrust.enterprise</p>
                  <p className="text-sm text-slate-500 mt-1">We respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#00D4AA]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#00D4AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#0A1628]">Call Us</h3>
                  <p className="text-slate-600 mt-1">+1 (307) 555-0199</p>
                  <p className="text-sm text-slate-500 mt-1">Mon-Fri, 9am-6pm EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#0A1628]">Headquarters</h3>
                  <p className="text-slate-600 mt-1">Cheyenne, Wyoming, USA</p>
                  <p className="text-sm text-slate-500 mt-1">Primary jurisdiction for privacy-forward LLC formation</p>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-[#0A1628] rounded-2xl">
              <h3 className="font-semibold text-white mb-3">What Happens Next?</h3>
              <div className="space-y-3">
                {[
                  'We review your submission within 24 hours',
                  'A dedicated advisor schedules a discovery call',
                  'We provide a custom structural recommendation',
                  'Entity formation begins upon your approval',
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-[#00D4AA] rounded-full flex items-center justify-center text-[#0A1628] text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-300">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {submitted ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-[#00D4AA]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-[#00D4AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#0A1628]">Thank You!</h2>
                <p className="mt-3 text-slate-600">
                  Your assessment request has been received. Our team will reach out within 24 hours
                  to schedule your discovery call.
                </p>
                <Link href="/" className="mt-8 inline-block bg-[#0A1628] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#132039] transition-colors">
                  Back to Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8">
                <h2 className="text-xl font-bold text-[#0A1628] mb-6">Free Structural Assessment</h2>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0052FF] focus:border-[#0052FF] outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0052FF] focus:border-[#0052FF] outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Company / Organization</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0052FF] focus:border-[#0052FF] outline-none transition-all"
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Client Type *</label>
                    <select
                      name="clientType"
                      value={formData.clientType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0052FF] focus:border-[#0052FF] outline-none transition-all"
                    >
                      <option value="">Select your profile...</option>
                      <option value="hnw_investor">HNW Crypto Investor / Trader</option>
                      <option value="web3_founder">Web3 Founder</option>
                      <option value="dao_member">DAO Member</option>
                      <option value="crypto_miner">Crypto Miner</option>
                      <option value="staking_operator">Staking Operator</option>
                      <option value="institutional">Institutional Fund</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Estimated Digital Asset Holdings</label>
                    <select
                      name="holdings"
                      value={formData.holdings}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0052FF] focus:border-[#0052FF] outline-none transition-all"
                    >
                      <option value="">Select range...</option>
                      <option value="100k-500k">$100K - $500K</option>
                      <option value="500k-1m">$500K - $1M</option>
                      <option value="1m-5m">$1M - $5M</option>
                      <option value="5m-25m">$5M - $25M</option>
                      <option value="25m+">$25M+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tell Us About Your Needs</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0052FF] focus:border-[#0052FF] outline-none transition-all resize-none"
                      placeholder="Describe your current situation and what you're looking to achieve..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#00D4AA] text-[#0A1628] py-3 rounded-xl font-semibold hover:bg-[#00E4BA] transition-colors text-sm"
                  >
                    Request Free Assessment
                  </button>

                  <p className="text-xs text-slate-500 text-center">
                    By submitting, you agree to our privacy policy. We never share your information.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0A1628] border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#00D4AA] rounded-lg flex items-center justify-center">
                <span className="text-[#0A1628] font-black text-xs">BTE</span>
              </div>
              <span className="font-bold text-white">Blockchain Trust Enterprise</span>
            </div>
            <p className="text-sm text-slate-500">
              &copy; 2026 Blockchain Trust Enterprise. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
