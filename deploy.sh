#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="${1:-deenyx@ams1-shared-02.dreamhost.com}"
REMOTE_PATH="${2:-~/dyxmyx.com}"

npm run build

if [[ -f "public/.htaccess" ]]; then
	cp "public/.htaccess" "out/.htaccess"
fi

rsync -avz --delete out/ "$REMOTE_HOST:$REMOTE_PATH/"
