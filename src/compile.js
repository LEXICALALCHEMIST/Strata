import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function blueprintDir(name) {
  return path.join(root, "blueprints", name);
}

export async function loadManifest(name) {
  const dir = blueprintDir(name);
  const manifest = await fs.readJson(path.join(dir, "manifest.json"));
  return { dir, manifest };
}

function fill(text, variables) {
  return text.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, key) => variables[key] ?? "");
}

async function copyFilled(src, dest, variables) {
  const stat = await fs.stat(src);
  if (stat.isDirectory()) {
    await fs.ensureDir(dest);
    for (const entry of await fs.readdir(src)) {
      await copyFilled(path.join(src, entry), path.join(dest, entry), variables);
    }
    return;
  }
  const raw = await fs.readFile(src, "utf8");
  await fs.outputFile(dest, fill(raw, variables));
}

export async function compile({ name, appName, dest }) {
  const { dir, manifest } = await loadManifest(name);
  const target = path.resolve(dest);
  if (await fs.pathExists(target)) {
    const entries = await fs.readdir(target);
    if (entries.length > 0) {
      throw new Error(`Refusing to compile into non-empty folder: ${target}`);
    }
  }
  await fs.ensureDir(target);
  const variables = { APP_NAME: appName };
  await copyFilled(path.join(dir, "scaffold"), target, variables);
  await fs.copy(path.join(dir, "contracts"), path.join(target, ".strata", "contracts"));
  await fs.copy(path.join(dir, "rules"), path.join(target, ".strata", "rules"));
  await fs.outputFile(
    path.join(target, "AGENTS.md"),
    await fs.readFile(path.join(dir, "rules", "system.md"), "utf8")
  );
  await fs.writeJson(
    path.join(target, ".strata", "lock.json"),
    {
      blueprint: manifest.name,
      version: manifest.version,
      appName,
      compiledAt: new Date().toISOString()
    },
    { spaces: 2 }
  );
  return target;
}