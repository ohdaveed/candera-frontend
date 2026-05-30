import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import process from "node:process";

const VERSION = "0.1.22";
const otherPlatform = process.platform === "win32"
  ? "@voidzero-dev/vite-plus-linux-x64-gnu"
  : "@voidzero-dev/vite-plus-win32-x64-msvc";

const dir = new URL(`../node_modules/${otherPlatform}`, import.meta.url);
if (!existsSync(dir)) {
  try {
    execSync(
      `npm install ${otherPlatform}@${VERSION} --no-save --ignore-scripts --force`,
      { stdio: "pipe", timeout: 120000 },
    );
  } catch {
    // non-critical; OS-native binding was already installed by npm's optionalDeps
  }
}
