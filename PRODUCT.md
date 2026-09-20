# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary reader is a recruiter who screens candidates for senior full-stack or AI engineering jobs. Recruiters reach the site from LinkedIn, a job application, the CV PDF or a search for Santiago's name. They skim for role, stack, location and work permit, then open the CV or send an email.

Hiring managers and tech leads come second. They judge the work itself: project pages, live demos, GitHub repos and the writing. When a recruiter's needs and an engineer's needs pull apart, the recruiter wins.

Search engines and AI assistants are the third reader. They learn about Santiago from the JSON-LD, the FAQ, `llms.txt`, `llms-full.txt`, the sitemap and the RSS feed.

The site is for employers only. It doesn't market Santiago's services to clients.

## Product Purpose

The site at santiagopaz.com holds Santiago Paz's CV, portfolio and writing. It exists to get Santiago hired into a senior engineering role in Berlin, elsewhere in the EU, or remote. It works when a recruiter or hiring manager gets in touch.

Santiago shows up in four places: LinkedIn, this site, the GitHub profile README and the CV PDF. The site carries the most depth, with project pages, writing and an FAQ.

## Positioning

The title is Senior Full-Stack Engineer. Santiago moved the search back to full-stack on 2026-09-15: full-stack and product engineer roles in a TypeScript stack lead, senior frontend roles come second, and pure AI engineering roles are out of the search. AI stays on the site as an extra and never as the headline. The tagline is "TypeScript, React, Next.js and Node.js. Three products shipped solo, all live."

That replaced the framing of 2026-09-14, whose tagline was "AI agents, RAG and evaluation, shipped in production." The line claimed production AI experience the record does not support, and Santiago cut the same wording from his LinkedIn headline a day later for that reason. Do not reinstate it.

The edge is whole products built solo: Santiago takes a product from data model to deploy alone. Every project on the site is solo work. Contract Lens runs from a multi-tenant data model to an LLM extraction pipeline. Reema spans a dashboard, a marketing site, a speech synthesizer and an embeddable player. Multi-Agent Trading Desk covers the frontend, the broker integration and the rebalance engine, on top of a forked analyst backend the site credits upstream. All three are live.

Behind that sit 13 years on large web platforms. The current one, dialpad.com, has about 1,900 pages in five locales.

The claim to protect: live products Santiago built alone, AI included, with demos anyone can open.

## Operating Context

The site targets jobs in Berlin, across the EU, or remote. Santiago is an Italian citizen and needs no visa sponsor to work in the EU. Languages: Spanish (native), English (full professional), German (elementary).

Every page ships its own share card because links to the site get shared on LinkedIn, Slack and X. Google Search Console is verified for the domain.

AI assistants can answer "Who is Santiago Paz?" from the FAQ, the JSON-LD and `llms.txt`, so those sources must match the pages.

The four surfaces drift apart on their own. A change to one means checking the other three in the same session. The CV PDF lags the most because it has no source in this repo and gets rebuilt by hand.

## Capabilities and Constraints

- Next.js 16 App Router, built as a static export (`output: 'export'`) and served by GitHub Pages at santiagopaz.com. Nothing runs on a server at request time, so Server Actions, ISR, dynamic Route Handlers and `next/image` optimization are unavailable. Metadata routes use `export const dynamic = 'force-static'`.
- This Next.js version has breaking changes. Read the guides in `node_modules/next/dist/docs/` before writing code (see `AGENTS.md`).
- A push to `main` deploys once `pnpm lint`, `pnpm test` and `pnpm build` pass.
- Most copy lives in `data/*.json` and `content/posts/*.md`. The About page body lives in `app/about/page.tsx`.
- Routes: `/`, `/about`, `/writing`, `/writing/[slug]`, `/projects/[slug]`, an `og.png` card per page, `/llms.txt`, `/llms-full.txt`, `/writing/rss.xml`, the sitemap, robots and a 404. `/projects/splitberlin/` redirects to `/projects/contract-lens/`, the project's current name.
- Contact is a `mailto:` link. There is no form and no backend.
- The site is in English only.
- A project has a slug, title, group, global order, summary, role, stack, highlights, repo and demo links, an optional disclosure and a Markdown description. A post has a title, date, kind (`engineering` or `personal`) and summary.
- Project order is global and matches the CV. Contract Lens, Reema and Multi-Agent Trading Desk lead on both. Those are also the only three with a public screen and their own colorway, so the home page's three plates stay filled.
- The repo is public. Salary, rates and notice periods stay out of it and off the site. The TestGorilla report lost its fourth page for this reason.
- Names to keep exact: Senior Full-Stack Engineer, Contract Lens, Multi-Agent Trading Desk, bedrock-genai-labs (lowercase, like the repo), Reema, Pegala, Reddit Idea Miner.

## Brand Commitments

- Name and domain: Santiago Paz, santiagopaz.com.
- The role and tagline appear word for word: "Senior Full-Stack Engineer" and "TypeScript, React, Next.js and Node.js. Three products shipped solo, all live."
- Two claims stay bounded, and their disclosures do not come off. bedrock-genai-labs is a study curriculum whose exercises are unfilled `TODO(you)` scaffolds, not labs that were run; it is never described as production RAG, agent or Bedrock experience. Multi-Agent Trading Desk sits on an analyst backend forked from virattt's open-source ai-hedge-fund, where the 12-agent panel and the LangGraph orchestration are upstream work rather than Santiago's design.
- AWS and Amazon Bedrock are not working experience. Nothing Santiago ships runs on AWS, so neither belongs in a headline, a tagline or the skills list. The certification appears only as in progress.
- Voice: plain and specific, with numbers in place of adjectives. The About page speaks in the first person. The copy states its limits: bedrock-genai-labs is marked as a study curriculum, and Pegala names the open-source project it builds on.
- English prose uses the plain hyphen and never an em or en dash.
- Education reads "Computer Science, then Data Science" at the Universidad de Buenos Aires, 2010-2023. The site never claims a finished degree.
- The only certification listed is the AWS Certified Generative AI Developer - Professional, marked in progress. LinkedIn skill badges stay off the site.
- The GitHub profile README lists some repos that the site leaves out. That gap is on purpose.
- LinkedIn recommendations exist. Ask Santiago before quoting any of them.
- The headshot may appear on pages and share cards where it helps.

## Evidence on Hand

- `data/profile.json`: role, tagline, location, work authorization, languages, bio, skills, links and the award.
- `data/experience.json`: nine roles at eight companies from 2011 to today, plus education and the AWS certification in progress.
- `data/projects.json`: six projects. Live demos: Contract Lens (trycontractlens.com), Multi-Agent Trading Desk (trading-desk.santiagopaz.com) and Reema (reema.ar). Public repos: contract-lens, multi-agent-trading-desk, bedrock-genai-labs and reddit-idea-miner. Pegala has no public link.
- `data/faq.json`: five questions and answers, which also feed the FAQPage schema.
- `content/posts/`: "Evals are the product, not the model" (engineering, 2026-06-15) and "Leaving Buenos Aires" (personal, 2026-02-02).
- `public/cv/santiago-paz.pdf`: the CV. Its source is not in this repo; it is built in the job-search workspace and copied here by hand, which is why it drifts. Copy the **single-column** full-stack build (`cv/main_fullstack.pdf`), never the one-page sidebar. A CV downloaded from a public site often gets fed into an ATS, and the sidebar is two-column, so text extraction interleaves the rail into the body and drops the skills list between job titles and dates. Check two things on every swap: the headline reads Senior Full-Stack Engineer, and Education reads "Computer Science, then Data Science (both unfinished)". No degree was ever conferred.
- `public/credentials/testgorilla-assessment.pdf`: a TestGorilla assessment (React / Node / AI / Python), 86th percentile overall, completed 2026-08-19. LinkedIn links to it, but the site doesn't.
- `public/santiago-paz.png`: an 800x800 headshot, taken outdoors.
- Award: 3rd place globally at the Hack-Nation Global AI Hackathon (2,000+ participants) in 2026, from the YETI Fellowship and Startup Factory boOst in Dresden.
- Icons: an SP monogram set in `app/icon.png`, `app/apple-icon.png` and `app/favicon.ico`.
- Missing, and never to be made up: testimonials, project screenshots, and usage or revenue numbers for the side products. The three live demos could supply real screenshots.

## Product Principles

1. Recruiters come first. Role, stack, location, work permit, CV and email are easy to find and stated plainly. Engineering depth is there for readers who want it, and it never slows the recruiter down.
2. Show whole products. The edge is solo, end-to-end work, so each project states Santiago's role across the stack and links to a demo or repo when one exists.
3. Claim only what holds up. Mark work in progress, name the open-source code a project builds on, and take numbers from the data files instead of estimating.
4. Tell one story on four surfaces. The site never contradicts LinkedIn, the GitHub README or the CV PDF.
5. Practice what the site claims. It claims accessibility and SEO skill, so it meets WCAG 2.2 AA and keeps its structured data, FAQ and `llms.txt` correct.

## Accessibility & Inclusion

WCAG 2.2 AA is the floor on every page because Santiago lists accessibility as a skill. A failure here undercuts that claim. The skip link and the visible focus ring stay.
