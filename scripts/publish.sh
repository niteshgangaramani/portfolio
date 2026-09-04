#!/usr/bin/env bash
# Publish portfolio: save changes → GitHub → optional Vercel deploy
#
# Flags:
#   --deploy      Push AND deploy (adds [deploy] to commit message)
#   --no-deploy   Push only, do not deploy (adds [skip vercel] [skip ci])
#
# Non-coders: double-click "Publish Website.command"
# Or run: npm run publish-site
#         npm run publish-site -- --deploy
#         npm run publish-site -- --no-deploy

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

RED=$'\033[0;31m'
GREEN=$'\033[0;32m'
GOLD=$'\033[0;33m'
CYAN=$'\033[0;36m'
BOLD=$'\033[1m'
RESET=$'\033[0m'

DO_DEPLOY=""
SKIP_COMMIT=0

banner() {
  echo ""
  echo "${BOLD}${CYAN}════════════════════════════════════════${RESET}"
  echo "${BOLD}${CYAN}  Portfolio Publish — Commit · Push · Deploy${RESET}"
  echo "${BOLD}${CYAN}════════════════════════════════════════${RESET}"
  echo ""
}

fail() {
  echo ""
  echo "${RED}✗ $1${RESET}"
  echo ""
  exit 1
}

ok() {
  echo "${GREEN}✓ $1${RESET}"
}

info() {
  echo "${GOLD}→ $1${RESET}"
}

pause_exit() {
  echo ""
  echo "Press Enter to close this window..."
  read -r _
}

usage() {
  cat <<'EOF'
Usage: publish.sh [--deploy | --no-deploy]

  --deploy      Save, push to GitHub, and deploy to Vercel
  --no-deploy   Save and push to GitHub only (no deploy)

  With no flag, you will be asked whether to deploy.
EOF
}

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --deploy|-d)
      DO_DEPLOY=1
      shift
      ;;
    --no-deploy|--skip-deploy)
      DO_DEPLOY=0
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      fail "Unknown option: $1 (use --deploy or --no-deploy)"
      ;;
  esac
done

if [[ "${PUBLISH_PAUSE:-}" == "1" ]]; then
  trap pause_exit EXIT
fi

banner

command -v git >/dev/null 2>&1 || fail "Git is not installed. Install Xcode Command Line Tools first."
command -v npm >/dev/null 2>&1 || fail "Node/npm is not installed. Install Node.js from https://nodejs.org"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  fail "This folder is not a Git repository."
fi

BRANCH="$(git branch --show-current)"
REMOTE_URL="$(git remote get-url origin 2>/dev/null || true)"

info "Project: $(basename "$ROOT")"
info "Branch:  $BRANCH"
[[ -n "$REMOTE_URL" ]] && info "GitHub:  $REMOTE_URL"
echo ""

# --- Deploy flag ---
if [[ -z "$DO_DEPLOY" ]]; then
  echo "Do you want to deploy the live website on Vercel?"
  echo "  Y = push + deploy"
  echo "  N = push only (no deploy)"
  read -r -p "Deploy to Vercel? (y/N): " DEPLOY_ANS
  if [[ "${DEPLOY_ANS:-}" =~ ^[Yy]$ ]]; then
    DO_DEPLOY=1
  else
    DO_DEPLOY=0
  fi
  echo ""
fi

if [[ "$DO_DEPLOY" -eq 1 ]]; then
  info "Mode: PUSH + DEPLOY  (commit flag: [deploy])"
else
  info "Mode: PUSH ONLY       (commit flags: [skip vercel] [skip ci])"
fi
echo ""

# --- Status ---
CHANGES="$(git status --porcelain)"
if [[ -z "$CHANGES" ]]; then
  echo "No new file changes to save."
  echo ""
  read -r -p "Push current branch anyway? (y/N): " PUSH_ANYWAY
  if [[ ! "${PUSH_ANYWAY:-}" =~ ^[Yy]$ ]]; then
    ok "Nothing to do. Exiting."
    exit 0
  fi
  SKIP_COMMIT=1
else
  echo "${BOLD}Files that will be published:${RESET}"
  git status --short
  echo ""
fi

# --- Commit message ---
DEFAULT_MSG="Update portfolio content $(date '+%Y-%m-%d %H:%M')"
MSG=""
if [[ "$SKIP_COMMIT" -eq 0 ]]; then
  echo "Write a short note about what you changed"
  echo "(example: Updated hero photo and contact phone)"
  read -r -p "Your note: " USER_MSG
  MSG="${USER_MSG:-$DEFAULT_MSG}"
  MSG="$(echo "$MSG" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
  [[ -z "$MSG" ]] && MSG="$DEFAULT_MSG"
else
  # Empty commit so deploy/skip flags can be attached for this push
  MSG="Publish $(date '+%Y-%m-%d %H:%M')"
fi

# Strip any existing deploy/skip flags then append the correct ones
MSG="$(echo "$MSG" | sed -E 's/\[deploy\]//gi; s/\[skip vercel\]//gi; s/\[skip ci\]//gi; s/\[ci skip\]//gi; s/  +/ /g; s/^[[:space:]]*//;s/[[:space:]]*$//')"

if [[ "$DO_DEPLOY" -eq 1 ]]; then
  MSG="${MSG} [deploy]"
else
  MSG="${MSG} [skip vercel] [skip ci]"
fi

echo ""
info "Commit message: $MSG"
echo ""
read -r -p "Continue? (Y/n): " CONFIRM
if [[ "${CONFIRM:-Y}" =~ ^[Nn]$ ]]; then
  ok "Cancelled. No changes were published."
  exit 0
fi
echo ""

# --- Build check ---
info "Checking the site builds..."
if npm run lint >/dev/null 2>&1 && npm run build >/dev/null 2>&1; then
  ok "Build check passed"
else
  echo "${RED}Build check failed.${RESET}"
  read -r -p "Publish anyway? (y/N): " FORCE
  [[ "${FORCE:-}" =~ ^[Yy]$ ]] || fail "Stopped. Fix build errors first, or ask your developer."
fi

# --- Commit ---
info "Saving changes (git commit)..."
if [[ "$SKIP_COMMIT" -eq 0 ]]; then
  git add -A
  if git diff --cached --quiet; then
    # still create empty commit for flags if needed for push semantics
    git commit --allow-empty -m "$MSG"
    ok "Empty commit created (flags only)"
  else
    git commit -m "$MSG"
    ok "Changes saved locally"
  fi
else
  git commit --allow-empty -m "$MSG"
  ok "Publish commit created"
fi

# --- Push ---
info "Uploading to GitHub..."
if git push -u origin HEAD; then
  ok "Uploaded to GitHub ($BRANCH)"
else
  fail "GitHub upload failed. Check your internet / GitHub login."
fi

# --- Deploy (CLI) only when flagged ---
DEPLOYED=0
if [[ "$DO_DEPLOY" -eq 1 ]]; then
  echo ""
  info "Deploying to Vercel..."
  if command -v vercel >/dev/null 2>&1; then
    if vercel --prod --yes; then
      ok "Deployed with Vercel CLI"
      DEPLOYED=1
    else
      info "Vercel CLI failed — if the project is linked, [deploy] push may still auto-deploy."
    fi
  elif npx --yes vercel --version >/dev/null 2>&1; then
    if npx --yes vercel --prod --yes; then
      ok "Deployed with Vercel (npx)"
      DEPLOYED=1
    else
      info "Vercel CLI failed — if the project is linked, [deploy] push may still auto-deploy."
    fi
  else
    info "Vercel CLI not found — relying on GitHub → Vercel for [deploy] pushes."
  fi
else
  echo ""
  info "Deploy skipped (as requested)."
fi

echo ""
echo "${BOLD}${GREEN}════════════════════════════════════════${RESET}"
if [[ "$DO_DEPLOY" -eq 1 ]]; then
  echo "${BOLD}${GREEN}  Done! Code pushed with DEPLOY flag.${RESET}"
else
  echo "${BOLD}${GREEN}  Done! Code pushed WITHOUT deploy.${RESET}"
fi
echo "${BOLD}${GREEN}════════════════════════════════════════${RESET}"
echo ""
if [[ "$DO_DEPLOY" -eq 1 ]]; then
  if [[ "$DEPLOYED" -eq 1 ]]; then
    echo "Live deploy was triggered from this computer."
  else
    echo "GitHub has your latest code with [deploy]."
    echo "Vercel / Actions should update production in 1–2 minutes."
  fi
else
  echo "GitHub has your latest code."
  echo "Live site was NOT updated ([skip vercel])."
fi
echo ""
echo "Check status: https://vercel.com/dashboard"
echo "Repo:         $REMOTE_URL"
echo ""
