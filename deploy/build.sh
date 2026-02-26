#!/bin/bash
# Build frontend and prepare for deployment
set -e
cd "$(dirname "$0")/.."
echo "Installing dependencies..."
npm run install-all
echo "Building client..."
npm run build
echo "Build complete. Output: client/dist"
