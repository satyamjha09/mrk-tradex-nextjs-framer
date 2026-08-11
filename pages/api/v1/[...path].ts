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

function getProxyUrl(req: NextApiRequest, targetBaseUrl: string) {
  const pathParam = req.query.path;
  const segments = Array.isArray(pathParam)
    ? pathParam
    : pathParam
      ? [pathParam]
      : [];
  const base = targetBaseUrl.endsWith("/") ? targetBaseUrl : `${targetBaseUrl}/`;
  const url = new URL(segments.map(encodeURIComponent).join("/"), base);

  Object.entries(req.query).forEach(([key, value]) => {
    if (key === "path") return;
    if (Array.isArray(value)) {
      value.forEach((entry) => url.searchParams.append(key, entry));
      return;
    }
    if (typeof value === "string") {
      url.searchParams.set(key, value);
    }
  });

  return url;
}

async function readRawBody(req: NextApiRequest) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function proxyToApi(
  req: NextApiRequest,
  res: NextApiResponse,
  targetBaseUrl: string,
) {
  const upstreamUrl = getProxyUrl(req, targetBaseUrl);
  const headers = new Headers();

  Object.entries(req.headers).forEach(([key, value]) => {
    if (
      ["host", "connection", "content-length", "accept-encoding"].includes(
        key.toLowerCase(),
      )
    ) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((entry) => headers.append(key, entry));
      return;
    }
    if (value) headers.set(key, value);
  });

  const method = req.method || "GET";
  const body =
    method === "GET" || method === "HEAD" ? undefined : await readRawBody(req);

  const upstreamResponse = await fetch(upstreamUrl, {
    method,
    headers,
    body,
    redirect: "manual",
  });

  res.status(upstreamResponse.status);
  upstreamResponse.headers.forEach((value, key) => {
    if (
      ["content-encoding", "content-length", "transfer-encoding"].includes(
        key.toLowerCase(),
      )
    ) {
      return;
    }
    res.setHeader(key, value);
  });

  const responseBody = Buffer.from(await upstreamResponse.arrayBuffer());
  res.send(responseBody);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const proxyTarget = process.env.LOCAL_API_PROXY_TARGET;
    if (proxyTarget) {
      return proxyToApi(req, res, proxyTarget);
    }

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
