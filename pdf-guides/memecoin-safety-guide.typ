#set page(paper: "a4", margin: (top: 22mm, bottom: 20mm, left: 22mm, right: 22mm), numbering: "1")
#set text(font: "Noto Sans", size: 10.2pt, fill: rgb("173247"))
#set par(justify: true, leading: 0.85em, spacing: 0.65em)
#set heading(numbering: none)
#show heading.where(level: 1): it => block(above: 0pt, below: 10pt)[#text(size: 19pt, weight: "bold", fill: rgb("0a6f72"))[#it.body]]
#show heading.where(level: 2): it => it.body
#let accent = rgb("0fa987")
#let navy = rgb("173247")
#let muted = rgb("66808e")
#let callout(title, body) = block(fill: rgb("eaf6f3"), stroke: (left: 3pt + accent), radius: 5pt, inset: 10pt, width: 100%)[*#title*\\ #body]
#let table-row(a,b) = table.cell(fill: rgb("f2f7f8"))[#a] + table.cell(fill: rgb("f2f7f8"))[#b]
#align(right)[#text(size: 8pt, fill: muted)[BLOCKCHAIN TRUST ENTERPRISE · LEARNING DESK]]

#align(center)[#v(28mm) #text(size: 30pt, weight: "bold", fill: navy)[Memecoins \& Rug-Pull Safety] #v(8mm) #text(size: 13pt, fill: accent)[A practical framework for recognizing hype, testing claims, and limiting irreversible loss] #v(25mm) #line(length: 65%, stroke: 2pt + accent) #v(10mm) #text(size: 10pt, fill: muted)[Blockchain Trust Enterprise · Learning Desk] #v(8mm) #text(size: 9pt, fill: muted)[Educational resource · Version 1.0 · September 2026]]
#pagebreak()
= How to use this guide
Memecoins are highly speculative tokens often driven by culture, attention, and community narratives rather than established cash flows. Some are legitimate experiments; others are designed to extract funds. No checklist can guarantee safety, so the strongest protection is limiting exposure.
#v(8mm)
#callout("Practical note", [Treat every new memecoin as capable of going to zero, becoming unsellable, or being associated with fraud.])
#pagebreak()
= 1 · What makes memecoins different
Memecoin prices can move rapidly on thin liquidity and social momentum. Ownership concentration, automated trading, token mechanics, and influencer attention can dominate price discovery. A large community or viral post is not proof of quality.
#v(8mm)
#callout("Practical note", [Separate popularity from verifiable information about contract control, liquidity, and distribution.])
#pagebreak()
= 2 · Rug pulls and exit scams
A rug pull generally involves insiders or developers removing value, abusing privileged controls, or abandoning a project after attracting buyers. Related scams include honeypots that block selling, fake presales, impersonated launches, and pump-and-dump coordination.
#v(8mm)
#callout("Practical note", [The user’s loss can occur even when the token’s website and social channels look polished.])
#pagebreak()
= 3 · Contract and control checks
Check whether ownership is renounced or governed, whether minting, pausing, blacklisting, fee, and upgrade functions exist, and who can call them. Use multiple independent block explorers and reputable security tools; automated scores are signals, not guarantees.
#v(8mm)
#callout("Practical note", [A renounced contract can still have economic risks such as concentrated holders or weak liquidity.])
#pagebreak()
= 4 · Liquidity and sellability
Review liquidity size, lock or custody claims, unlock dates, pool concentration, trading volume quality, and whether sell transactions succeed for ordinary wallets. A high price with shallow liquidity may be impossible to exit without severe slippage.
#v(8mm)
#callout("Practical note", [Buy-side activity alone does not demonstrate that the market is safely sellable.])
#pagebreak()
= 5 · Holder concentration and insider risk
Inspect top-holder balances, deployer-linked wallets, coordinated transfers, vesting claims, and wallet clusters. Concentration increases the chance that a few sales can overwhelm liquidity. Beware of wallets that appear separate but fund one another.
#v(8mm)
#callout("Practical note", [Do not confuse a high holder count with distributed ownership.])
#pagebreak()
= 6 · Marketing red flags
Warning signs include guaranteed returns, countdown pressure, secret allocations, celebrity endorsements without verification, anonymous teams claiming institutional backing, paid reviews presented as independent research, and requests to disable critical comments.
#v(8mm)
#callout("Practical note", [If the pitch depends on urgency, assume the opportunity cost of waiting is smaller than the cost of rushing.])
#pagebreak()
= 7 · Wallet and transaction safety
Use a separate wallet for experimentation. Never connect a primary wallet to an unknown site. Verify the domain, chain, contract address, approvals, and transaction simulation. Keep funds for fees separate, and revoke approvals after use.
#v(8mm)
#callout("Practical note", [A token airdrop or unsolicited NFT can be a lure to a malicious contract.])
#pagebreak()
= 8 · A risk-limited decision process
Define a maximum amount before researching, use no leverage, avoid borrowed funds, stage any purchase rather than rushing, and set an exit or stop condition. Record the thesis and invalidate it when facts change. If you cannot explain the token’s sell path, do not proceed.
#v(8mm)
#callout("Practical note", [The safest position in a memecoin is often no position; education does not create an obligation to buy.])
#pagebreak()
= 9 · Final safety checklist
Before interacting, verify the official contract through multiple channels, contract permissions, liquidity and unlocks, holder concentration, sellability, team disclosures, audit limitations, wallet hygiene, and your maximum loss. Report suspected fraud to the relevant platform and authorities, preserve transaction hashes, and do not send more money to recover a loss.
#v(8mm)
#callout("Practical note", [Disclosure: This is educational content, not investment advice. Memecoins can lose all value, and on-chain transactions may be irreversible.])
#v(12mm)
#text(size: 8pt, fill: muted)[Sources and further reading: Investor.gov copy trading glossary; FINRA Crypto Assets; SEC Investor Alert on crypto-asset scams; IOSCO investor-education publications. These resources provide general education and do not validate any particular service or token.]
#v(4mm)
#text(size: 8pt, fill: muted)[For the latest links, visit investor.gov, finra.org, sec.gov, and iosco.org.]
