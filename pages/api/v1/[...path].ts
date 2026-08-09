import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

type ExpressApp = (req: NextApiRequest, res: NextApiResponse) => void;

let appPromise: Promise<ExpressApp> | undefined;
const nodeRequire: NodeRequire = eval("require");

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
    responseLimit: false,
  },
};

function loadModuleAlias(serverRoot: string) {
  const moduleAliasPath = path.join(
    serverRoot,
    "node_modules",
    "module-alias",
  );
  const { addAlias } = nodeRequire(moduleAliasPath);
  addAlias("@", path.join(serverRoot, "dist"));
}

function loadLocalServerEnv(serverRoot: string) {
  if (process.env.VERCEL === "1") return;
  const dotenvPath = path.join(serverRoot, "node_modules", "dotenv");
  const dotenv = nodeRequire(dotenvPath);
  dotenv.config({ path: path.join(serverRoot, ".env") });
}

async function getExpressApp() {
  if (!appPromise) {
    appPromise = (async () => {
      const serverRoot = path.join(process.cwd(), "apps", "ecommerce", "server");
      loadLocalServerEnv(serverRoot);
      loadModuleAlias(serverRoot);

      const appPath = path.join(serverRoot, "dist", "app.js");
      const { createApp } = nodeRequire(appPath);
      const { app } = await createApp();
      return app;
    })();
  }

  return appPromise;
}

function stripNextCatchAllQuery(req: NextApiRequest) {
  if (req.query && Object.prototype.hasOwnProperty.call(req.query, "path")) {
    delete (req.query as Record<string, unknown>).path;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const app = await getExpressApp();
    stripNextCatchAllQuery(req);
    return app(req, res);
  } catch (error) {
    console.error("Vercel API adapter failed:", error);
    if (!res.headersSent) {
      res.status(500).json({
        status: "error",
        message: "API failed to start. Check Vercel server logs.",
      });
    }
  }
}
