#!/usr/bin/env node
const esbuild = require("esbuild");
const fs = require("fs").promises;
const path = require("path");
const getEnv = require("./env.js").getEnv;
const getArgs = require("./args.js").getArgs;

async function build() {
  const config = getArgs(
    {
      src: "src/index.js",
      dir: "public",
      env: "NODE_",
      out: "build",
      meta: "",
    },
    process.argv
  );
  const env = getEnv(config.env);
  console.log("config", config);
  console.log("env", env);

  await fs.rm(config.out, { recursive: true, force: true });
  await fs.cp(config.dir, config.out, { recursive: true });
  const result = await esbuild.build({
    logLevel: "info",
    bundle: true,
    minify: true,
    sourcemap: false,
    write: true,
    metafile: !!config.meta,
    outdir: config.out,
    entryPoints: [config.src],
    loader: { ".js": "jsx" },
    define: { "process.env": JSON.stringify(env) },
  });
  if (config.meta) {
    await fs.mkdir(path.dirname(config.meta), { recursive: true });
    await fs.writeFile(config.meta, JSON.stringify(result.metafile, null, 2));
  }
}

build().catch((e) => {
  console.log(e);
  process.exit(1);
});
