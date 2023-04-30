#!/usr/bin/env node
const esbuild = require("esbuild");
const fs = require("fs").promises;
const getEnv = require("./env.js").getEnv;
const getArgs = require("./args.js").getArgs;

async function build() {
  const config = getArgs(
    { src: "src/index.js", dir: "public", env: "NODE_", out: "build" },
    process.argv
  );
  const env = getEnv(config.env);
  console.log("config", config);
  console.log("env", env);

  await fs.rm(config.out, { recursive: true, force: true });
  await fs.cp(config.dir, config.out, { recursive: true });
  await esbuild.build({
    logLevel: "info",
    bundle: true,
    minify: true,
    sourcemap: false,
    write: true,
    outdir: config.out,
    entryPoints: [config.src],
    loader: { ".js": "jsx" },
    define: { "process.env": JSON.stringify(env) },
  });
}

build().catch((e) => {
  console.log(e);
  process.exit(1);
});
