const fs = require("fs").promises;

const fileTypes = [".html", ".json"];
async function replaceEnvInDir(config, env) {
  for (const file of (await fs.readdir(config.out)).filter((file) =>
    fileTypes.some((type) => file.endsWith(type))
  )) {
    let content = await fs.readFile(config.out + "/" + file, {
      encoding: "utf8",
    });
    for (const key in env) {
      content = content.split(key).join(env[key]);
    }
    await fs.writeFile(config.out + "/" + file, content, {
      encoding: "utf8",
    });
  }
}
exports.replaceEnvInDir = replaceEnvInDir;
