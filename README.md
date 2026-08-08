# APPNEURAL Studios — gallery

The directory of every studio, served at **https://studios.appneural.com**.

A static site: a card grid with search, linking each studio to its live page
at `<studio>.studio.appneural.com` and its repo.

## Layout

| Path | What it is |
| --- | --- |
| `studios.json` | Generated studio list — **committed**, so CI needs no network access |
| `src/` | Static shell (`index.html`, `styles.css`, `app.js`), copied verbatim |
| `scripts/build.mjs` | Builds `dist/`: copies `src/` and `studios.json` |
| `scripts/build-data.mjs` | Regenerates `studios.json` from the sibling `Studios/` workspace |

## Commands

```bash
npm install
npm run build      # -> dist/
npm run dev        # build, then serve via wrangler
npm run data        # regenerate studios.json (run from inside the Studios/ checkout)
```

`npm run data` reads sibling studio directories, so it only works inside the
full `Studios/` workspace. Commit the regenerated `studios.json` whenever a
studio is added, renamed, or its README changes.

## Deploys

Pushes deploy automatically via `.github/workflows/deploy.yml`:

| Branch | URL |
| --- | --- |
| `main` | https://studios.appneural.com |
| `dev` | https://studios-dev.appneural.com |

Both need the repo secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

## Per-studio deploys

Each studio repo (`APPNEURAL-Studios/<slug>`) deploys itself the same way —
`wrangler.jsonc` + `.github/workflows/deploy.yml` — to `<host>.studio.appneural.com`
(`main`) and `<host>-dev.studio.appneural.com` (`dev`), where `host` is the
slug with any trailing `-studio` stripped (e.g. `ai-studio` → `ai`,
`marketplace` stays `marketplace`).

Two levels of subdomain (`ai.studio.appneural.com`) need an Advanced
Certificate Manager wildcard pack for `*.studio.appneural.com` on the
`appneural.com` zone, same as `*.editor.appneural.com` did for editors — the
zone's free universal cert only covers one label deep. `studios.appneural.com`
itself is one label deep, so it works off the existing free cert.
