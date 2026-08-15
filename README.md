# santiagopaz.com

Personal site of Santiago Paz — AI engineer, Berlin.

Next.js (App Router) built as a **static export** and published to GitHub Pages
at [santiagopaz.com](https://santiagopaz.com).

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

```bash
pnpm lint
pnpm test         # vitest — unit tests for the data/posts layer
pnpm test:e2e     # playwright
pnpm build        # static export → ./out
```

## Content

Everything the site renders comes from data files, not from JSX:

| File                   | Contents                                          |
| ---------------------- | ------------------------------------------------- |
| `data/profile.json`    | Name, role, tagline, links, awards                |
| `data/experience.json` | Roles, education, certifications (mirrors LinkedIn) |
| `data/projects.json`   | Project cards and detail pages                    |
| `data/faq.json`        | FAQ block on `/about` (drives FAQPage schema)     |
| `content/posts/*.md`   | Writing, front-matter parsed by `gray-matter`     |

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs lint,
tests and `next build`, then publishes `out/` to GitHub Pages.

Two details that matter for Pages:

- `public/CNAME` keeps the `santiagopaz.com` custom domain bound on each deploy.
- `.nojekyll` stops Jekyll from stripping the `_next/` asset directory.

Because it is a static export, anything requiring a server at request time
(Server Actions, ISR, dynamic Route Handlers, `next/image` optimization) is
unavailable — metadata routes are pinned with `export const dynamic = 'force-static'`.
