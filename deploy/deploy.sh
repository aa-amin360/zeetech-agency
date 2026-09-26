#!/usr/bin/env bash
# Update the live site after pulling new code:  ./deploy/deploy.sh
set -euo pipefail
cd "$(dirname "$0")/.."

npm ci
NODE_ENV=production npm run migrate   # apply any new database changes first
npm run build            # the build reads content from the database
pm2 reload zeetech || pm2 start deploy/ecosystem.config.cjs
pm2 save
echo "Deployed."
