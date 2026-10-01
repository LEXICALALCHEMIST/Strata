# Strata
Agent CLI 

Architecture compiler for AI-generated software.

First Test -
React-Supabase

Strata does not generate the app. It compiles a blueprint into the system the agent builds inside: filesystem, contracts, and agent rules. Later, `strata diff` checks the repo against those contracts and writes a report the agent can fix from.

blueprint → compile → agent adapter → repo → agent → diff

## Status

v0.1 spike. The CLI prints a version. `init` and `diff` are not built yet.

## Requirements

Node 18+.

## Run

node src/cli.js
node src/cli.js version

## Layout

package.json
src/cli.js

## v0.1 scope

Keep: file location checks, package.json allow/deny, simple import checks, strata-report.json.

Cut: semantic review, runtime tests, editor extension.