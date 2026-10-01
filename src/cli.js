#!/usr/bin/env node

import path from "path";
import { Command } from "commander";
import { input, select } from "@inquirer/prompts";
import { compile } from "./compile.js";
import { diff } from "./diff.js";

const program = new Command();

program
  .name("strata")
  .description("Architecture compiler for AI-generated software")
  .version("0.1.0");

program
  .command("init")
  .description("Compile a blueprint into a new folder")
  .action(async () => {
    const name = await select({
      message: "Blueprint",
      choices: [{ name: "React + Supabase", value: "react-supabase" }]
    });
    const appName = await input({
      message: "App name",
      default: "my-app"
    });
    const folder = await input({
      message: "Output folder",
      default: appName
    });
    const dest = await compile({
      name,
      appName,
      dest: path.resolve(process.cwd(), folder)
    });
    console.log(`Compiled ${name} into ${dest}`);
  });

program
  .command("diff")
  .description("Check the current folder against Strata contracts")
  .action(async () => {
    const report = await diff(process.cwd());
    for (const check of report.checks) {
      console.log(`${check.ok ? "ok" : "FAIL"}  ${check.id}  ${check.path}  ${check.message}`);
    }
    console.log(report.ok ? "No drift" : "Drift");
    process.exit(report.ok ? 0 : 1);
  });

program.parse();