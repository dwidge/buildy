exports.getArgs = (props, args) => {
  const keys = Object.keys(props);
  const re = new RegExp(`^(${keys.join("|")})=(.+)$`);
  return args.reduce(
    function (acc, cur) {
      const matches = cur.match(re);
      if (matches) {
        acc[matches[1]] = matches[2];
      }
      return acc;
    },
    { ...props }
  );
};
