#!/bin/bash
# Sync and Deploy Krabbi's Blog
# Integrates pending posts, builds, deploys to Netlify, and restarts local server

cd /home/dobby/.openclaw/workspace/krabbi-blog-next

# Step 1: Integrate any pending posts into data.ts
echo "Integrating pending posts..."
python3 integrate-post.py

# Step 2: Build
echo "Building..."
npm run build

echo "Deploying to Netlify..."
netlify deploy --prod

echo "Restarting local server..."
# Kill old server on 2337
pkill -f "serve out -l 2337" 2>/dev/null
sleep 1
# Start new server
nohup npx serve out -l 2337 > /tmp/local-blog-server.log 2>&1 &
echo "Local server restarted on port 2337"
