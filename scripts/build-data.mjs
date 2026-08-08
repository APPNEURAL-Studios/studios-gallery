// Regenerates studios.json from the sibling Studios/ workspace.
//
// Run manually whenever a studio is added, renamed, or its README changes:
//
//   node scripts/build-data.mjs
//
// The result is committed so that CI builds need no network access. Only
// works inside the full `Studios/` checkout, since it reads sibling repos.
import { readdirSync, readFileSync, existsSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const studiosRoot = join(root, "..");
const ORG = "APPNEURAL-Studios";

function parseReadme(path) {
  const lines = readFileSync(path, "utf8").split("\n");
  const title = lines[0].replace(/^#\s*/, "").trim();
  const tagline = (lines[2] || "").trim();
  const description = (lines[4] || "").trim();
  return { title, tagline, description };
}

function countEditors(path) {
  const lines = readFileSync(path, "utf8").split("\n");
  return lines.filter((l) => /^\|\s*\d+\s*\|/.test(l)).length;
}

function countServices(readmePath) {
  const content = readFileSync(readmePath, "utf8");
  const match = content.match(/Functional services \((\d+)\)/);
  return match ? Number(match[1]) : 0;
}

const isStudioPackage = (name) =>
  existsSync(join(studiosRoot, name, "README.md")) &&
  existsSync(join(studiosRoot, name, "EDITORS.md")) &&
  existsSync(join(studiosRoot, name, "wrangler.jsonc"));

const slugs = readdirSync(studiosRoot, { withFileTypes: true })
  .filter((e) => e.isDirectory() && e.name !== "studios-gallery" && !e.name.startsWith("."))
  .map((e) => e.name)
  .filter(isStudioPackage);

const studios = slugs
  .map((slug) => {
    const dir = join(studiosRoot, slug);
    const { title, tagline, description } = parseReadme(join(dir, "README.md"));
    const editorCount = countEditors(join(dir, "EDITORS.md"));
    const serviceCount = countServices(join(dir, "README.md"));
    const wrangler = readFileSync(join(dir, "wrangler.jsonc"), "utf8");
    const hostMatch = wrangler.match(/"pattern":\s*"([a-z0-9-]+)\.studio\.appneural\.com"/);
    const host = hostMatch ? hostMatch[1] : slug.replace(/-studio$/, "");
    return {
      slug,
      host,
      title,
      tagline,
      description,
      editorCount,
      serviceCount,
      url: `https://${host}.studio.appneural.com`,
      devUrl: `https://${host}-dev.studio.appneural.com`,
      repo: `https://github.com/${ORG}/${slug}`,
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

writeFileSync(join(root, "studios.json"), JSON.stringify(studios, null, 2) + "\n");
console.log(`wrote ${studios.length} studios to studios.json`);
