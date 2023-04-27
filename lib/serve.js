#!/usr/bin/env node
const esbuild = require("esbuild");
const opener = require("opener");
const portfinder = require("portfinder");
const getEnv = require("./env.js").getEnv;
const getArgs = require("./args.js").getArgs;

async function serve() {
  const config = getArgs(
    { src: "src/index.js", out: "public", prefix: "NODE_", port: 3000 },
    process.argv
  );
  const env = getEnv(config.prefix);
  console.log("config", config);
  console.log("env", env);
  const c = await esbuild.context({
    logLevel: "info",
    bundle: true,
    sourcemap: true,
    entryPoints: [config.src],
    outdir: config.out,
    write: false,
    loader: { ".js": "jsx" },
    define: { "process.env": JSON.stringify(env) },
  });
  const port = await portfinder.getPortPromise({
    port: config.port,
    stopPort: config.port + 100,
  });
  await c.serve({ port, servedir: "public" });
  opener("http://localhost:" + port);
  await c.watch();
}

serve().catch((e) => {
  console.log(e);
  process.exit(1);
});
