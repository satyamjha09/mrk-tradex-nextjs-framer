const { existsSync } = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const serverDir = path.join(root, "apps", "ecommerce", "server");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const requiredServerModules = [
  "dotenv",
  "express",
  "module-alias",
  "prisma",
  "typescript",
];

function hasServerModule(moduleName) {
  try {
    require.resolve(moduleName, { paths: [serverDir] });
    return true;
  } catch {
    return false;
  }
}

function runInServer(args, options = {}) {
  const result = spawnSync(npmCommand, args, {
    cwd: serverDir,
    stdio: options.capture ? "pipe" : "inherit",
    encoding: options.capture ? "utf8" : undefined,
    shell: process.platform === "win32",
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    if (options.allowWindowsPrismaLock) {
      const output = `${result.stdout || ""}\n${result.stderr || ""}`;
      const prismaClientExists = existsSync(
        path.join(serverDir, "node_modules", ".prisma", "client"),
      );

      if (
        process.platform === "win32" &&
        prismaClientExists &&
        output.includes("EPERM") &&
        output.includes("query_engine-windows.dll.node")
      ) {
        console.warn(
          "Prisma generate hit a local Windows file lock; using the existing generated client.",
        );
        return;
      }
    }

    if (options.capture) {
      process.stdout.write(result.stdout || "");
      process.stderr.write(result.stderr || "");
    }
    process.exit(result.status || 1);
  }

  if (options.capture) {
    process.stdout.write(result.stdout || "");
    process.stderr.write(result.stderr || "");
  }
}

if (
  !existsSync(path.join(serverDir, "node_modules")) ||
  requiredServerModules.some((moduleName) => !hasServerModule(moduleName))
) {
  runInServer(["install", "--include=dev"]);
}

runInServer(["run", "prisma", "--", "generate"], {
  allowWindowsPrismaLock: true,
  capture: true,
});
runInServer(["run", "build"]);
