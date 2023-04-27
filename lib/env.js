const filterBy = (obj, cond) =>
  Object.fromEntries(Object.entries(obj).filter(cond));

exports.getEnv = (prefix = "") =>
  filterBy(process.env, ([k, v]) => k.startsWith(prefix));
