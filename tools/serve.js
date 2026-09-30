const http = require("http"), fs = require("fs"), path = require("path");
const root = path.resolve(__dirname, "..");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  const f = path.join(root, p);
  if (!f.startsWith(root) || !fs.existsSync(f)) { res.writeHead(404); return res.end("not found"); }
  const size = fs.statSync(f).size, type = types[path.extname(f).toLowerCase()] || "application/octet-stream";
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || "");
  if (m) {
    const start = +m[1] || 0, end = m[2] ? +m[2] : size - 1;
    res.writeHead(206, { "Content-Type": type, "Content-Range": `bytes ${start}-${end}/${size}`, "Accept-Ranges": "bytes", "Content-Length": end - start + 1 });
    return fs.createReadStream(f, { start, end }).pipe(res);
  }
  res.writeHead(200, { "Content-Type": type, "Content-Length": size, "Accept-Ranges": "bytes" });
  fs.createReadStream(f).pipe(res);
}).listen(5173);

