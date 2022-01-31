'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const https = require('https');
const credentialOptions = [
  {
    key: fixtures.readKey('agent1-key.pem'),
    cert: fixtures.readKey('agent1-cert.pem'),
    ca: fixtures.readKey('ca1-cert.pem')
  },
  {
    key: fixtures.readKey('agent2-key.pem'),
    cert: fixtures.readKey('agent2-cert.pem'),
    ca: fixtures.readKey('ca2-cert.pem')
  },
];
let firstResponse;
const server = https.createServer(credentialOptions[0], (req, res) => {
  const id = +req.headers.id;
  if (id === 1) {
    firstResponse = res;
    firstResponse.write('multi-');
    return;
  } else if (id === 4) {
    firstResponse.write('success-');
  }
  res.end('success');
});
server.listen(0, common.mustCall(() => {
  const { port } = server.address();
  const firstRequest = makeRequest(port, 1);
  async function makeRemainingRequests() {
    if (!firstResponse) {
      return setImmediate(makeRemainingRequests);
    }
    assert.strictEqual(await makeRequest(port, 2), 'success');
    server.setSecureContext(credentialOptions[1]);
    firstResponse.write('request-');
    const errorMessageRegex = common.hasOpenSSL3 ?
    await assert.rejects(async () => {
      await makeRequest(port, 3);
    }, errorMessageRegex);
    server.setSecureContext(credentialOptions[0]);
    assert.strictEqual(await makeRequest(port, 4), 'success');
    server.setSecureContext(credentialOptions[1]);
    firstResponse.end('fun!');
    await assert.rejects(async () => {
      await makeRequest(port, 5);
    }, errorMessageRegex);
    assert.strictEqual(await firstRequest, 'multi-request-success-fun!');
    server.close();
  }
  makeRemainingRequests();
}));
function makeRequest(port, id) {
  return new Promise((resolve, reject) => {
    const options = {
      rejectUnauthorized: true,
      ca: credentialOptions[0].ca,
      servername: 'agent1',
      headers: { id }
    };
    let errored = false;
      let response = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        response += chunk;
      });
      res.on('end', common.mustCall(() => {
        resolve(response);
      }));
    }).on('error', (err) => {
      errored = true;
      reject(err);
    }).on('finish', () => {
      assert.strictEqual(errored, false);
    });
  });
}