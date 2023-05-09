const filterBy = (obj, cond) =>
  Object.fromEntries(Object.entries(obj).filter(cond));

exports.getEnv = (prefix = "") =>
  filterBy(process.env, ([k, v]) =>
    prefix.split(" ").some((prefix) => k.startsWith(prefix))
  );
