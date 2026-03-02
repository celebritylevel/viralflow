export interface ViralFormat {
  id: string
  name: string
  category: 'engagement' | 'education' | 'story' | 'controversy' | 'value'
  description: string
  bestFor: string[]
  platforms: string[]
  template: string
  example: string
  hook: string
  engagementType: 'debate' | 'saves' | 'shares' | 'replies' | 'follows'
  lengthRange: 'short' | 'medium' | 'long' | 'thread'
}

export const VIRAL_FORMATS: ViralFormat[] = [
  {
    id: 'hot-take',
    name: 'Hot Take / Contrarian',
    category: 'controversy',
    description: 'Challenge popular belief with a bold statement backed by logic. Creates instant engagement through debate.',
    bestFor: ['thought leadership', 'brand positioning', 'discussions'],
    platforms: ['twitter', 'linkedin'],
    hook: 'Controversial statement that flips conventional wisdom',
    template: `[Bold contrarian claim about {topic}]

Here's why most people are wrong about this:

→ [Reason 1]
→ [Reason 2]
→ [Reason 3]

The data backs it up: [stat or proof]

Fight me in the replies.`,
    example: `Cold take: AI SDRs will NOT replace your sales team.

Here's why most people are wrong about this:

→ Buyers still want humans at the decision moment
→ AI fails at reading emotional subtext in calls
→ The best SDRs use AI as leverage, not replacement

The data backs it up: 82% of closed-won deals still had ≥3 human touchpoints

Fight me in the replies.`,
    engagementType: 'debate',
    lengthRange: 'short',
  },
  {
    id: 'how-i-did-x',
    name: 'How I Did X (Case Study)',
    category: 'value',
    description: 'Share a specific result with the exact process. People love proven frameworks they can steal.',
    bestFor: ['authority building', 'lead generation', 'trust'],
    platforms: ['twitter', 'linkedin', 'newsletter'],
    hook: 'Specific result + timeframe that seems impressive but achievable',
    template: `How I [achieved specific result] in [timeframe]:

(without [common painful approach])

Here's the exact playbook:

1. [Step with brief explanation]
2. [Step with brief explanation]
3. [Step with brief explanation]
4. [Step with brief explanation]
5. [Step with brief explanation]

The key insight most people miss: [non-obvious lesson]

Total time: [time]. Total cost: [cost].

[CTA or invitation]`,
    example: `How I built a GTM agent in 4 hours that replaced 20hrs/week of manual research:

(without writing a single line of code)

Here's the exact playbook:

1. Mapped every repetitive research task our SDRs did
2. Used Claude Code to build a Perplexity-powered agent
3. Connected it to our CRM via Zapier
4. Added a Slack output layer for instant alerts
5. Let SDRs review/approve before sending

The key insight most people miss: The bottleneck was routing, not research.

Total time: 4 hours. Total cost: $0 extra monthly.

DM me "AGENT" and I'll share the exact prompt stack.`,
    engagementType: 'saves',
    lengthRange: 'medium',
  },
  {
    id: 'numbered-thread',
    name: 'Numbered List / Thread',
    category: 'value',
    description: 'Structured value delivery in scannable format. Highly shareable and saves-friendly.',
    bestFor: ['education', 'resource sharing', 'viral saves'],
    platforms: ['twitter', 'linkedin'],
    hook: 'Promise of a specific number of actionable insights',
    template: `[Number] [things/mistakes/tools/lessons] about [topic] that most people don't know:

🧵 Thread:

1/ [Insight with short explanation]

2/ [Insight with short explanation]

3/ [Insight with short explanation]

4/ [Insight with short explanation]

5/ [Insight with short explanation]

[Number+1]/ If you found this useful:
- Follow me for more [topic] insights
- Repost to help others
- Save this for later`,
    example: `7 AI agent tools your GTM team needs in 2025 that nobody's talking about:

🧵 Thread:

1/ Clay + Claude Code = the most powerful lead enrichment combo. You get AI reasoning on enriched data, not just static fields.

2/ Perplexity API as a research layer. Real-time web research baked into your sequences.

3/ ElevenLabs for AI voice follow-ups. 3x reply rates vs text-only.

4/ Make.com over Zapier for complex AI flows. More nodes, cheaper at scale.

5/ Notion AI as your deal room brain. Reps brief it, it briefs the buyer.

6/ Fireflies + GPT-4 = auto-generated MEDDIC scoring after every call.

7/ Gamma for AI-generated, personalized pitch decks. Sent in <2 mins.

8/ If you found this useful:
- Follow me for weekly GTM AI drops
- Repost to help your team
- Save this for your next tool audit`,
    engagementType: 'saves',
    lengthRange: 'thread',
  },
  {
    id: 'pas-framework',
    name: 'Pain → Agitate → Solve (PAS)',
    category: 'value',
    description: 'Name the pain, make it visceral, then offer the relief. One of the highest-converting copywriting frameworks.',
    bestFor: ['product launches', 'lead gen', 'awareness'],
    platforms: ['twitter', 'linkedin', 'newsletter'],
    hook: 'Open with the exact feeling of the pain',
    template: `If you're still [doing painful thing], you're losing [something valuable] every single day.

I've seen it destroy [consequence 1].
I've watched it cost teams [consequence 2].
It's responsible for [consequence 3].

The problem? [Root cause most people don't see]

The solution isn't [common wrong approach].

It's [unexpected solution].

Here's how it works: [brief explanation]

[CTA]`,
    example: `If you're still writing personalized cold emails manually, you're losing 3 hours a day that your competitors are using to close deals.

I've seen it burn out top performers.
I've watched it kill pipeline momentum.
It's responsible for 40% of SDR churn at the companies I've audited.

The problem? It's not the writing — it's the research before the writing.

The solution isn't buying another data tool.

It's building a research agent that does the thinking so you just review and send.

Here's how it works: Claude Code + Perplexity API reads their LinkedIn, recent news, job postings, and funding rounds — and writes a hyper-relevant first line in 8 seconds.

Want the prompt stack? Drop "PROMPT" below.`,
    engagementType: 'replies',
    lengthRange: 'medium',
  },
  {
    id: 'before-after',
    name: 'Before / After Transformation',
    category: 'story',
    description: 'Show dramatic transformation. The contrast creates desire and makes your solution tangible.',
    bestFor: ['product demos', 'case studies', 'testimonials'],
    platforms: ['twitter', 'linkedin'],
    hook: 'The "before" state people immediately recognize',
    template: `BEFORE [timeframe] ago:
❌ [Pain state 1]
❌ [Pain state 2]
❌ [Pain state 3]

AFTER using [approach/tool]:
✅ [Result 1]
✅ [Result 2]
✅ [Result 3]

What changed: [key insight/approach]

[Optional: brief explanation of how]`,
    example: `BEFORE 6 months ago:
❌ 4 hours/day on manual prospect research
❌ Generic outreach with 2% reply rates
❌ CRM always out of date
❌ Reps dreading Monday pipeline reviews

AFTER building an AI GTM stack:
✅ Research done in 8 seconds per prospect
✅ Hyper-personalized sequences at 11% reply rate
✅ CRM auto-updated after every interaction
✅ Monday reviews take 15 minutes

What changed: We stopped treating AI as a writing tool and started using it as a thinking tool.

The full playbook is in my bio.`,
    engagementType: 'saves',
    lengthRange: 'short',
  },
  {
    id: 'prediction',
    name: 'Bold Prediction',
    category: 'controversy',
    description: 'Make a specific, time-bound prediction. Creates urgency and positions you as a forward-thinker.',
    bestFor: ['thought leadership', 'trend setting', 'virality'],
    platforms: ['twitter', 'linkedin'],
    hook: 'By [specific date], X will Y — and most people aren\'t ready',
    template: `By [specific date], [bold prediction about topic].

Here's what the signals are already showing:

• [Signal 1 with data]
• [Signal 2 with data]
• [Signal 3 with data]

The companies that [take action now] will [big benefit].
The ones that don't will [negative consequence].

Which side are you on?`,
    example: `By Q4 2025, 60% of B2B SaaS companies will have a dedicated "AI GTM" role.

Here's what the signals are already showing:

• 3x increase in "AI Revenue Ops" job postings since Jan 2025
• Top-performing reps now manage AI agents, not just territories
• GTM teams using AI close 34% faster (McKinsey, 2024)

The companies that hire for this now will own their category.
The ones that don't will be hiring to catch up in 12 months.

Which side are you on?`,
    engagementType: 'debate',
    lengthRange: 'short',
  },
  {
    id: 'story-arc',
    name: 'Mini Story Arc',
    category: 'story',
    description: 'Beginning, tension, turning point, resolution. Stories get shared because people forward what moves them.',
    bestFor: ['brand building', 'emotional connection', 'virality'],
    platforms: ['linkedin', 'twitter'],
    hook: 'A moment in time that hooks with curiosity or emotion',
    template: `[Scene-setting opening — put the reader in the moment]

[Build the tension — what was the problem?]

[The turning point — what changed?]

[The resolution — what happened?]

[The lesson — what should the reader take away?]`,
    example: `I watched a VP of Sales almost fire a rep last month for "underperforming."

The rep's pipeline was thin. His numbers were bad. His manager was done.

Then we pulled the AI activity data.

Turns out he was running 4x the research of any other rep — but on the wrong accounts. A signal issue, not a performance issue.

We adjusted his ICP filters. Gave him an AI research agent. In 30 days: $280K added to pipeline.

The lesson: Bad data makes good people look like bad performers. Fix the signal before you fix the person.`,
    engagementType: 'shares',
    lengthRange: 'medium',
  },
  {
    id: 'mistake-to-avoid',
    name: 'Mistake to Avoid',
    category: 'education',
    description: 'Loss aversion is powerful. People share warnings more than tips because they want to protect their network.',
    bestFor: ['authority building', 'shares', 'protection-oriented audiences'],
    platforms: ['twitter', 'linkedin'],
    hook: 'Stop doing X. It\'s costing you [tangible thing].',
    template: `Stop [doing common thing]. It's costing you [specific loss].

The mistake most [audience] make with [topic]:

❌ They [wrong approach]
❌ They [wrong approach]
❌ They [wrong approach]

Instead, [do this]:

✓ [Correct approach]
✓ [Correct approach]
✓ [Correct approach]

The difference: [key insight]

Save this. Your future self will thank you.`,
    example: `Stop using AI to write your cold emails. It's costing you pipeline.

The mistake most SDRs make with AI outreach:

❌ They use ChatGPT to generate "personalized" openers that feel fake
❌ They send at volume without customizing the hook
❌ They A/B test the subject line instead of the first line

Instead, use AI for this:

✓ Research the prospect's last 3 LinkedIn posts
✓ Find their company's recent news and job postings
✓ Generate a ONE-LINE hyper-specific opener only

The difference: AI as a researcher, human as the writer.

Save this. Your future self will thank you.`,
    engagementType: 'saves',
    lengthRange: 'medium',
  },
  {
    id: 'framework',
    name: 'Framework / Step-by-Step Process',
    category: 'value',
    description: 'Give people a repeatable system they can apply immediately. Frameworks get bookmarked and referenced forever.',
    bestFor: ['authority building', 'long-term saves', 'viral resources'],
    platforms: ['twitter', 'linkedin', 'newsletter', 'blog'],
    hook: 'The [Name] Framework for [achieving desirable outcome]',
    template: `The [Creative Name] Framework for [outcome]:

Step 1: [ACTION] → [result]
Step 2: [ACTION] → [result]
Step 3: [ACTION] → [result]
Step 4: [ACTION] → [result]
Step 5: [ACTION] → [result]

Most people skip Step [X]. That's why they fail.

[Brief explanation of the critical step]

[Optional: real example of it working]

Bookmark this. Run it every [timeframe].`,
    example: `The SIGNAL Framework for AI-powered GTM:

Step 1: SOURCE → Pull ICPs from 5 data sources, not 1
Step 2: IDENTIFY → Use AI to score intent signals in real-time
Step 3: GENERATE → Auto-create hyper-personalized research packets
Step 4: NOTIFY → Push hot leads to reps via Slack in <60 seconds
Step 5: ANALYZE → Let AI review every reply for objection patterns
Step 6: LEARN → Feed wins back to improve the scoring model

Most people skip Step 5. That's why their AI never improves.

Every reply is training data. Ignore it and your AI stays stuck at average.

Running this, our customers see 3x reply rates in 45 days.

Bookmark this. Run it every quarter.`,
    engagementType: 'saves',
    lengthRange: 'medium',
  },
  {
    id: 'stat-lead',
    name: 'Surprising Stat Lead',
    category: 'education',
    description: 'Open with a counterintuitive number. Stats that surprise create the "I need to share this" reflex.',
    bestFor: ['research sharing', 'authority', 'news-adjacent content'],
    platforms: ['twitter', 'linkedin'],
    hook: 'A number that makes people stop scrolling and say "wait, what?"',
    template: `[Surprising % or number] of [audience] are [doing/experiencing unexpected thing].

That stat stopped me.

Because it means [implication 1].
And [implication 2].
And [implication 3].

The reason? [Root cause]

What to do about it: [actionable takeaway]

[Source or "from my research into X"]`,
    example: `73% of AI tools bought by sales teams in 2024 were abandoned within 90 days.

That stat stopped me.

Because it means most AI spend is waste.
And most AI adoption fails at the workflow layer, not the technology layer.
And the teams that DO succeed treat AI like a new hire, not a new app.

The reason? They buy for features, not for workflows.

What to do about it: Before buying any AI tool, map the 3 daily tasks it will replace — and assign a human to own the output quality.

From my research into 40+ GTM AI implementations.`,
    engagementType: 'shares',
    lengthRange: 'short',
  },
  {
    id: 'unpopular-opinion',
    name: 'Unpopular Opinion',
    category: 'controversy',
    description: 'Signal distinctiveness. Polarizing opinions attract your tribe and repel the wrong audience.',
    bestFor: ['audience filtering', 'strong niche communities', 'thought leadership'],
    platforms: ['twitter', 'linkedin'],
    hook: 'Unpopular opinion: [statement your audience will debate]',
    template: `Unpopular opinion: [bold statement about topic]

I know, I know.

But hear me out:

[Argument 1]

[Argument 2]

[Argument 3]

Am I wrong? Tell me why below.`,
    example: `Unpopular opinion: Most GTM teams don't need more AI tools. They need fewer, used deeply.

I know, I know.

But hear me out:

The average GTM stack now has 17 tools. Most reps use 4 of them.

Adding AI to 17 tools compounds the chaos. You get 17 mediocre AI integrations instead of 1 powerful workflow.

The best GTM teams I know pick ONE thing — usually enrichment or sequencing — go deep, and get exceptional output.

Am I wrong? Tell me why below.`,
    engagementType: 'debate',
    lengthRange: 'short',
  },
  {
    id: 'quote-commentary',
    name: 'Quote + Deep Commentary',
    category: 'education',
    description: 'Borrow credibility from an expert, then add your own unique layer of insight that makes it shareable.',
    bestFor: ['building on trends', 'community commentary', 'thought leadership'],
    platforms: ['twitter', 'linkedin'],
    hook: 'React to an insight with a strong, original angle',
    template: `"[Quote from notable person or source]"

This is [more important / misunderstood / dangerous] than it looks.

Here's what it actually means for [audience]:

[Your unique insight 1]
[Your unique insight 2]
[Your unique insight 3]

The takeaway: [actionable conclusion]`,
    example: `"We're moving from search engines to answer engines."
— Gartner, 2025 CMO Survey

This is more important than it looks.

Here's what it actually means for GTM teams:

Your SEO playbook is becoming your GEO playbook. If AI can't cite you, you don't exist.

Buyers now get 80% of their research done by AI before they ever touch your website.

Your content needs to answer questions, not just rank for keywords.

The takeaway: Optimize every piece of content for "AI citability" — clear structure, cited stats, direct answers. That's the new moat.`,
    engagementType: 'shares',
    lengthRange: 'short',
  },
  {
    id: 'expert-breakdown',
    name: 'Expert Breakdown',
    category: 'education',
    description: 'Deep-dive analysis that positions you as the definitive source. Long-form that educates earns lasting authority.',
    bestFor: ['LinkedIn articles', 'newsletter content', 'deep expertise'],
    platforms: ['linkedin', 'newsletter', 'blog'],
    hook: 'The definitive breakdown of [complex topic] — simplified',
    template: `The complete breakdown of [topic]: Everything [audience] needs to know

TL;DR: [one-sentence summary]

---

**Why this matters right now:**
[Context and urgency]

**The core concept:**
[Clear explanation]

**How the best [audience] are using it:**
[3 examples or use cases]

**The common mistakes:**
[2-3 pitfalls]

**Your action plan:**
[3 specific next steps]

---

Found this useful? Share it with one person who needs it.`,
    example: `The complete breakdown of AI agents for GTM: Everything revenue teams need to know

TL;DR: AI agents aren't just automation — they're autonomous teammates that research, draft, and iterate without hand-holding.

---

**Why this matters right now:**
Every top-performing GTM team I've spoken to in Q1 2025 has at least one AI agent running in their stack. The gap between teams using agents and teams not using them is compounding fast.

**The core concept:**
An AI agent combines a language model with tools (web search, CRM APIs, email) and memory (conversation history, contact data) to complete multi-step tasks autonomously.

**How the best GTM teams are using it:**
1. Prospect research agents that pull news, LinkedIn, and job postings before every call
2. Objection-handling agents that review call transcripts and suggest responses
3. Sequence optimization agents that A/B test first lines and iterate automatically

**The common mistakes:**
- Treating agents like chatbots (they need tasks, not conversations)
- Skipping the human review layer (agents augment; humans approve)

**Your action plan:**
1. Map your top 3 most repetitive research tasks this week
2. Pick one and build a simple agent in Claude Code (no code needed)
3. Run it for 30 days and measure time saved

---

Found this useful? Share it with one person who needs it.`,
    engagementType: 'follows',
    lengthRange: 'long',
  },
  {
    id: 'question-hook',
    name: 'Question + Reveal',
    category: 'engagement',
    description: 'Open with a question that creates curiosity gap. The answer must be worth the click.',
    bestFor: ['engagement', 'curiosity-driven content', 'community building'],
    platforms: ['twitter', 'linkedin'],
    hook: 'A question where the answer isn\'t what they\'d expect',
    template: `What's the #1 reason [common problem]?

It's not [obvious wrong answer].
It's not [second wrong answer].

It's [surprising real answer].

Here's what I mean:

[Explanation with proof or example]

Most [audience] don't realize this until [consequence].

[CTA or reflection prompt]`,
    example: `What's the #1 reason AI outreach fails?

It's not the copy.
It's not the targeting.

It's the timing.

Here's what I mean:

AI-generated emails sent Monday 9am get a 3% reply rate.
The same emails sent Tuesday-Thursday between 10-11am get 9%.

Most SDRs optimize the message. The best ones optimize the moment.

Your AI can write perfect emails at 3am. That doesn't mean you should send them then.

Are you tracking send-time performance in your sequences?`,
    engagementType: 'replies',
    lengthRange: 'short',
  },
  {
    id: 'geo-article',
    name: 'GEO-Optimized Article',
    category: 'value',
    description: 'Long-form content structured for AI engine citability. Uses headers, Q&As, stats, and direct answers that LLMs love to cite.',
    bestFor: ['blog posts', 'LinkedIn articles', 'SEO + GEO hybrid'],
    platforms: ['blog', 'linkedin', 'newsletter'],
    hook: 'Authority piece that answers the exact question your buyer is Googling (or asking AI)',
    template: `# [Keyword-rich title that directly answers a question]

**Quick Answer:** [2-3 sentence direct answer for AI snippets]

## What is [Topic]?

[Clear definition paragraph]

## Why [Topic] Matters for [Audience] in [Year]

[Context with data points and citations]

## How [Topic] Works: Step-by-Step

1. **[Step]:** [Explanation]
2. **[Step]:** [Explanation]
3. **[Step]:** [Explanation]

## [Topic]: Common Questions Answered

**Q: [Frequently asked question 1]**
A: [Direct, complete answer]

**Q: [Frequently asked question 2]**
A: [Direct, complete answer]

## Key Stats About [Topic]

- [Stat + source]
- [Stat + source]
- [Stat + source]

## The Bottom Line

[Summary + CTA]`,
    example: `# How AI Agents Are Transforming GTM Teams in 2025

**Quick Answer:** AI agents help GTM teams automate research, personalize outreach, and optimize sequences — reducing manual work by 60% while increasing reply rates by 2-3x.

## What Are AI GTM Agents?

AI GTM agents are autonomous software systems that combine large language models with sales tools to complete multi-step go-to-market tasks without manual intervention.

## Why AI Agents Matter for GTM Teams in 2025

According to McKinsey's 2024 Sales AI Report, companies using AI agents in their GTM process close 34% faster than those without. The competitive gap is accelerating.

## How AI GTM Agents Work: Step-by-Step

1. **Signal Detection:** Agent monitors LinkedIn, news, and intent data for buying signals
2. **Research Synthesis:** Agent pulls and summarizes prospect context in seconds
3. **Personalized Draft:** Agent writes a first-line hook specific to that prospect
4. **Human Review:** Rep approves or edits before send
5. **Response Analysis:** Agent analyzes replies to improve future sequences

## AI GTM Agents: Common Questions Answered

**Q: Do AI agents replace SDRs?**
A: No. AI agents handle research and drafting; SDRs handle relationships and judgment calls.

**Q: How long does it take to build an AI GTM agent?**
A: With tools like Claude Code, teams report building functional agents in 4-8 hours.

## Key Stats About AI in GTM

- 73% of AI tools purchased are abandoned within 90 days (Gartner, 2024)
- Teams using AI in sequencing see 2.8x higher reply rates (Outreach, 2024)
- 60% of B2B buyers use AI for vendor research before contacting sales (Forrester, 2025)

## The Bottom Line

AI agents aren't replacing your GTM team — they're giving each rep the capabilities of a 5-person research team. Start with one workflow, automate it deeply, then expand.`,
    engagementType: 'follows',
    lengthRange: 'long',
  },
]

export const getFormatById = (id: string): ViralFormat | undefined => {
  return VIRAL_FORMATS.find(f => f.id === id)
}

export const getFormatsByPlatform = (platform: string): ViralFormat[] => {
  return VIRAL_FORMATS.filter(f => f.platforms.includes(platform))
}

export const getFormatsByCategory = (category: ViralFormat['category']): ViralFormat[] => {
  return VIRAL_FORMATS.filter(f => f.category === category)
}
