'use client';

import { ArrowUpRight, Star } from 'lucide-react';

const testimonials = [
  { quote: 'BTE streamlined our dual-entity formation in under a week. The privacy protections and compliance guardrails gave our board the confidence to move forward with a seven-figure allocation.', name: 'Marcus Chen', title: 'CFO, Digital Frontier Capital', initials: 'MC', rating: 5 },
  { quote: 'The multi-signature custody setup was seamless. We went from concept to fully operational treasury management in record time — something that took our previous provider months.', name: 'Sarah Okafor', title: 'Head of Operations, NexGen DAO', initials: 'SO', rating: 5 },
  { quote: 'I needed a platform that understood both the technical and regulatory landscape of crypto mining. BTE was the only one that delivered end to end without compromises.', name: 'James Whitfield', title: 'Founder, Cascade Mining Co.', initials: 'JW', rating: 5 },
  { quote: 'The copy-trading platform combines institutional-grade execution with a transparency layer I have not seen anywhere else. Our LPs love the real-time reporting.', name: 'Anika Patel', title: 'Portfolio Manager, Horizon Fund', initials: 'AP', rating: 5 },
  { quote: 'Wyoming DAO LLC formation through BTE gave us the legal clarity we needed while preserving our decentralized governance. A game changer for on-chain organizations.', name: 'David Kim', title: 'Co-founder, MetaVault Protocol', initials: 'DK', rating: 5 },
  { quote: 'Our family office manages significant digital asset holdings across multiple chains. BTE is the only platform that meets our fiduciary standards without sacrificing flexibility.', name: 'Elizabeth Harmon', title: 'Managing Director, Harmon Family Office', initials: 'EH', rating: 5 },
];

const caseStudies = [
  { title: 'Institutional Fund Formation', summary: 'A mid-market crypto fund used BTE to establish a dual-entity Wyoming structure, enabling compliant custody of $42M in digital assets across multiple chains.', metric: '$42M AUM structured', color: 'mint' as const },
  { title: 'DAO-to-LLC Transition', summary: 'A 2,400-member DAO transitioned to a Wyoming DAO LLC through BTE, preserving token-based voting while gaining liability protection and banking access.', metric: '2,400 members onboarded', color: 'blue' as const },
  { title: 'Mining Operation Optimization', summary: 'A North American mining operation used BTE to restructure across three jurisdictions, reducing effective tax burden and streamlining compliance reporting.', metric: '34% cost reduction', color: 'gold' as const },
];

export default function Testimonials() {
  return (
    <>
      <section className="testimonials-section">
        <div className="testimonials-heading">
          <p className="eyebrow"><span className="eyebrow-line" />CLIENT TESTIMONIALS</p>
          <h2>Trusted by institutions and founders alike.</h2>
          <p className="subtitle">See what our clients say about working with Blockchain Trust Enterprise.</p>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((t) => (
            <div className="testimonial-card" key={t.name}>
              <div className="testimonial-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} fill={i < t.rating ? '#0fa987' : 'none'} color={i < t.rating ? '#0fa987' : '#bdd0d8'} />
                ))}
              </div>
              <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initials}</div>
                <div>
                  <strong>{t.name}</strong>
                  <small>{t.title}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="case-studies-section">
        <div className="testimonials-heading">
          <p className="eyebrow"><span className="eyebrow-line" />CASE STUDIES</p>
          <h2>Real outcomes, real impact.</h2>
          <p className="subtitle">How leading organizations leveraged BTE for institutional-grade structuring.</p>
        </div>
        <div className="case-study-grid">
          {caseStudies.map((cs) => (
            <div className={`case-study-card case-study-${cs.color}`} key={cs.title}>
              <h3>{cs.title}</h3>
              <p>{cs.summary}</p>
              <div className="case-study-metric">{cs.metric}</div>
              <button className="case-study-link">Read full case study <ArrowUpRight size={14} /></button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
