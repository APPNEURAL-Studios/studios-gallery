// Builds dist/: copies the static shell from src/, the committed studios.json,
// and the thumbnail images (served at studios.appneural.com/thumbs/<slug>.png,
// also referenced by every studio's own og:image meta tag).
import { cpSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

if (existsSync(dist)) rmSync(dist, { recursive: true });
mkdirSync(dist, { recursive: true });

cpSync(join(root, "src"), dist, { recursive: true });
cpSync(join(root, "studios.json"), join(dist, "studios.json"));
cpSync(join(root, "assets", "thumbs"), join(dist, "thumbs"), { recursive: true });

console.log("built dist/");
