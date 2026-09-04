import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { persistSiteDataToDisk } from '../scripts/persistSiteData';

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export function adminSavePlugin(): Plugin {
  return {
    name: 'admin-save-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];

        if (url === '/api/admin/health' && req.method === 'GET') {
          sendJson(res, 200, { ok: true, mode: 'dev' });
          return;
        }

        if (url === '/api/admin/save' && req.method === 'POST') {
          try {
            const body = (await readJsonBody(req)) as {
              siteData?: unknown;
              baseSiteData?: unknown;
            };

            if (!body.siteData) {
              sendJson(res, 400, { ok: false, error: 'Missing siteData in request body.' });
              return;
            }

            const projectRoot = server.config.root;
            const result = await persistSiteDataToDisk(
              projectRoot,
              body.siteData,
              body.baseSiteData ?? body.siteData
            );

            sendJson(res, result.ok ? 200 : 500, result);
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Save failed';
            sendJson(res, 500, { ok: false, error: message });
          }
          return;
        }

        next();
      });
    },
  };
}
