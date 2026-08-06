#!/usr/bin/env node
// @vercel/ncc's ts-loader still relies on the classic TypeScript Compiler API
// (ts.sys, findConfigFile, ...), which TypeScript 7's native/Go port no longer
// ships (see https://github.com/vercel/ncc/issues/1336). Pointing ncc's
// typescript lookup at a directory outside this project makes it fail to
// resolve our local typescript@7 and fall back to the compatible TypeScript
// 5.9 it bundles internally, purely for bundling. The project itself still
// depends on real TypeScript 7 for editing/type-checking.
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const nccCli = fileURLToPath(
  new URL("../node_modules/@vercel/ncc/dist/ncc/cli.js", import.meta.url),
);

const result = spawnSync(
  process.execPath,
  [
    "--max-old-space-size=4096",
    nccCli,
    "build",
    "src/index.ts",
    "-o",
    "dist",
    "--source-map",
    "--license",
    "licenses.txt",
  ],
  {
    stdio: "inherit",
    env: { ...process.env, TYPESCRIPT_LOOKUP_PATH: tmpdir() },
  },
);

if (result.error) throw result.error;
process.exit(result.status ?? 1);
