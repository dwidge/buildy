#!/usr/bin/env node
const esbuild = require("esbuild");
const fs = require("fs").promises;
const opener = require("opener");
const portfinder = require("portfinder");
const { proxyserve } = require("./proxy.js");
const { getEnv } = require("./env.js");
const { getArgs } = require("./args.js");
const { replaceEnvInDir } = require("./replaceEnvInDir.js");

async function serve() {
  const config = getArgs(
    {
      src: "src/index.js",
      out: "build",
      dir: "public",
      env: "NODE_",
      port: 3000,
    },
    process.argv
  );
  const env = getEnv(config.env);
  console.log("config", config);
  console.log("env", env);

  if (config.dir && config.out) {
    await fs.rm(config.out, { recursive: true, force: true });
    await fs.cp(config.dir, config.out, { recursive: true });
    await replaceEnvInDir(config, env);
  }

  const c = await esbuild.context({
    logLevel: "info",
    bundle: true,
    sourcemap: true,
    entryPoints: [config.src],
    outdir: config.out,
    write: false,
    define: { "process.env": JSON.stringify(env) },
    loader: {
      ".js": "jsx",
      ".gif": "file",
      ".png": "file",
      ".woff": "file",
      ".woff2": "file",
      ".eot": "file",
      ".ttf": "file",
      ".svg": "file",
    },
  });
  const port = await portfinder.getPortPromise({
    port: config.port,
    stopPort: config.port + 100,
  });
  //await c.serve({ port, servedir: config.dir });
  await proxyserve(c, config.out, port);
  opener("http://localhost:" + port);
  await c.watch();
}

serve().catch((e) => {
  console.log(e);
  process.exit(1);
});
