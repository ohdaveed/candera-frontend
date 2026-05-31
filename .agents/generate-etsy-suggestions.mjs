#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";

const root = process.cwd();
const outPath = path.join(root, ".agents", "etsy-pr-suggestions.md");

const IGNORED = new Set(["node_modules", ".git", ".venv", ".cache", "dist", "build"]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (IGNORED.has(e.name)) continue;
      files.push(...(await walk(p)));
    } else {
      files.push(p);
    }
  }
  return files;
}

function containsAny(text, arr) {
  return arr.some((s) => text.includes(s));
}

async function main() {
  const allFiles = await walk(root);
  const etsyFiles = allFiles.filter(
    (f) =>
      f.includes(path.join("api", "etsy")) ||
      f.includes(path.join("scripts")) ||
      f.endsWith("useProductSync.js"),
  );

  const suggestions = [];
  for (const f of etsyFiles) {
    try {
      const txt = await fs.readFile(f, "utf8");
      if (containsAny(txt, ["findAllListingsActive", "listings/active"])) {
        suggestions.push({
          file: f,
          issue: "Use shop-scoped scan + batch-hydrate",
          detail:
            "Replace public active-listings scan with `getListingsByShop` then hydrate changed IDs with `/v3/application/listings/batch` to avoid missing non-active listings and to support efficient hydration.",
        });
      }
      if (containsAny(txt, ["x-api-key"])) {
        suggestions.push({
          file: f,
          issue: "Ensure x-api-key includes shared secret when required",
          detail:
            "Construct `x-api-key` as `keystring:shared_secret` when ETSY_SHARED_SECRET is present; do not commit secrets.",
        });
      }
      if (
        containsAny(txt, ["client_id", "ETSY_KEYSTRING"]) &&
        containsAny(txt, ["authorize", "callback"])
      ) {
        suggestions.push({
          file: f,
          issue: "Validate PKCE client_id usage",
          detail:
            "Ensure OAuth `client_id` uses the keystring-only (no shared secret) while backend requests use full `x-api-key`.",
        });
      }
    } catch (e) {
      // ignore unreadable
    }
  }

  const md = [
    `# Etsy PR Suggestions`,
    `Generated: ${new Date().toISOString()}`,
    "",
    `## Summary`,
    "",
    `Found ${suggestions.length} suggestions.`,
    "",
    `## Suggestions`,
    "",
  ];
  for (const s of suggestions) {
    md.push(`### ${path.relative(root, s.file)}`);
    md.push(`- **Issue:** ${s.issue}`);
    md.push(`- **Detail:** ${s.detail}`);
    md.push("");
  }
  if (suggestions.length === 0) md.push("No automated suggestions found.");

  await fs.mkdir(path.join(root, ".agents"), { recursive: true });
  await fs.writeFile(outPath, md.join("\n"), "utf8");
  console.log("Wrote suggestions to", outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
