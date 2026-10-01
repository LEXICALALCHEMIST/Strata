#!/usr/bin/env node

const version = "0.1.0";
const command = process.argv[2];

if (!command || command === "--help" || command === "-h") {
  console.log(`strata ${version}

Usage:
  strata            show this help
  strata version    print version
`);
  process.exit(0);
}

if (command === "version" || command === "--version" || command === "-v") {
  console.log(version);
  process.exit(0);
}

console.error(`Unknown command: ${command}`);
process.exit(1);