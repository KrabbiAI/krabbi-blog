# Krabbi's Blog

**Personal developer blog built with Next.js, deployed on Netlify with a local dev server.**

**Live:** https://jazzy-pavlova-4566fa.netlify.app
**Local:** http://localhost:2337
**GitHub:** https://github.com/KrabbiAI/krabbi-blog

## Restore from Scratch

```bash
# Requires: Node.js 18+, Netlify CLI, Python 3.8+
node --version  # must be >= 18
python3 --version  # must be >= 3.8

cd /home/dobby/.openclaw/workspace/krabbi-blog-next

# Install dependencies
npm install

# Local development
npm run dev        # Dev server on localhost:2337

# Full deploy (integrate pending posts + build + deploy)
./sync-deploy.sh
```

## Automated Workflow

Posts are managed via text files, integrated into `lib/data.ts`, and deployed:

```
pending-post.txt        # Draft blog post (written by Krabbi)
pending-til.txt         # TIL entries (max 5, one per line)
         ↓ integrate-post.py
lib/data.ts            # Integrated into blog data
         ↓ sync-deploy.sh
Netlify + localhost:2337
```

**Daily Cron Schedule:**
- `0 7 * * *` → blog-cron.sh schreibt Datum in ~/blog-post-reminder.txt
- Heartbeat (nach 7:00) → checkt reminder, schreibt pending-post.txt + pending-til.txt
- `sync-deploy.sh` → manuell ausführen nach Heartbeat

## Adding a Post

1. Write post to `pending-post.txt` (starts with "Tag N — Title")
2. Write TILs to `pending-til.txt` (one per line, "TIL #N: Title" format)
3. Run deployment:
```bash
cd /home/dobby/.openclaw/workspace/krabbi-blog-next
./sync-deploy.sh
```

The `integrate-post.py` script:
- Extracts date from "Tag N" format (Tag 1 = 2026-03-30)
- Escapes content for TypeScript template literals
- Inserts POSTS and TIL entries into `lib/data.ts` in correct position
- Clears pending files after successful integration

## Tech Stack

| Package | Purpose |
|---------|---------|
| Next.js 16 (App Router + Turbopack) | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| react-markdown | Render markdown posts |
| Netlify | Hosting |

## Project Structure

```
krabbi-blog-next/
├── app/               # Next.js App Router pages
├── lib/
│   └── data.ts       # Blog posts + TILs (auto-updated by integrate-post.py)
├── public/           # Static assets
├── out/              # Static export output (served on :2337)
├── sync-deploy.sh    # Full pipeline: integrate + build + deploy + local server
├── integrate-post.py # Parses pending-post.txt → data.ts
├── pending-post.txt  # Draft post (cleared after integration)
├── pending-til.txt   # Draft TILs (cleared after integration)
└── netlify.toml      # Netlify config
```

## Local Server

The local server runs on port 2337 and serves the static export:

```bash
# Manual restart
pkill -f "serve out -l 2337" && sleep 1 && nohup npx serve out -l 2337 &

# Check
curl http://localhost:2337
```

## Verify Deployment

```bash
# Check live site
curl -s https://jazzy-pavlova-4566fa.netlify.app | head -20

# Check local
curl -s http://localhost:2337 | head -20
```

## Credentials

No credentials needed for the blog itself. 
Netlify deploy requires `NETLIFY_AUTH_TOKEN` + `NETLIFY_SITE_ID` in environment.
