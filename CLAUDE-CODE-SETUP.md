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
https://github.com/bdog1234567/webstite3.git
```
- **Branch**: `master` (deployed via GitHub Pages)
- **Site URL**: https://bdog1234567.github.io/webstite3/

## Step 5: Give Claude Context
When starting a new chat, paste this to get Claude up to speed:

> This is the Nohea Media portfolio site for Braden Di Mauro. It's a static HTML/CSS/JS site (no frameworks) deployed on GitHub Pages from the master branch. The repo is bdog1234567/webstite3. Always commit and push changes to master after editing so the live site updates. The site has 7 portfolio cards with YouTube video embeds, category filters (All/VFX/AI Generative/Editing & Motion), and sections for Portfolio, About, and Contact.

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

## Portfolio Cards (current)
| # | Title | Video ID | Category | Format |
|---|-------|----------|----------|--------|
| 1 | H&M Spec Ad | crHRXVX3aHU | AI Generative | Portrait |
| 2 | Saint Laurent Spec Ad | mf-8dzWB6WU | AI Generative | Portrait |
| 3 | South Bay Real Estate Spec Ad | 7QEYkuHp5iA | AI Generative | Landscape |
| 4 | Fire VFX | ACfLZuihFbk | VFX | Landscape |
| 5 | 3D Tracking | tlSXv_czMxo | VFX | Landscape |
| 6 | Director Reel | -38tTSXcPxs | Editing / Motion | Landscape |
| 7 | Logo Animation | QGd1htOqKSw | Editing / Motion | Landscape |

## How to Add a New Video
To add a new portfolio card, copy this template and add it before `</div><!-- /portfolio-grid -->` in index.html:

```html
<article class="portfolio-card" data-category="CATEGORY" data-video-id="YOUTUBE_ID">
  <div class="card-media">
    <div class="card-thumbnail">
      <img alt="TITLE" class="thumb-img" loading="lazy" />
      <div class="card-overlay">
        <button class="play-btn" aria-label="Play TITLE">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
        </button>
      </div>
      <div class="card-info-overlay">
        <span class="card-tag">TAG_LABEL</span>
        <h3 class="card-title">TITLE</h3>
      </div>
    </div>
  </div>
</article>
```

- For portrait (9:16) videos, add `data-format="portrait"` so the video opens in a tall player
- Categories: `ai`, `vfx`, `editing`
- Extract video ID from YouTube URL: `youtube.com/watch?v=VIDEO_ID` or `youtube.com/shorts/VIDEO_ID`
- The thumbnail loads automatically from YouTube; clicking a card opens the video in a full-screen lightbox
- If the number of visible cards is odd, the last one is centred automatically
