#!/usr/bin/env node
const esbuild = require("esbuild");
const fs = require("fs").promises;
const getEnv = require("./env.js").getEnv;
const getArgs = require("./args.js").getArgs;

async function build() {
  const config = getArgs(
    { src: "src/index.js", out: "build", prefix: "NODE_" },
    process.argv
  );
  const env = getEnv(config.prefix);
  console.log("config", config);
  console.log("env", env);

  await fs.rm("build", { recursive: true });
  await fs.cp("public", "build", { recursive: true });
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
