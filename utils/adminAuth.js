const crypto = require('crypto');

module.exports = function requireAdminToken(req, res, next) {
  const expected = process.env.ADMIN_API_TOKEN;
  if (!expected || Buffer.byteLength(expected) < 32) {
    return res.status(503).json({ error: 'Song write access is not configured.' });
  }

  const provided = req.get('x-admin-token');
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(typeof provided === 'string' ? provided : '');
  if (providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  next();
};
