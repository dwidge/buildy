#!/usr/bin/env node
const esbuild = require("esbuild");
const opener = require("opener");
const portfinder = require("portfinder");
const { proxyserve } = require("./proxy.js");
const { getEnv } = require("./env.js");
const { getArgs } = require("./args.js");

async function serve() {
  const config = getArgs(
    { src: "src/index.js", dir: "public", env: "NODE_", port: 3000 },
    process.argv
  );
  const env = getEnv(config.env);
  console.log("config", config);
  console.log("env", env);
  const c = await esbuild.context({
    logLevel: "info",
    bundle: true,
    sourcemap: true,
    entryPoints: [config.src],
    outdir: config.dir,
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
  await proxyserve(c, config.dir, port);
  opener("http://localhost:" + port);
  await c.watch();
}

serve().catch((e) => {
  console.log(e);
  process.exit(1);
});
