const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const Module = require('node:module');
const express = require('express');

function createServer() {
  const originalLoad = Module._load;
  const mockSupabase = {
    from() {
      return {
        select() { return this; },
        eq() { return this; },
        ilike() { return this; },
        order() { return this; },
        single() { return this; },
        insert() { return this; },
        update() { return this; },
        delete() { return this; },
        then(resolve) {
          return Promise.resolve({ data: [{ id: 'prod-1', name: 'Anillo' }], error: null }).then(resolve);
        },
        catch(reject) {
          return Promise.resolve({ data: [{ id: 'prod-1', name: 'Anillo' }], error: null }).catch(reject);
        },
      };
    },
  };

  Module._load = function(request, parent, isMain) {
    if (request === '../config/supabase') {
      return mockSupabase;
    }
    if (request === '../middleware/auth') {
      return { requireAdmin: (req, res, next) => next() };
    }
    return originalLoad.apply(this, arguments);
  };

  const router = require('./products');
  const app = express();
  app.use('/api/products', router);

  const server = app.listen(0);
  return new Promise((resolve) => {
    server.once('listening', () => resolve({ server, close: () => server.close(), router }));
  }).finally(() => {
    Module._load = originalLoad;
  });
}

test('GET /api/products/admin/all returns products for admins', async () => {
  const { server, close } = await createServer();
  const port = server.address().port;

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/products/admin/all`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body));
    assert.equal(body[0].name, 'Anillo');
  } finally {
    close();
  }
});
