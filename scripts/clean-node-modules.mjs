/**
 * Finds all node_modules directories in the repo, lists them,
 * then asks for confirmation before deleting.
 *
 * Run: pnpm run clean:node_modules  (or: node scripts/clean-node-modules.mjs)
 */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Recursively collects all node_modules directories.
 * Once a node_modules dir is found its own subtree is not descended into.
 */
function findNodeModules(dir, results = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.name === "node_modules") {
      results.push(fullPath);
    } else if (entry.name !== ".git") {
      findNodeModules(fullPath, results);
    }
  }

  return results;
}

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log("Searching for node_modules...\n");

  const dirs = findNodeModules(ROOT);

  if (dirs.length === 0) {
    console.log("No node_modules directories found.");
    return;
  }

  for (const dir of dirs) {
    console.log(" ", path.relative(ROOT, dir).replace(/\\/g, "/"));
  }

  console.log(`\nFound ${dirs.length} node_modules director${dirs.length === 1 ? "y" : "ies"}.`);

  const answer = await prompt("Delete all? [Y/n] ");

  if (answer === "" || answer.toLowerCase() === "y") {
    let deleted = 0;
    for (const dir of dirs) {
      const rel = path.relative(ROOT, dir).replace(/\\/g, "/");
      try {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`Deleted: ${rel}`);
        deleted++;
      } catch (err) {
        console.error(`Failed to delete ${rel}: ${err.message}`);
      }
    }
    console.log(`\nDone. Deleted ${deleted} director${deleted === 1 ? "y" : "ies"}.`);
  } else {
    console.log("Aborted.");
  }
}

main();
