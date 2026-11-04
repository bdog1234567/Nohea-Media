# Claude Code in VS Code — Setup Guide

## Prerequisites
- VS Code installed
- Node.js installed (you already have this)
- Git installed and configured (you already have this)

## Step 1: Install Claude Code Extension
1. Open VS Code
2. Press `Ctrl+Shift+X` to open Extensions
3. Search for **"Claude Code"** by Anthropic
4. Click **Install**

## Step 2: Open Your Project
1. In VS Code, go to **File → Open Folder**
2. Navigate to `C:\Users\brade\Desktop\New folder`
3. Click **Select Folder**

## Step 3: Launch Claude Code
1. Open the VS Code terminal with `Ctrl+``
2. Type `claude` and press Enter
3. Sign in with your Anthropic account when prompted

## Step 4: Git is Already Connected
Your repo is already linked to:
```
https://github.com/bdog1234567/Nohea-Media
```
- **Branch**: `master` (deployed via GitHub Pages)
- **Site URL**: https://noheamedia.com

## Step 5: Give Claude Context
When starting a new chat, paste this to get Claude up to speed:

> This is the Nohea Media portfolio site for Braden Di Mauro. It's a static HTML/CSS/JS site (no frameworks) deployed on GitHub Pages from the master branch. The repo is bdog1234567/Nohea-Media. Always commit and push changes to master after editing so the live site updates. The site ("the dark room" design, Nov 2026) has a hero reel, 7 YouTube films grouped by category, 12 generative stills, About, and Contact (Web3Forms).

## Project Structure
```
index.html    — Main page (all sections)
style.css     — All styles (CSS variables, dark theme, responsive)
script.js     — Nav, filters, YouTube lazy loading, scroll animations, form
logo.png      — Brand logo (dark, inverted to white via CSS)
favicon.png   — Square favicon for browser tab
og-image.png  — Open Graph image for link previews (white logo on black)
CNAME         — Custom domain config (noheamedia.com)
```

## Design (Nov 2026 redesign: "the dark room")
One near-black field; the work is the lit thing in it. One typeface (Newsreader, Google Fonts),
one accent (crimson #b11226) used only on actions. No external JS libraries.

- Hero: name + the 9:16 reel (`newhero.mp4` desktop at original quality, `newhero-mobile.mp4` on
  phones; keep the `data-src-desktop` / `data-src-mobile` attributes). `hero-poster.jpg` is its first frame.
- Films: a list grouped by category; on desktop the chosen film shows on a sticky stage, on phones
  each film plays in its own frame.
- Stills: 12 generative stills in `stills/`, in three uneven tracks. Only the frame under the
  pointer (or nearest the middle of the screen) is lit. Click opens the viewer.

## Films (current)
| # | Title | Video ID | Group | Shape |
|---|-------|----------|-------|-------|
| 1 | H&M spec ad | crHRXVX3aHU | AI generative | tall |
| 2 | Saint Laurent spec ad | mf-8dzWB6WU | AI generative | tall |
| 3 | South Bay real estate spec ad | 7QEYkuHp5iA | AI generative | wide |
| 4 | Fire VFX | ACfLZuihFbk | VFX | wide |
| 5 | 3D tracking | tlSXv_czMxo | VFX | wide |
| 6 | Director reel | -38tTSXcPxs | Editing and motion | wide |
| 7 | Logo animation | QGd1htOqKSw | Editing and motion | wide |

## How to Add a New Film
Copy this into the right group's `<ul class="film-list">` in index.html:

```html
<li class="film reveal" data-video-id="YOUTUBE_ID" data-shape="wide" data-title="Title" data-meta="Spec ad">
  <button class="film-pick" type="button">
    <span class="film-title">Title</span>
    <span class="film-meta">Spec ad</span>
  </button>
  <div class="film-media">
    <img src="https://i.ytimg.com/vi/YOUTUBE_ID/maxresdefault.jpg" alt="Still from Title" loading="lazy" width="1280" height="720" />
  </div>
</li>
```

- Vertical videos (Shorts): `data-shape="tall"` and use `https://i.ytimg.com/vi/YOUTUBE_ID/oar2.jpg` (1080x1920).
- Extract the ID from `youtube.com/watch?v=ID` or `youtube.com/shorts/ID`.
- Bump the `?v=` numbers on `style.css` / `script.js` in index.html after editing them.
