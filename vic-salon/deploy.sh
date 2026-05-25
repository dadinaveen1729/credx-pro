#!/bin/bash
# ============================================================
#  VIC SALON — One-click deploy to GitHub + Vercel
#  Just run:  bash deploy.sh
# ============================================================

set -e
REPO_NAME="vic-salon"
REPO_DESC="VIC Salon – Luxury Hair & Beauty, Jubilee Hills Hyderabad"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║   VIC SALON — Auto Deploy Script     ║"
echo "╚══════════════════════════════════════╝"
echo ""

# ---------- 1. Check tools ----------
check_tool() {
  if ! command -v "$1" &>/dev/null; then
    echo "⚠️  $1 not found. Installing..."
    case "$1" in
      gh)    brew install gh 2>/dev/null || (curl -sS https://webi.sh/gh | sh) ;;
      vercel) npm install -g vercel 2>/dev/null ;;
      git)   echo "❌ Git is required. Install from https://git-scm.com"; exit 1 ;;
    esac
  fi
}

check_tool git
check_tool gh
check_tool vercel

# ---------- 2. Git init ----------
if [ ! -d ".git" ]; then
  echo "📁 Initialising git repository..."
  git init
  git branch -M main
fi

# Create .gitignore
cat > .gitignore << 'EOF'
.DS_Store
Thumbs.db
*.log
deploy.sh
EOF

git add -A
git commit -m "🚀 VIC Salon website — initial deploy" 2>/dev/null || \
git commit --allow-empty -m "🚀 VIC Salon website — update" 2>/dev/null || true

# ---------- 3. GitHub auth + create repo ----------
echo ""
echo "🔑 Checking GitHub login..."
gh auth status 2>/dev/null || gh auth login --web

echo ""
echo "📦 Creating GitHub repository '$REPO_NAME'..."
# Delete if exists and re-create, or just push
gh repo create "$REPO_NAME" --public --description "$REPO_DESC" --source=. --remote=origin --push 2>/dev/null || {
  echo "   (Repo may already exist — pushing to existing...)"
  GITHUB_USER=$(gh api user --jq '.login')
  git remote remove origin 2>/dev/null || true
  git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
  git push -u origin main --force
}

GITHUB_USER=$(gh api user --jq '.login')
GITHUB_URL="https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""
echo "✅ GitHub: $GITHUB_URL"

# ---------- 4. Vercel deploy ----------
echo ""
echo "🌐 Deploying to Vercel..."
vercel --yes --prod 2>/dev/null || vercel login && vercel --yes --prod

# Get the live URL
LIVE_URL=$(vercel ls 2>/dev/null | grep "$REPO_NAME" | head -1 | awk '{print $2}' 2>/dev/null || echo "Check https://vercel.com/dashboard")

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║   🎉 DEPLOYMENT COMPLETE!                        ║"
echo "╠══════════════════════════════════════════════════╣"
echo "║   GitHub : $GITHUB_URL"
echo "║   Live   : https://$REPO_NAME.vercel.app"
echo "║   (or check vercel.com/dashboard for exact URL)  ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
