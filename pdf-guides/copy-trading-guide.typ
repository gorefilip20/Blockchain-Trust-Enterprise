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

#align(center)[#v(28mm) #text(size: 30pt, weight: "bold", fill: navy)[Copy Trading: A Practical Risk-First Guide] #v(8mm) #text(size: 13pt, fill: accent)[How to evaluate strategies, set guardrails, and learn without surrendering control] #v(25mm) #line(length: 65%, stroke: 2pt + accent) #v(10mm) #text(size: 10pt, fill: muted)[Blockchain Trust Enterprise · Learning Desk] #v(8mm) #text(size: 9pt, fill: muted)[Educational resource · Version 1.0 · September 2026]]
#pagebreak()
= How to use this guide
Copy trading lets an account mirror another trader or strategy. It can simplify execution, but it does not transfer responsibility, remove market risk, or guarantee the copied result. Treat this guide as education, not a recommendation to copy any person or strategy.
#v(8mm)
#callout("Practical note", [Start with a written objective: what you are trying to learn, the maximum loss you can tolerate, and the conditions under which you will stop.])
#pagebreak()
= 1 · What copy trading is
A copy-trading arrangement links a follower account to a source account or model. The platform may mirror entries, exits, position sizes, or allocations according to rules. Timing, liquidity, fees, slippage, leverage, and account differences can make results diverge.
#v(8mm)
#callout("Practical note", [Key distinction: copying an action is not the same as understanding the thesis behind that action.])
#pagebreak()
= 2 · How the mechanism works
Before enabling a strategy, map the data path: source signal, platform interpretation, order creation, exchange or broker execution, and portfolio reporting. Identify whether the platform has custody, trading authority, or only read access.
#v(8mm)
#callout("Practical note", [Ask what happens when the source trades an asset unavailable in your account, when an order partially fills, or when the connection is interrupted.])
#pagebreak()
= 3 · Evaluating a strategy
A short winning period is weak evidence. Review the full available history, maximum drawdown, volatility, losing streaks, turnover, leverage, concentration, fees, and whether the record is live or simulated. Prefer transparent methodology over impressive marketing.
#v(8mm)
#callout("Practical note", [Never judge a strategy by return alone. Pair return with drawdown, downside exposure, and the conditions that produced the result.])
#pagebreak()
= 4 · Provider and platform due diligence
Confirm identity, operating history, fee schedule, conflicts, withdrawal rules, permissions, security controls, complaint channels, and the legal entity behind the service. Be cautious when a provider pressures you to act immediately or promises consistent returns.
#v(8mm)
#callout("Practical note", [A professional-looking dashboard is not proof of solvency, competence, or legitimacy.])
#pagebreak()
= 5 · Risk controls before activation
Set a small initial allocation, a maximum position size, a portfolio-level loss limit, a leverage ceiling of zero unless you fully understand it, and a stop-copy rule. Use separate credentials or API keys with trading-only permissions where available; never allow withdrawals through an API key.
#v(8mm)
#callout("Practical note", [Write the controls down before the first trade. Controls chosen after a loss are usually too late.])
#pagebreak()
= 6 · Monitoring and intervention
Review copied positions, realized and unrealized P/L, fees, exposure by asset, and deviations from the source. Establish a review cadence. Pause when the source changes style, the platform changes terms, execution quality degrades, or you can no longer explain the exposure.
#v(8mm)
#callout("Practical note", [Automation should make monitoring easier, not make monitoring optional.])
#pagebreak()
= 7 · Common failure modes
Common problems include stale signals, slippage, latency, overconcentration, hidden leverage, liquidation cascades, fee drag, strategy drift, and false performance reporting. Operational failures—lost access, outages, or weak account security—can be as damaging as market losses.
#v(8mm)
#callout("Practical note", [Maintain a manual exit plan and know how to revoke permissions quickly.])
#pagebreak()
= 8 · A measured learning workflow
Use a staged process: observe, paper-test, allocate a limited amount, review results, and only then decide whether the strategy remains suitable. Keep an evidence log with dates, assumptions, decisions, and outcomes. Separate educational curiosity from money you need for living expenses.
#v(8mm)
#callout("Practical note", [The goal is not to find a perfect trader; it is to build a process that remains survivable when the trader is wrong.])
#pagebreak()
= 9 · Checklist and closing notes
Before copying, confirm: objective, source history, fees, permissions, custody, liquidity, drawdown, concentration, leverage, loss limit, stop-copy process, tax records, and support contacts. Copy trading can be useful as a learning tool, but every account owner remains responsible for their own risk decisions.
#v(8mm)
#callout("Practical note", [Disclosure: Digital assets and trading can lose some or all of their value. Seek independent professional advice for your circumstances.])
#v(12mm)
#text(size: 8pt, fill: muted)[Sources and further reading: Investor.gov copy trading glossary; FINRA Crypto Assets; SEC Investor Alert on crypto-asset scams; IOSCO investor-education publications. These resources provide general education and do not validate any particular service or token.]
#v(4mm)
#text(size: 8pt, fill: muted)[For the latest links, visit investor.gov, finra.org, sec.gov, and iosco.org.]
