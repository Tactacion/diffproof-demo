// Tiny app with two pages. Listens on $PORT (default 3000). No dependencies.
const http = require('node:http');
const port = Number(process.env.PORT || 3000);

const page = (title, script) => `<!doctype html>
<html><head><meta charset="utf-8"><title>${title}</title>
<style>body{font:16px system-ui;margin:40px}button{font:inherit;padding:8px 16px}#status{color:#0a7}</style>
</head><body>
<nav><a href="/reports">Reports</a> · <a href="/invoices">Invoices</a></nav>
<h1>${title}</h1>
<button id="export">Export</button>
<p id="status" role="status"></p>
<script>${script}</script>
</body></html>`;

const REPORTS_SCRIPT = `document.getElementById('export').onclick = () => {
  console.log('export clicked');
  document.getElementById('status').textContent = 'Export ready: reports.csv';
};`;

// BUG: exportInvoices is never defined, so the button throws and nothing shows.
const INVOICES_SCRIPT = `document.getElementById('export').onclick = () => exportInvoices();`;

const routes = {
  '/reports': page('Reports', REPORTS_SCRIPT),
  '/invoices': page('Invoices', INVOICES_SCRIPT),
};

http
  .createServer((req, res) => {
    const p = new URL(req.url, 'http://localhost').pathname;
    const html = routes[p === '/' ? '/reports' : p];
    if (!html) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      return res.end('not found');
    }
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(html);
  })
  .listen(port, () => console.log(`demo app on http://127.0.0.1:${port}`));
