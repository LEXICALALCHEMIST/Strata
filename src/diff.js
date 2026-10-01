import fs from "fs-extra";
import path from "path";

export async function diff(cwd) {
  const root = path.resolve(cwd);
  const contractsDir = path.join(root, ".strata", "contracts");
  if (!(await fs.pathExists(contractsDir))) {
    throw new Error("No .strata/contracts here. Run strata init first.");
  }
  const files = (await fs.readdir(contractsDir)).filter((name) => name.endsWith(".json"));
  const checks = [];
  for (const file of files) {
    const contract = await fs.readJson(path.join(contractsDir, file));
    if (contract.type === "file") {
      const target = path.join(root, contract.path);
      const ok = await fs.pathExists(target);
      checks.push({
        id: contract.id,
        ok,
        path: contract.path,
        message: ok ? "exists" : "missing"
      });
    }
  }
  const report = {
    ok: checks.every((check) => check.ok),
    checks
  };
  await fs.writeJson(path.join(root, "strata-report.json"), report, { spaces: 2 });
  return report;
}