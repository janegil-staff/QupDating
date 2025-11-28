const { createServer } = require("http");
const next = require("next");
const { startSocketServer } = require("./socket-server");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  startSocketServer(server);

  const PORT = 4000;
  server.listen(PORT, () => {
    console.log("🚀 Ready on http://localhost:" + PORT);
  });
});
