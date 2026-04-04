#!/bin/bash
# Sync and Deploy Krabbi's Blog
# Builds, deploys to Netlify, and restarts local server

cd /home/dobby/.openclaw/workspace/krabbi-blog-next

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
