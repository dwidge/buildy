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
      out: "",
      dir: "",
      env: "",
      meta: "",
      platform: "",
      external: "",
      sourcemap: "false",
    },
    process.argv
  );
  console.log("config", config);

  const env = getEnv(config.env);
  if (config.env) console.log("env", env);
  const define = config.env ? { "process.env": JSON.stringify(env) } : {};

  if (config.out) await fs.rm(config.out, { recursive: true, force: true });
  if (config.dir) await fs.cp(config.dir, config.out, { recursive: true });
  const result = await esbuild.build({
    logLevel: "info",
    bundle: true,
    minify: true,
    sourcemap: config.sourcemap === "true",
    write: true,
    metafile: !!config.meta,
    outdir: config.out,
    entryPoints: [config.src],
    platform: config.platform,
    external: config.external.split(" "),
    define,
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
  if (config.meta) {
    await fs.mkdir(path.dirname(config.meta), { recursive: true });
    await fs.writeFile(config.meta, JSON.stringify(result.metafile, null, 2));
  }
}

build().catch((e) => {
  console.log(e);
  process.exit(1);
});
