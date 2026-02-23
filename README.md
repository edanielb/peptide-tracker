# PeptideTracker

A transparent, community-driven repository of self-reported peptide experiences. Browse structured data. No medical claims. No vendor links. Just user reports.

## What is this?

PeptideTracker is an open-data platform where users can submit and browse structured experience reports about peptides. It surfaces patterns from self-reported data -- not clinical claims.

## Features (Phase 1 MVP)

- **Browse Peptides** -- Search, filter by category/goal, grid & list views
- **Peptide Profiles** -- Per-peptide analytics with charts (effectiveness distribution, goals breakdown, dosage vs effectiveness, time to effect)
- **Submit Reports** -- Structured 3-step form with validation (requires authentication)
- **Analytics Dashboard** -- Cross-peptide insights: top rated, most common side effects, cycle lengths by goal
- **Moderation Queue** -- Flag/approve/remove reports
- **Legal Safety** -- Disclaimers on every page, no sourcing or vendor links

## Tech Stack

- React (single-file prototype)
- Recharts for data visualization
- Lucide React for icons

### Production Stack (Planned)

- Frontend: Next.js
- Backend: Supabase
- Auth: Email + OAuth
- Charts: Recharts
- Moderation: OpenAI moderation API
- Hosting: Vercel

## Getting Started

```bash
npm install
npm run dev
```

## Disclaimer

This platform shares user-reported experiences only. This is not medical advice. Peptides may not be FDA approved. Consult a licensed healthcare professional before use.

## License

MIT
