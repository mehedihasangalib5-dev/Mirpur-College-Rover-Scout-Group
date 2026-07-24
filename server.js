#!/usr/bin/env node
/**
 * server.js — a tiny, dependency-free static file server that serves
 * both the public website and the admin panel from one process, so
 * the whole project can be deployed as a single app.
 *
 * Routes:
 *   /            -> public/index.html   (and public/css, public/js, ...)
 *   /admin/      -> admin/index.html    (and admin/css, admin/js, ...)
 *
 * Usage:
 *   node server.js
 *   PORT=8080 node server.js
 *
 * No npm install needed — only Node's built-in "http" and "fs" modules
 * are used, so this runs on any machine with Node.js installed and on
 * any host that can run "node server.js" (Render, Railway, Fly.io, a
 * plain VPS, etc.).
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function send(res, status, body, contentType) {
  res.writeHead(status, { "Content-Type": contentType || "text/plain; charset=utf-8" });
  res.end(body);
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 404, "404 Not Found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, data, MIME[ext] || "application/octet-stream");
  });
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);

  // Route to the admin panel folder
  if (urlPath === "/admin" || urlPath === "/admin/") {
    serveFile(res, path.join(ROOT, "admin", "index.html"));
    return;
  }
  if (urlPath.startsWith("/admin/")) {
    const rel = urlPath.replace(/^\/admin\//, "");
    const filePath = path.join(ROOT, "admin", rel);
    if (!filePath.startsWith(path.join(ROOT, "admin"))) { send(res, 403, "403 Forbidden"); return; }
    serveFile(res, filePath);
    return;
  }

  // Everything else -> the public website
  if (urlPath === "/") urlPath = "/index.html";
  const filePath = path.join(ROOT, "public", urlPath);
  if (!filePath.startsWith(path.join(ROOT, "public"))) { send(res, 403, "403 Forbidden"); return; }
  serveFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Scout Website running:`);
  console.log(`  Public site:  http://localhost:${PORT}/`);
  console.log(`  Admin panel:  http://localhost:${PORT}/admin/`);
});
