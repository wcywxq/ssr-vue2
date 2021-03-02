const fs = require("fs");
const path = require("path");
const Koa = require("koa");
const Router = require("koa-router");
const static = require("koa-static");
const { createBundleRenderer } = require("vue-server-renderer");

const app = new Koa();
const router = new Router();

app.use(static(path.resolve(__dirname, "./dist")));

const bundle = require("./dist/vue-ssr-server-bundle.json");
const clientMainfast = require("./dist/vue-ssr-client-manifest.json");
const renderer = createBundleRenderer(bundle, {
  runInNewContext: false,
  template: fs.readFileSync(path.resolve(__dirname, "./index.temp.html"), "utf-8"),
  clientMainfast
});

function renderToString(ctx) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(ctx, (err, html) => {
      err ? reject(err) : resolve(html);
    });
  });
}

app.use(async ctx => {
  const context = {
    title: "ssr test",
    url: ctx.url
  };
  const html = await renderToString(context);
  ctx.body = html;
});

const port = 7777;

app.listen(port, () => {
  console.log(`the server is running in: http://localhost:7777`);
});
