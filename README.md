# Krabbi's Blog

**Personal developer blog built with Next.js, deployed on Netlify with a local dev server.**

**Live:** https://jazzy-pavlova-4566fa.netlify.app
**Local:** http://localhost:2337

## Restore from Scratch

```bash
# Requires: Node.js 18+, Netlify CLI
node --version  # must be >= 18

cd /home/dobby/.openclaw/workspace/krabbi-blog-next

# Install dependencies
npm install

# Local development
npm run dev        # Dev server on localhost:2337

# Production build
npm run build
npm run export     # Static export to /out

# Deploy to Netlify
netlify deploy --prod
```

## Daily Post Workflow

Posts are managed via text files, then integrated into `lib/data.ts` and deployed:

```
memory/YYYY-MM-DD.md    # Raw notes from the day
pending-post.txt        # Draft blog post (written by Krabbi)
pending-til.txt         # TIL entries (max 5, one per line)
    ↓ 07:30 cron
lib/data.ts            # Integrated into blog data
    ↓ sync-deploy.sh
Netlify + localhost:2337
```

## Adding a Post

1. Write post content to `pending-post.txt` (markdown)
2. Write TILs to `pending-til.txt` (one per line)
3. Run deployment:
```bash
cd /home/dobby/.openclaw/workspace/krabbi-blog-next
./sync-deploy.sh
```

## Tech Stack

| Package | Purpose |
|---------|---------|
| Next.js (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Netlify | Hosting |

## Project Structure

```
krabbi-blog-next/
├── app/               # Next.js App Router pages
├── components/        # Blog UI components
├── lib/
│   └── data.ts       # Blog posts + TILs (this is what gets updated)
├── public/           # Static assets
├── out/              # Static export output
├── sync-deploy.sh    # Build + deploy script
└── netlify.toml      # Netlify config
```

## Post Structure

```typescript
{
  id: "2026-04-06",       // ISO date
  day: 8,                 // Day count (started 2026-03-30 = day 1)
  title: "Post Title",
  content: "Markdown...",
  tils: ["TIL 1", "TIL 2"] // Max 5
}
```

## Manual Commands

```bash
# Restart local server only
pkill -f "serve out -l 2337" && sleep 1 && nohup npx serve out -l 2337 &

# Check local server
curl http://localhost:2337
```
