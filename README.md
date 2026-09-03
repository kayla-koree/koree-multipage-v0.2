# Koree Multi-page Website Prototype v0.2

This version changes the previous single-page prototype into a multi-page static site.

## Main pages
- `/index.html` — Home
- `/play/index.html` — Korean Type Check
- `/play/result.html` — sample result
- `/shop/index.html` — product catalog
- `/shop/fan-letter.html`
- `/shop/k-talk.html`
- `/shop/flashcards.html`
- `/shop/k-ode.html`
- `/discover/index.html` — magazine
- `/discover/*.html` — sample article pages
- `/get-a-piece-of-koree/index.html` — free 5-expression email capture
- `/about/index.html`
- `/faq/index.html`
- `/contact/index.html`
- `/login/index.html`
- `/signup/index.html`
- `/dashboard/index.html`
- `/account/index.html`
- `/privacy/index.html`
- `/terms/index.html`

## Real Etsy links
The four product detail pages use the exact Etsy listing URLs supplied in the brief:
1. Korean Fan Letter Guidebook
2. K-POP Korean Travel Dialogs for Beginners / Piece of K-Talk
3. My First Korean Alphabet Flashcards
4. Piece of K-ODE: Real Korean Nuance

## Logo
The uploaded brand-board image was supplied as PNG in this conversation rather than an actual SVG. The KOREE wordmark + lime dot was extracted from that file into:
`/assets/koree-logo.png`

## Prototype behavior
- Responsive navigation + mobile menu
- FAQ accordion
- Optional Korean speech using browser SpeechSynthesis
- Quiz interaction sample
- Newsletter/contact success-state demos
- Product buttons open live Etsy listings in a new tab

## Next production connections
- Daily Discovery content DB
- Rotating Play question bank + 5-type scoring
- User accounts/authentication
- Saved discovery dashboard
- Email provider
- Blogger RSS/API for Discover
- Real product images / product metadata
- Analytics + consent
- Final privacy/terms text
- Production deployment and URL routing

## Local preview
For the most reliable local preview, serve this folder with a simple static server (for example VS Code Live Server). The internal links are also written with relative paths so the files can be inspected locally.
