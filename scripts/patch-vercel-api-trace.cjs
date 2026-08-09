const fs = require("fs");
const path = require("path");
const { nodeFileTrace } = require("next/dist/compiled/@vercel/nft");

const root = path.resolve(__dirname, "..");
const serverDir = path.join(root, "apps", "ecommerce", "server");
const distDir = path.join(serverDir, "dist");
const apiTraceFile = path.join(
  root,
  ".next",
  "server",
  "pages",
  "api",
  "v1",
  "[...path].js.nft.json",
);

function walkFiles(dir, predicate = () => true, files = []) {
  if (!fs.existsSync(dir)) return files;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, predicate, files);
    } else if (entry.isFile() && predicate(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function toTraceRelative(fullPath, traceDir) {
  return path.relative(traceDir, fullPath).replace(/\\/g, "/");
}

function isServerEnvFile(fullPath) {
  const relativePath = path.relative(serverDir, fullPath).replace(/\\/g, "/");
  return relativePath === ".env" || relativePath.startsWith(".env.");
}

function addFileIfExists(traceFiles, traceDir, fullPath) {
  if (
    !isServerEnvFile(fullPath) &&
    fs.existsSync(fullPath) &&
    fs.statSync(fullPath).isFile()
  ) {
    traceFiles.add(toTraceRelative(fullPath, traceDir));
  }
}

function addDirectory(traceFiles, traceDir, dir) {
  for (const fullPath of walkFiles(dir)) {
    traceFiles.add(toTraceRelative(fullPath, traceDir));
  }
}

async function main() {
  if (!fs.existsSync(apiTraceFile)) {
    throw new Error(`API trace file not found: ${apiTraceFile}`);
  }

  if (!fs.existsSync(distDir)) {
    throw new Error(`Compiled backend not found: ${distDir}`);
  }

  const traceDir = path.dirname(apiTraceFile);
  const traceContent = JSON.parse(fs.readFileSync(apiTraceFile, "utf8"));
  const traceFiles = new Set(traceContent.files || []);
  const backendEntries = walkFiles(distDir, (filePath) =>
    filePath.endsWith(".js"),
  );

  const traced = await nodeFileTrace(backendEntries, {
    base: root,
    processCwd: serverDir,
    mixedModules: true,
    ignore(filePath) {
      const fullPath = path.isAbsolute(filePath)
        ? filePath
        : path.join(root, filePath);
      return isServerEnvFile(fullPath);
    },
  });

  for (const relativePath of traced.fileList) {
    const fullPath = path.join(root, relativePath);
    addFileIfExists(traceFiles, traceDir, fullPath);
  }

  addDirectory(traceFiles, traceDir, distDir);
  addDirectory(
    traceFiles,
    traceDir,
    path.join(serverDir, "node_modules", "module-alias"),
  );
  addFileIfExists(traceFiles, traceDir, path.join(serverDir, "package.json"));
  addFileIfExists(
    traceFiles,
    traceDir,
    path.join(serverDir, "prisma", "schema.prisma"),
  );

  for (const relativePath of Array.from(traceFiles)) {
    if (isServerEnvFile(path.resolve(traceDir, relativePath))) {
      traceFiles.delete(relativePath);
    }
  }

  const files = Array.from(traceFiles).sort();
  fs.writeFileSync(apiTraceFile, JSON.stringify({ ...traceContent, files }));

  const backendFileCount = files.filter((filePath) =>
    filePath.includes("apps/ecommerce/server"),
  ).length;

  console.log(
    `Patched Vercel API trace with ${backendFileCount} backend files from ${backendEntries.length} compiled entries.`,
  );

  if (traced.warnings?.size) {
    console.warn(
      `Node trace reported ${traced.warnings.size} unresolved backend aliases; dist files are included separately.`,
    );
  }

  const sanityChecks = [
    path.join(serverDir, "dist", "app.js"),
    path.join(serverDir, "node_modules", "module-alias", "index.js"),
  ].map((fullPath) => toTraceRelative(fullPath, traceDir));

  const missing = sanityChecks.filter(
    (relativePath) => !traceFiles.has(relativePath),
  );
  if (missing.length) {
    throw new Error(
      `Patched API trace is missing required files: ${missing.join(", ")}`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
