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

#align(center)[#v(28mm) #text(size: 30pt, weight: "bold", fill: navy)[Crypto \& Digital Assets: A Foundation Guide] #v(8mm) #text(size: 13pt, fill: accent)[Networks, wallets, custody, transactions, and practical security habits] #v(25mm) #line(length: 65%, stroke: 2pt + accent) #v(10mm) #text(size: 10pt, fill: muted)[Blockchain Trust Enterprise · Learning Desk] #v(8mm) #text(size: 9pt, fill: muted)[Educational resource · Version 1.0 · September 2026]]
#pagebreak()
= How to use this guide
Digital assets are issued, transferred, or recorded using distributed-ledger or blockchain technology. This guide explains foundational concepts and safety practices. It is educational and does not endorse any asset, platform, or investment strategy.
#v(8mm)
#callout("Practical note", [Assume that every transaction is irreversible until you have independently verified the destination, network, and amount.])
#pagebreak()
= 1 · The digital-asset landscape
Digital assets can include native network assets, tokens, stablecoins, governance tokens, collectibles, and tokenized claims. Their technical design, legal treatment, liquidity, and risks can differ materially. Labels are not substitutes for due diligence.
#v(8mm)
#callout("Practical note", [Ask what the asset does, who controls upgrades, how supply changes, and where liquidity comes from.])
#pagebreak()
= 2 · Blockchains and consensus
A blockchain is a shared record maintained by a network under rules for validating transactions. Consensus mechanisms determine how updates are accepted. Finality, confirmation time, fees, and reorganization risk vary across networks.
#v(8mm)
#callout("Practical note", [A transaction can be visible on-chain before it is economically or operationally final for your use case.])
#pagebreak()
= 3 · Wallets and keys
A wallet manages keys that authorize transactions; it does not store coins in the same way a physical wallet stores cash. A seed phrase or private key is effectively control of the associated assets. Anyone who obtains it may be able to move funds.
#v(8mm)
#callout("Practical note", [Never share a seed phrase, private key, or signing approval. No legitimate support agent needs it.])
#pagebreak()
= 4 · Custody choices
Self-custody provides direct control but places backup, device, and transaction responsibility on the user. Third-party custody may offer recovery and operational controls but introduces counterparty, insolvency, access, and policy risk.
#v(8mm)
#callout("Practical note", [Choose custody based on capability, amount, access needs, and recovery planning—not brand familiarity alone.])
#pagebreak()
= 5 · Sending and receiving safely
Verify the asset, network, address, memo or tag, and amount. Use a small test transaction when appropriate. Compare the address on the signing device, not only the screen that requested the transfer. Be aware of address poisoning and clipboard malware.
#v(8mm)
#callout("Practical note", [A correct-looking address can still belong to the wrong network or recipient.])
#pagebreak()
= 6 · Smart contracts and approvals
Interacting with a smart contract can authorize transfers or other actions. Read the requested allowance and scope. Revoke unnecessary approvals using a reputable tool, and separate experimental activity from long-term holdings.
#v(8mm)
#callout("Practical note", [A signature request is not automatically safe because it appears in a familiar wallet.])
#pagebreak()
= 7 · Stablecoins, bridges, and platforms
Stablecoins depend on reserve, redemption, governance, and market mechanisms. Bridges add technical and operational dependencies. Exchanges and platforms add counterparty and withdrawal risk. Diversification of custodians can reduce single-point exposure but adds complexity.
#v(8mm)
#callout("Practical note", [Understand the failure mode of every intermediary in your transaction path.])
#pagebreak()
= 8 · Fraud and account security
Impersonation, fake support, phishing, malicious browser extensions, giveaway scams, and fabricated investment dashboards are common attack patterns. Use unique passwords, hardware-based multi-factor authentication where possible, device updates, transaction alerts, and bookmarks for important services.
#v(8mm)
#callout("Practical note", [Urgency, secrecy, guaranteed returns, and requests for remote access are strong warning signs.])
#pagebreak()
= 9 · Personal operating checklist
Keep an inventory of wallets and custodians, recovery instructions, trusted contacts, transaction records, tax documents, and emergency procedures. Start with small amounts while learning. Never risk rent, emergency savings, or borrowed money.
#v(8mm)
#callout("Practical note", [Disclosure: Digital assets are volatile and may become illiquid or permanently inaccessible. Regulations and tax treatment vary by jurisdiction; consult qualified professionals.])
#v(12mm)
#text(size: 8pt, fill: muted)[Sources and further reading: Investor.gov copy trading glossary; FINRA Crypto Assets; SEC Investor Alert on crypto-asset scams; IOSCO investor-education publications. These resources provide general education and do not validate any particular service or token.]
#v(4mm)
#text(size: 8pt, fill: muted)[For the latest links, visit investor.gov, finra.org, sec.gov, and iosco.org.]
