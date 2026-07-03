#!/usr/bin/env node
/**
 * One-off migration: rename files/dirs to kebab-case and update import paths.
 * Run from project root: node scripts/rename-to-kebab.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "public",
  "supabase",
  "scripts",
]);

const NEXT_RESERVED = new Set([
  "page.tsx",
  "layout.tsx",
  "route.ts",
  "loading.tsx",
  "error.tsx",
  "not-found.tsx",
  "global-error.tsx",
  "template.tsx",
  "default.tsx",
]);

function toKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function isKebab(name) {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(name);
}

function shouldRenameEntry(name, isDir) {
  if (name.startsWith(".") || name === "favicon.ico") return false;
  if (isDir && /^\[.+\]$/.test(name)) {
    const inner = name.slice(1, -1);
    return !isKebab(inner);
  }
  return !isKebab(name);
}

function walkDirs(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDirs(full, acc);
      acc.push(full);
    }
  }
  return acc;
}

function walkFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

const pathMap = new Map();

function addPathMap(oldRel, newRel) {
  if (oldRel !== newRel) pathMap.set(oldRel.replace(/\\/g, "/"), newRel.replace(/\\/g, "/"));
}

// 1) Plan directory renames (deepest first)
const dirs = walkDirs(ROOT).sort((a, b) => b.length - a.length);
for (const dir of dirs) {
  const base = path.basename(dir);
  if (!shouldRenameEntry(base, true)) continue;
  let newBase = toKebab(base);
  if (/^\[.+\]$/.test(base)) {
    newBase = `[${toKebab(base.slice(1, -1))}]`;
  }
  const parent = path.dirname(dir);
  const newPath = path.join(parent, newBase);
  addPathMap(path.relative(ROOT, dir), path.relative(ROOT, newPath));
}

// 2) Plan file renames
for (const file of walkFiles(ROOT)) {
  const rel = path.relative(ROOT, file);
  const dir = path.dirname(file);
  const base = path.basename(file);
  if (rel.startsWith("app/") && NEXT_RESERVED.has(base)) continue;
  const ext = path.extname(base);
  const stem = path.basename(base, ext);
  if (!shouldRenameEntry(stem, false)) continue;
  const newStem = toKebab(stem);
  const mappedDir = [...pathMap.entries()].reduce(
    (d, [from, to]) => (d === from ? to : d.startsWith(from + "/") ? to + d.slice(from.length) : d),
    dir.replace(/\\/g, "/"),
  );
  const newRel = path.join(mappedDir, `${newStem}${ext}`).replace(/\\/g, "/");
  addPathMap(rel.replace(/\\/g, "/"), newRel);
}

console.log(`Planned ${pathMap.size} renames`);

// 3) Apply renames (longest paths first)
const sortedRenames = [...pathMap.entries()].sort((a, b) => b[0].length - a[0].length);
for (const [from, to] of sortedRenames) {
  const fromAbs = path.join(ROOT, from);
  const toAbs = path.join(ROOT, to);
  if (!fs.existsSync(fromAbs)) {
    console.warn(`Skip missing: ${from}`);
    continue;
  }
  fs.mkdirSync(path.dirname(toAbs), { recursive: true });
  execSync(`git mv "${fromAbs}" "${toAbs}"`, { cwd: ROOT, stdio: "inherit" });
  console.log(`${from} -> ${to}`);
}

// 4) Update import paths in source files
function applyImportMap(content) {
  let next = content;
  const entries = [...pathMap.entries()].sort((a, b) => b[0].length - a[0].length);

  for (const [from, to] of entries) {
    const fromNoExt = from.replace(/\.(tsx?|css|mjs|jsx)$/, "");
    const toNoExt = to.replace(/\.(tsx?|css|mjs|jsx)$/, "");

    const patterns = [
      [from, to],
      [fromNoExt, toNoExt],
    ];

    for (const [f, t] of patterns) {
      const escaped = f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      next = next.replace(new RegExp(`(["'\`])@/${escaped}`, "g"), `$1@/${t}`);
      next = next.replace(
        new RegExp(`from (["'\`])\\.\\.?/[^"'\`]*${escaped.split("/").pop()}`, "g"),
        (m, q) => {
          // relative imports: rebuild from file location is hard; replace path segments globally
          return m;
        },
      );
      next = next.replaceAll(`@/${f}`, `@/${t}`);
      next = next.replaceAll(`@/${fromNoExt}`, `@/${toNoExt}`);
    }
  }

  // Fix co-located CSS imports after AuthPage rename
  next = next.replaceAll("./auth-page.css", "./auth-page.css");

  // Dynamic route param: [site-id]
  next = next.replaceAll('Promise<{ "site-id": string }>', 'Promise<{ "site-id": string }>');
  next = next.replaceAll("const { "site-id": siteId } = await params", 'const { "site-id": siteId } = await params');

  return next;
}

const sourceFiles = walkFiles(ROOT).filter((f) =>
  /\.(tsx?|css|mjs|json)$/.test(f),
);

for (const file of sourceFiles) {
  const abs = file;
  const original = fs.readFileSync(abs, "utf8");
  const updated = applyImportMap(original);
  if (updated !== original) {
    fs.writeFileSync(abs, updated, "utf8");
    console.log(`Updated imports: ${path.relative(ROOT, abs)}`);
  }
}

// 5) Fix relative imports by segment replacement
for (const file of sourceFiles) {
  let content = fs.readFileSync(file, "utf8");
  let changed = false;
  for (const [from, to] of [...pathMap.entries()].sort((a, b) => b[0].length - a[0].length)) {
    const segments = from.split("/");
    const last = segments[segments.length - 1].replace(/\.(tsx?|css)$/, "");
    const newLast = to.split("/").pop().replace(/\.(tsx?|css)$/, "");
    if (last === newLast) continue;

    const re = new RegExp(`(/${last.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})(?=["'])`, "g");
    const next = content.replace(re, `/${newLast}`);
    if (next !== content) {
      content = next;
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(file, content, "utf8");
    console.log(`Updated relative: ${path.relative(ROOT, file)}`);
  }
}

console.log("Done.");
