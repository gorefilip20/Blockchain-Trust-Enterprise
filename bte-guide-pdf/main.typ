#import "report-theme.typ": report-accent, report-theme

#show: report-theme.with(
  title: "BTE Trading & Copy-Trading Guide",
  author: "Blockchain Trust Enterprises",
  rhythm: "report",
  running-header: true,
)

#page(margin: (top: 30%, x: 2.2cm), numbering: none, header: none)[
  #set par(first-line-indent: 0em)
  #align(center)[
    #text(size: 26pt, weight: "bold", fill: report-accent)[BTE Trading & Copy-Trading Guide]
    #v(0.5em)
    #text(size: 14pt, fill: luma(80))[A practical framework for disciplined market participation]
    #v(2em)
    #line(length: 40%, stroke: 0.5pt + luma(160))
    #v(2em)
    #text(size: 12pt)[
      Blockchain Trust Enterprises \
      Edition 1.0 · August 2026
    ]
    #v(3em)
    #block(fill: rgb("EAF8F3"), inset: 14pt, radius: 5pt)[
      #text(weight: "bold", fill: rgb("0C6956"))[Important:]
      This guide is educational material for the BTE demo experience. It is not investment advice, a promise of profit, or a substitute for a licensed professional. Markets can move against you, and you can lose some or all of the money you invest.
    ]
  ]
]

#page(numbering: none, header: none)[
  #outline(title: [Contents], indent: 1.5em)
]

#counter(page).update(1)

= 1. Start with a trading mandate

A strong trader begins with a written mandate before opening a position. The mandate defines the purpose of the account, the instruments that are permitted, the maximum acceptable loss, the time horizon, and the conditions under which a position must be reduced or closed. BTE’s copy-trading workflow is designed to make these decisions visible before capital is allocated.

#block(fill: rgb("FFF7E8"), inset: 12pt, radius: 5pt)[
  *BTE principle — Protect the decision before pursuing the return.* A good process can still produce a losing trade. A bad process can produce a winning trade. Judge the process first.
]

#table(
  columns: (2.2fr, 3fr),
  stroke: 0.4pt + luma(205),
  inset: 7pt,
  [*Mandate question*], [*Example answer*],
  [What is the objective?], [Long-term growth, income, capital preservation, or learning.],
  [What is the time horizon?], [Intraday, swing, multi-month, or multi-year.],
  [What can be lost?], [A defined amount that will not compromise essential obligations.],
  [What is prohibited?], [Unapproved leverage, concentrated exposure, revenge trading, or trading without a plan.],
)

= 2. How to trade well

Good trading is a repeatable decision process. Before entering a position, identify the thesis, the evidence supporting it, the invalidation point, the position size, and the exit plan. Record the decision in a journal. After the trade, review whether you followed the plan rather than judging yourself only by the outcome.

== The BTE five-step loop

+ *Observe.* Review price, liquidity, volatility, relevant news, and the freshness of the data.
+ *Form a thesis.* State why the trade may work and what would prove the thesis wrong.
+ *Size the risk.* Define the maximum loss before calculating the quantity. A smaller position is often the correct position.
+ *Stage and check.* Use BTE guardrails to check concentration, buying power, suitability, and order parameters before staging.
+ *Review.* Capture the execution receipt, compare the result with the plan, and update the journal.

Do not confuse a complex strategy with a robust strategy. A simple rule that is understood, tested, and followed is more useful than a sophisticated rule that cannot be explained.

= 3. Copy trading without copying blindly

Copy trading allows a client to follow the activity of another strategy or trader according to defined allocation rules. It does not remove risk and it does not guarantee that the follower will receive the same price, timing, liquidity, or outcome as the leader. A strategy’s historical performance is not a promise of future performance.

== The BTE copy-trading checklist

Before activating a copy allocation, review the strategy’s objective, instruments, holding period, historical drawdowns, turnover, leverage, liquidity, fees, and conflict disclosures. Confirm that the strategy is suitable for your mandate. Set a maximum allocation and a maximum loss or drawdown response. Decide whether copying pauses when the leader changes risk, when data becomes stale, or when your own account breaches a guardrail.

#block(fill: rgb("EEF3FF"), inset: 12pt, radius: 5pt)[
  *Copy controls to configure in BTE:* allocation percentage, maximum position size, maximum strategy exposure, stop-copy threshold, manual approval for new instruments, allowed asset classes, and an emergency pause switch.
]

#table(
  columns: (2.3fr, 2.7fr, 2fr),
  stroke: 0.4pt + luma(205),
  inset: 7pt,
  [*Control*], [*What it does*], [*Review question*],
  [Allocation cap], [Limits how much of the account follows one strategy.], [Is the account too dependent on one source?],
  [Position cap], [Limits the size of any copied instrument.], [Could one trade dominate the account?],
  [Drawdown pause], [Pauses new copied activity after a defined loss.], [When should copying stop for review?],
  [Approval mode], [Requires a manual review before selected trades are copied.], [Which products need extra scrutiny?],
)

= 4. Finding and evaluating strategies

A good strategy is not necessarily the strategy with the highest recent return. Evaluate consistency, risk-adjusted results, drawdown recovery, liquidity, behavior in different market conditions, and whether the strategy is understandable. Be cautious when a profile uses urgent language, guarantees, screenshots without verifiable records, or unusually high leverage.

BTE should present a strategy profile with a clear history window, data freshness, benchmark, fees, turnover, worst drawdown, current exposure, and a plain-language explanation of the strategy. The client should be able to compare strategies, save a shortlist, request guidance, and pause or disconnect at any time.

= 5. Meme markets and high-volatility assets

Meme assets can move rapidly because of attention, social activity, limited liquidity, market structure, and changing sentiment. They can experience sharp price gaps, spread expansion, halted markets, scams, impersonation, and permanent loss. Treat a meme-market idea as a high-risk research topic, not as a guaranteed opportunity.

Before considering a meme asset, verify the contract or listing, liquidity, trading venue, custody path, concentration of ownership where reliable data exists, unlocks, fees, and relevant disclosures. Avoid links or instructions received through unsolicited messages. Never risk essential money, borrow to chase a move, or increase size simply because a position is losing.

#block(fill: rgb("FFF0F1"), inset: 12pt, radius: 5pt)[
  *BTE meme-market rule:* If the asset cannot be independently identified, priced, custodied, and exited under the platform’s controls, it should not be eligible for copy allocation in the demo or live product.
]

= 6. A protocol for becoming a better trader

Profitability cannot be promised. The most responsible protocol is to improve decision quality, preserve capital, and measure results over a meaningful sample rather than chasing one successful trade.

+ Write the mandate and define a maximum loss.
+ Learn the product mechanics before using the product.
+ Start with a paper account or a small allocation that you can afford to lose.
+ Use a journal with entry reason, size, risk, exit plan, and post-trade review.
+ Measure expectancy, drawdown, concentration, turnover, and adherence to rules.
+ Remove strategies that cannot explain their process or that breach their risk limits.
+ Take breaks when emotional decisions, revenge trading, or compulsive checking appears.
+ Review the plan periodically with a qualified adviser where the decision is consequential.

The goal is not to trade constantly. The goal is to make fewer, clearer, better-controlled decisions.

= 7. Message Admin: data guidance, mentorship, and research support

BTE’s public workspace includes a Message Admin path for users who want help understanding data, setting up copy controls, reviewing a strategy, learning platform mechanics, or requesting a mentorship conversation. Admin guidance should explain the product and the user’s configured controls; it should not promise returns or pressure a user to deposit.

Recommended request categories include: *Data guidance*, *Copy-trading setup*, *Mentorship request*, *Strategy review*, *Meme-market research request*, *Risk and guardrail review*, and *Account or funding support*. Each request should record the user’s question, relevant strategy or instrument, urgency, disclosure acknowledgement, and a safe reply channel.

A responsible admin response should identify assumptions, explain uncertainty, link to the relevant BTE guide or disclosure, and escalate regulated or personalized advice to an appropriately licensed professional.

= 8. Using the BTE demo workflow

In the BTE demo, users can browse simulated strategies and market data, open a strategy profile, configure a copy allocation, set guardrails, preview a simulated order, view an explainable execution receipt, pause copying, and send a Message Admin request. The demo does not route live orders, hold custody, accept deposits, or promise returns.

#table(
  columns: (1.3fr, 3.7fr),
  stroke: 0.4pt + luma(205),
  inset: 7pt,
  [*Screen*], [*Use it to*],
  [Discover], [Compare strategy profiles, risk, fees, activity, and data freshness.],
  [Configure], [Set allocation, limits, approval mode, and pause conditions.],
  [Preview], [Review the simulated order, checks, reference price, fees, and slippage.],
  [Monitor], [Track copied positions, drawdown, exposure, strategy status, and notifications.],
  [Get guidance], [Message Admin for platform education, data questions, mentorship intake, or research support.],
)

= 9. Risk and disclosure summary

Trading and copy trading involve risk. Prices can rise or fall, liquidity can disappear, and execution may differ from a displayed quote. Digital assets and meme markets can be especially volatile. Leverage can magnify losses. Tax treatment, investor protections, and product eligibility depend on jurisdiction and account circumstances.

This guide does not establish an adviser-client relationship and does not account for a reader’s financial situation, objectives, experience, or risk tolerance. Review the BTE product disclosures and consult a licensed financial professional before making consequential decisions. In the BTE demo, all prices, balances, performance figures, strategy records, and execution results are simulated.

#block(fill: rgb("EAF8F3"), inset: 14pt, radius: 5pt)[
  *Next step:* Open BTE’s Copy Trading workspace, start with a paper allocation, configure a drawdown pause, and use *Message Admin* if you need help understanding data or the controls.
]

#align(center)[
  #v(1.5em)
  #text(size: 9pt, fill: luma(90))[Blockchain Trust Enterprises · BTE Trading & Copy-Trading Guide · Educational demo material]
]
