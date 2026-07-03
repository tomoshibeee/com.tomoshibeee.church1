#!/usr/bin/env node
/**
 * Fix wrongly nested paths + complete kebab-case migration.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const WRONG_PREFIX = path.join(ROOT, "Users/shokokb/Project/com.tomoshibeee.church1");

function toKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function isKebab(name) {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(name);
}

function gitMv(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (fs.existsSync(to)) fs.rmSync(to, { force: true });
  execSync(`git mv "${from}" "${to}"`, { cwd: ROOT, stdio: "pipe" });
}

// 1) Restore files from accidental nested absolute path
if (fs.existsSync(WRONG_PREFIX)) {
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else {
        const rel = path.relative(WRONG_PREFIX, full);
        const dest = path.join(ROOT, rel);
        console.log(`restore: ${rel}`);
        gitMv(full, dest);
      }
    }
  }
  walk(WRONG_PREFIX);
  fs.rmSync(path.join(ROOT, "Users"), { recursive: true, force: true });
}

const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "public", "supabase", "scripts", "Users"]);
const NEXT_RESERVED = new Set(["page.tsx", "layout.tsx", "route.ts"]);

const renames = [];

function planFileRename(absFile) {
  const rel = path.relative(ROOT, absFile).replace(/\\/g, "/");
  if (rel.startsWith("app/") && NEXT_RESERVED.has(path.basename(absFile))) return;
  const ext = path.extname(absFile);
  const stem = path.basename(absFile, ext);
  if (isKebab(stem)) return;
  const dir = path.dirname(absFile);
  const newAbs = path.join(dir, `${toKebab(stem)}${ext}`);
  renames.push([absFile, newAbs]);
}

function planDirRename(absDir) {
  const base = path.basename(absDir);
  if (/^\[.+\]$/.test(base)) {
    const inner = base.slice(1, -1);
    if (!isKebab(inner)) {
      const parent = path.dirname(absDir);
      renames.push([absDir, path.join(parent, `[${toKebab(inner)}]`)]);
    }
    return;
  }
  if (isKebab(base)) return;
  const parent = path.dirname(absDir);
  renames.push([absDir, path.join(parent, toKebab(base))]);
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

// dirs first (deepest), then files
for (const dir of walkDirs(ROOT).sort((a, b) => b.length - a.length)) {
  planDirRename(dir);
}
for (const file of walkFiles(ROOT)) {
  planFileRename(file);
}

const pathMap = new Map();
for (const [from, to] of renames) {
  const fromRel = path.relative(ROOT, from).replace(/\\/g, "/");
  const toRel = path.relative(ROOT, to).replace(/\\/g, "/");
  if (fromRel !== toRel && fs.existsSync(from)) pathMap.set(fromRel, toRel);
}

console.log(`Applying ${pathMap.size} renames`);
for (const [from, to] of [...pathMap.entries()].sort((a, b) => b[0].length - a[0].length)) {
  const fromAbs = path.join(ROOT, from);
  const toAbs = path.join(ROOT, to);
  if (!fs.existsSync(fromAbs)) continue;
  console.log(`${from} -> ${to}`);
  gitMv(fromAbs, toAbs);
}

function applyImportMap(content) {
  let next = content;
  for (const [from, to] of [...pathMap.entries()].sort((a, b) => b[0].length - a[0].length)) {
    const fromNoExt = from.replace(/\.(tsx?|css|mjs|jsx)$/, "");
    const toNoExt = to.replace(/\.(tsx?|css|mjs|jsx)$/, "");
    next = next.replaceAll(`@/${from}`, `@/${to}`);
    next = next.replaceAll(`@/${fromNoExt}`, `@/${toNoExt}`);
  }

  // Known manual mappings from earlier partial run + leftovers
  const manual = [
    ["@/components/auth-page", "@/components/auth-page"],
    ["@/components/buttons/link-button", "@/components/buttons/link-button"],
    ["@/components/buttons/share-button", "@/components/buttons/share-button"],
    ["@/components/footers/dashboard-footer", "@/components/footers/dashboard-footer"],
    ["@/components/footers/portal-footer", "@/components/footers/portal-footer"],
    ["@/components/footers/site-footer", "@/components/footers/site-footer"],
    ["@/components/logos/logo", "@/components/logos/logo"],
    ["@/components/media/image-uploader", "@/components/media/image-uploader"],
    ["@/components/navigations/dashboard-navigation", "@/components/navigations/dashboard-navigation"],
    ["@/components/navigations/portal-navigation", "@/components/navigations/portal-navigation"],
    ["@/components/navigations/site-navigation", "@/components/navigations/site-navigation"],
    ["@/components/news/news-card", "@/components/news/news-card"],
    ["@/components/news/news-modal", "@/components/news/news-modal"],
    ["@/components/shared/footer", "@/components/shared/footer"],
    ["@/components/shared/header", "@/components/shared/header"],
    ["@/components/site-link/site-link", "@/components/site-link/site-link"],
    ["@/components/templates/template", "@/components/templates/template"],
    ["@/features/block/block-renderer", "@/features/block/block-renderer"],
    ["@/features/block/block-drawer", "@/features/block/block-drawer"],
    ["@/features/drawer/image-drawer/image-drawer", "@/features/drawer/image-drawer/image-drawer"],
    ["@/features/drawer/image-drawer/cloudinary-tab", "@/features/drawer/image-drawer/cloudinary-tab"],
    ["@/features/drawer/image-drawer/google-drive-tab", "@/features/drawer/image-drawer/google-drive-tab"],
    ["@/features/menu/drop-down-menu", "@/features/menu/drop-down-menu"],
    ["@/features/menu/hamburger-menu", "@/features/menu/hamburger-menu"],
    ["@/features/nav/mobile-navigation", "@/features/nav/mobile-navigation"],
    ["@/features/nav/primary-navigation", "@/features/nav/primary-navigation"],
    ["@/features/section/section-render", "@/features/section/section-render"],
    ["@/features/section/components/base-section", "@/features/section/components/base-section"],
    ["@/lib/cloudinary/upload-image", "@/lib/cloudinary/upload-image"],
    ["@/models/global-news", "@/models/global-news"],
    ["@/models/site-block", "@/models/site-block"],
    ["@/models/site-meta", "@/models/site-meta"],
    ["@/models/site-news", "@/models/site-news"],
    ["@/models/site-section", "@/models/site-section"],
    ["@/models/site-social-link", "@/models/site-social-link"],
    ["@/models/social-type", "@/models/social-type"],
    ["@/services/global-news-service", "@/services/global-news-service"],
    ["@/services/site-block-service", "@/services/site-block-service"],
    ["@/services/site-meta-service", "@/services/site-meta-service"],
    ["@/services/site-news-service", "@/services/site-news-service"],
    ["@/services/site-section-service", "@/services/site-section-service"],
    ["@/services/site-service", "@/services/site-service"],
    ["@/services/site-social-link-service", "@/services/site-social-link-service"],
    ["@/types/site-menu", "@/types/site-menu"],
    ["@/types/site-meta", "@/types/site-meta"],
    ["@/types/site-navigation", "@/types/site-navigation"],
    ["@/utils/date/format-date", "@/utils/date/format-date"],
    ["@/utils/date/get-random-date", "@/utils/date/get-random-date"],
    ["../../components/auth-page", "../../components/auth-page"],
    ["./auth-page.css", "./auth-page.css"],
    ["./site-meta", "./site-meta"],
    ["./site-navigation", "./site-navigation"],
    ["./site-menu", "./site-menu"],
    ["../models/site-meta", "../models/site-meta"],
    ["./map-embed", "./map-embed"],
    ["./drop-down-menu", "./drop-down-menu"],
    ["./ShareButton", "./share-button"],
    ["./cloudinary-tab", "./cloudinary-tab"],
    ["./google-drive-tab", "./google-drive-tab"],
    ["./hero-block-image", "./hero-block-image"],
    ["./hero-block-carousel", "./hero-block-carousel"],
    ["./hero-form", "./hero-form"],
    ["./block-renderer", "./block-renderer"],
  ];
  for (const [from, to] of manual) {
    next = next.replaceAll(from, to);
  }

  next = next.replaceAll('Promise<{ "site-id": string }>', 'Promise<{ "site-id": string }>');
  next = next.replaceAll("const { "site-id": siteId } = await params", 'const { "site-id": siteId } = await params');

  return next;
}

for (const file of walkFiles(ROOT).filter((f) => /\.(tsx?|css|mjs|json)$/.test(f))) {
  const original = fs.readFileSync(file, "utf8");
  const updated = applyImportMap(original);
  if (updated !== original) {
    fs.writeFileSync(file, updated, "utf8");
    console.log(`updated: ${path.relative(ROOT, file)}`);
  }
}

console.log("Done.");
