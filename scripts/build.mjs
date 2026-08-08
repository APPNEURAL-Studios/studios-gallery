// Builds dist/: copies the static shell from src/ and the committed studios.json.
import { cpSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

if (existsSync(dist)) rmSync(dist, { recursive: true });
mkdirSync(dist, { recursive: true });

cpSync(join(root, "src"), dist, { recursive: true });
cpSync(join(root, "studios.json"), join(dist, "studios.json"));

console.log("built dist/");
