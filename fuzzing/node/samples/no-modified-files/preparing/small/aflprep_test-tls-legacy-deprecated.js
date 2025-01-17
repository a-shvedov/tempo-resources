'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const tls = require('tls');
common.expectWarning(
  'DeprecationWarning',
  'tls.createSecurePair() is deprecated. Please use tls.TLSSocket instead.',
  'DEP0064'
);
tls.createSecurePair();
