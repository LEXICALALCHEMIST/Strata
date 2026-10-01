#!/usr/bin/env node

import { Command } from "commander";

const program = new Command();

program
  .name("strata")
  .description("Architecture compiler for AI-generated software")
  .version("0.1.0");

program
  .command("init")
  .description("Compile a blueprint into the current folder")
  .action(() => {
    console.log("init is not wired yet");
  });

program.parse();