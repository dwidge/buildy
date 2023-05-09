// https://gist.github.com/martinrue/2896becdb8a5ed81761e11ff2ea5898e
// modified by dwidge 2023

const http = require("http");
const path = require("path");

function dirup(p) {
  const { root, dir, base } = path.parse(p);
  const up = (path.dirname(dir) + "/").replace("//", "/");
  return root === dir ? root : up + base;
}

exports.proxyserve = async (context, servedir, port) => {
  const internal = await context.serve({ servedir });

  const proxy = http.createServer((req, res) => {
    const forwardRequest = (path) => {
      console.log(req.method, path);
      const options = {
        hostname: internal.host,
        port: internal.port,
        path,
        method: req.method,
        headers: req.headers,
      };

      const proxyReq = http.request(options, (proxyRes) => {
        if (proxyRes.statusCode === 404) return forwardRequest(dirup(path));

        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      });

      req.pipe(proxyReq, { end: true });
    };

    forwardRequest(req.url);
  });

  return proxy.listen(port);
};
