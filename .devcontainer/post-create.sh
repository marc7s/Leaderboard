#!/bin/bash
# Runs once after the devcontainer is created.
set -euo pipefail
cd /workspaces/Leaderboard

# node_modules are Docker volumes, which start out owned by root
sudo chown node:node Backend/node_modules AutoTime/node_modules Frontend/node_modules

for project in Backend AutoTime Frontend; do
  echo "Installing $project dependencies..."
  (cd "$project" && npm ci)
done

# Create the database (or apply new migrations) and fill a new one with seed data
(cd Backend && npm run db:deploy && npm run db:seed)

# Files that are git-ignored but needed to run in development
if [ ! -f Frontend/src/environments/environment.dev.ts ]; then
  cp Frontend/src/environments/environment.ts Frontend/src/environments/environment.dev.ts
  echo "Created Frontend/src/environments/environment.dev.ts"
fi
if [ ! -f AutoTime/src/cache/addedTimes.json ]; then
  cp AutoTime/src/cache/addedTimes.json.example AutoTime/src/cache/addedTimes.json
  echo "Created AutoTime/src/cache/addedTimes.json"
fi
