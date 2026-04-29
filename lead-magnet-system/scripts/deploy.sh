#!/bin/bash
# Deploy script: git push + vercel deploy --prod
# Called by /landing-page and /execute-lead-magnets commands

set -e

export PATH="$HOME/local/bin:$PATH"

COMMIT_MSG="${1:-Deploy lead magnet assets}"

echo "→ Staging changes..."
git add website/lead-magnets/

echo "→ Committing..."
git commit -m "$COMMIT_MSG" || echo "Nothing new to commit."

echo "→ Pushing to GitHub..."
git push origin main

echo "→ Deploying to Vercel..."
node "$HOME/local/bin/vercel" deploy --prod --yes

echo "✓ Done. Live at https://mac-funnels.vercel.app"
