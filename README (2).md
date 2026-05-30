# 🏏 Cricket Scorer

A live, mobile-friendly cricket scoring web app — tracks **runs, overs, sixes, fours, wickets and extras** across both innings with a real-time target/RRR chase display.

**[▶ Live Demo](https://YOUR-USERNAME.github.io/cricket-scorer)**

---

## Features

- Score runs (0–6) with a single tap
- Wide and No Ball extras (don't consume a legal delivery)
- Wicket tracking with all-out detection
- Per-over ball-by-ball tracker (colour-coded dots)
- Live CRR and 2nd-innings RRR / balls remaining
- Ball-by-ball commentary log
- Undo last entry (or Ctrl+Z)
- Match result overlay
- Keyboard shortcuts: `0–6` for runs, `W` for wicket, `Ctrl+Z` to undo
- Works offline after first load (pure HTML/CSS/JS, no server needed)

---

## Project Structure

```
cricket-scorer/
├── index.html          # App shell & markup
├── css/
│   └── style.css       # All styling
├── js/
│   └── scorer.js       # All game logic
├── favicon.svg
├── .github/
│   └── workflows/
│       └── deploy.yml  # Auto-deploy to GitHub Pages
└── README.md
```

---

## 🚀 How to Put This on GitHub & Deploy (Step-by-Step)

### Prerequisites

- A free [GitHub account](https://github.com)
- [Git installed](https://git-scm.com/downloads) on your computer
- A code editor (e.g. [VS Code](https://code.visualstudio.com))

---

### Step 1 — Download the project files

Download or copy all project files into a folder on your computer named `cricket-scorer`.

Your folder should look like this:
```
cricket-scorer/
├── index.html
├── favicon.svg
├── README.md
├── css/style.css
├── js/scorer.js
└── .github/workflows/deploy.yml
```

---

### Step 2 — Create a GitHub repository

1. Go to [github.com](https://github.com) and sign in.
2. Click the **+** button (top-right) → **New repository**.
3. Name it `cricket-scorer`.
4. Leave it **Public**.
5. Do **NOT** tick "Add a README" (you already have one).
6. Click **Create repository**.

---

### Step 3 — Push your files to GitHub

Open your terminal (Command Prompt / Terminal app) and run these commands **one by one**:

```bash
# 1. Go into your project folder
cd cricket-scorer

# 2. Initialise Git
git init

# 3. Stage all files
git add .

# 4. Make the first commit
git commit -m "Initial commit – Cricket Scorer app"

# 5. Connect to your GitHub repo  (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/cricket-scorer.git

# 6. Push to GitHub
git branch -M main
git push -u origin main
```

> **Tip:** If Git asks for your GitHub password, use a [Personal Access Token](https://github.com/settings/tokens) instead (GitHub no longer accepts plain passwords).

---

### Step 4 — Enable GitHub Pages (auto-deploy)

The repo includes `.github/workflows/deploy.yml` which deploys automatically on every push.

You just need to activate GitHub Pages once:

1. Go to your repo on GitHub.
2. Click **Settings** → **Pages** (left sidebar).
3. Under **Source**, select **GitHub Actions**.
4. Click **Save**.

That's it! The next push will trigger the workflow and publish your app.

---

### Step 5 — View your live app

After the workflow finishes (usually < 1 minute):

```
https://YOUR-USERNAME.github.io/cricket-scorer
```

You can find the URL in **Settings → Pages**.

---

### Step 6 — Making changes later

Whenever you edit any file:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

GitHub Actions will automatically redeploy.

---

## Running Locally (No Server Needed)

Just open `index.html` in any browser — it works without a web server.

```bash
# Or use VS Code's Live Server extension for hot-reload during development
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0` – `6` | Score that many runs |
| `W` | Add a wicket |
| `Ctrl+Z` / `Cmd+Z` | Undo last entry |

---

## License

MIT — free to use, modify and share.
