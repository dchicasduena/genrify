const assert = require('assert');
const requireAdminToken = require('../utils/adminAuth');

function runAdminMiddleware(configuredToken, providedToken) {
  if (configuredToken === undefined) {
    delete process.env.ADMIN_API_TOKEN;
  } else {
    process.env.ADMIN_API_TOKEN = configuredToken;
  }

  let statusCode;
  let responseBody;
  let continued = false;
  const response = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      responseBody = body;
      return this;
    }
  };

  requireAdminToken(
    { get: () => providedToken },
    response,
    () => { continued = true; }
  );
  return { statusCode, responseBody, continued };
}

describe('Admin write authorization', () => {
  it('fails closed when no strong admin token is configured', () => {
    const result = runAdminMiddleware(undefined, undefined);
    assert.strictEqual(result.statusCode, 503);
    assert.strictEqual(result.continued, false);
  });

  it('rejects a missing or incorrect token', () => {
    const configuredToken = 'test-admin-token-0123456789abcdef';
    const result = runAdminMiddleware(configuredToken, 'incorrect-token');
    assert.strictEqual(result.statusCode, 401);
    assert.strictEqual(result.continued, false);
  });

  it('allows a matching token', () => {
    const configuredToken = 'test-admin-token-0123456789abcdef';
    const result = runAdminMiddleware(configuredToken, configuredToken);
    assert.strictEqual(result.statusCode, undefined);
    assert.strictEqual(result.continued, true);
  });
});
