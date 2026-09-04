#!/bin/bash
# Double-click to publish the portfolio.
# You will be asked whether to deploy to Vercel or only push to GitHub.

cd "$(dirname "$0")" || exit 1
export PUBLISH_PAUSE=1
bash "./scripts/publish.sh"
