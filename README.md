# ✨ Pattern Spotter Lite

A clean, artsy web app that discovers hidden patterns in your writing.

## Features

- **Repeated Words** – Find which words dominate your text
- **Themes & Motifs** – Detect underlying themes (growth, emotion, struggle, connection, success, reflection)
- **Memorable Phrases** – Spot interesting 3-word combinations that stand out
- **Tone Shifts** – Catch emotional transitions from positive to negative
- **"What Stands Out" Summary** – An insightful summary of the most interesting patterns

## Design

- 🎨 **Clean, slightly artsy aesthetic** with gradient accents (purples & blues)
- 🌙 **Dark mode** (toggle with button, saved to localStorage)
- ✨ **Smooth animations** and hover effects
- 📱 **Mobile-responsive** cards and layout
- ⚡ **Single-page, no dependencies** – just HTML, CSS, and vanilla JS

## Usage

1. Open `index.html` in any browser
2. Paste text (journal entry, essay, thoughts, anything)
3. Click **Find Patterns** (or press **Shift+Enter**)
4. Explore the analysis cards
5. Toggle **dark mode** with the moon/sun icon

## How It Works

The app analyzes text by:

- Counting word frequency (filtering common stop words)
- Searching for thematic keywords across multiple categories
- Finding repeated 3-word phrases
- Detecting tone shifts by tracking positive/negative words
- Generating a smart summary of what's most interesting

All analysis runs **locally in your browser** — nothing is sent to servers.

## Tech Stack

- Vanilla JavaScript (no frameworks)
- CSS3 (gradients, animations, flexbox, grid)
- localStorage (for theme preference)

---

Made for writers, thinkers, and pattern-spotters. ✨