const http = require("http");
const next = require("next");
const { parse } = require("url");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = Number(process.env.PORT || 3000);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (error) {
      console.error("Error handling request", req.url, error);
      res.statusCode = 500;
      res.end("Internal server error");
    }
  });

  server.once("error", (error) => {
    console.error("Server startup error", error);
    process.exit(1);
  });

  server.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
