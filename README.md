# @dwidge/buildy

Simple esbuild with filtered env.

Use env-cmd or dotenv/config for .env files, cross-env for package scripts.

# Usage

```bash
pnpm i -D @dwidge/buildy env-cmd http-server
```

```json
"scripts": {
    "dev": "servey src=src/index.tsx env=\"REACT_APP_ REACT_APP_DEV_\" dir=public port=3000",
    "build": "buildy src=src/index.tsx env=REACT_APP_ dir=public out=build meta=tmp/meta.json",
    "start": "pnpx http-server build -o -p3000"
}
```

dev server

```bash
pnpm dev
```

dev server with .env.dev file

```bash
pnpm env-cmd -f .env.dev pnpm dev
```

build with .env file and serve static

```bash
pnpm env-cmd pnpm build
pnpm start
```

src/index.tsx

```js
console.log("process.env", process.env);
```

cli

```
> REACT_APP_API=http://localhost:4444 OTHER_ENV=12345 pnpm dev

process.env { REACT_APP_API: "http://localhost:4444" }
```

# License

Copyright DWJ 2024.  
Distributed under the Boost Software License, Version 1.0.  
https://www.boost.org/LICENSE_1_0.txt
