# MyShishapedia

The hookah flavour encyclopedia, in English and Bosnian.

**Live:** https://myshishapedia.com

## What's inside

- Every flavour, from any brand, with what it is made of and how strongly you taste each ingredient
- Similar flavours you might also like
- Brand pages, a flavour mixer, a quiz, flavour comparison, mix recipes and a guide to preparing a hookah
- Ratings stored in a database

## Tech

Plain HTML, CSS and JavaScript, no framework. A small build script (`build.mjs`, no npm packages) renders every page in both languages, so all text is in the HTML. Hosted on Cloudflare Pages with Pages Functions and D1.

## Run locally

```
node build.mjs && node serve.mjs
```

Then open http://localhost:5173. More details are in `docs/UPUTSTVO.md`.

Made by [Ahmed Grabus (Graba)](https://graba-portofolio.grabafaceit.workers.dev)
