'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
};
const server = https.Server(options, common.mustCall((req, res) => {
  res.writeHead(200);
  res.end('Hello, World!');
}));
server.listen(0, common.mustCall(() => {
  const agent = new https.Agent();
  const name = agent.getName({ port: server.address().port });
  https.globalAgent = agent;
  makeRequest();
}));
function makeRequest() {
  const req = https.get({
    port: server.address().port
  });
  req.on('close', () =>
    server.close());
}
