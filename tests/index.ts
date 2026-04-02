import assert from 'node:assert/strict';
import test from 'node:test';

import { URI } from '@nuintun/uri';

test('should parse and stringify IPv6 URI', () => {
  const source = 'https://[2001:410:0:1:0:0:0:45ff]:80/hello';
  const uri = new URI(source);

  assert.equal(uri.protocol, 'https:');
  assert.equal(uri.hostname, '[2001:410:0:1:0:0:0:45ff]');
  assert.equal(uri.port, '80');
  assert.equal(uri.pathname, '/hello');
  assert.equal(uri.toURI(), source);
});

test('should parse and stringify IPv6 URI with auth', () => {
  const source = 'https://user:pass@[2001:410:0:1:0:0:0:45ff]:80/hello';
  const uri = new URI(source);

  assert.equal(uri.username, 'user');
  assert.equal(uri.password, 'pass');
  assert.equal(uri.hostname, '[2001:410:0:1:0:0:0:45ff]');
  assert.equal(uri.port, '80');
  assert.equal(uri.toURI(), source);
});

test('should keep IPv4 behavior', () => {
  const source = 'https://user:pass@127.0.0.1:8080/hello?x=1#ok';
  const uri = new URI(source);

  assert.equal(uri.hostname, '127.0.0.1');
  assert.equal(uri.username, 'user');
  assert.equal(uri.password, 'pass');
  assert.deepEqual(uri.query, { x: '1' });
  assert.deepEqual(uri.fragment, { ok: null });
  assert.equal(uri.toURI(), source);
});
