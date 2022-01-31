'use strict';
const assert = require('assert');
const zlib = require('zlib');
const inputString = 'ΩΩLorem ipsum dolor sit amet, consectetur adipiscing eli' +
                    't. Morbi faucibus, purus at gravida dictum, libero arcu ' +
                    'convallis lacus, in commodo libero metus eu nisi. Nullam' +
                    ' commodo, neque nec porta placerat, nisi est fermentum a' +
                    'ugue, vitae gravida tellus sapien sit amet tellus. Aenea' +
                    'n non diam orci. Proin quis elit turpis. Suspendisse non' +
                    ' diam ipsum. Suspendisse nec ullamcorper odio. Vestibulu' +
                    'm arcu mi, sodales non suscipit id, ultrices ut massa. S' +
                    'ed ac sem sit amet arcu malesuada fermentum. Nunc sed. ';
const expectedBase64Deflate = 'eJxdUUtOQzEMvMoc4OndgT0gJCT2buJWlpI4jePeqZfpmX' +
                              'lKWLJWkncJG5403HQXAkT3Jw29B9uIEmToMukglZ0vS6oc' +
                              'iBh4JG8sV4oVLEUCitK2kxq1WzPnChHDzsaGKy491LofoA' +
                              'bWh8do43oeuYhB5EPCjcLjzYJo48KrfQBvnJecNFJvHT1+' +
                              'fKBtNMhe3OZh6N95CTvMX5HJJi4xOVzCgUOIMSLH7wmeOH' +
const expectedBase64Gzip = 'H4sIAAAAAAAAA11RS05DMQy8yhzg6d2BPSAkJPZu4laWkjiN4' +
                           '96pl+mZcAotEpss7PH8crverq86uEK6eUXWogMmE1R5bkjajN' +
                           'Pk6QOUpYslaSdwkbnjTcdBcCRPcnDb0H24gSZOgy6SCVnS9Lq' +
                           'hyIGHgkbyxXihUsRQKK0raTGrVbM+cKEcPOxoYrLj3Uuh+gBt' +
                           'aHx2jjeh65iEHkQ8KNwuPNgmjjwqt9AG+cl5w0Um8dPX5FJCw' +
                           'mHo33kJO8xfkckmLjE5XMKBQ4gxIsfvCZ44doUThF2mcZq8q2' +
                           'sHnHNzRtagj5AQAA';
zlib.deflate(inputString, common.mustCall((err, buffer) => {
  assert.strictEqual(buffer.toString('base64'), expectedBase64Deflate);
}));
zlib.gzip(inputString, common.mustCall((err, buffer) => {
  zlib.gunzip(buffer, common.mustCall((err, gunzipped) => {
    assert.strictEqual(gunzipped.toString(), inputString);
  }));
}));
let buffer = Buffer.from(expectedBase64Deflate, 'base64');
zlib.unzip(buffer, common.mustCall((err, buffer) => {
  assert.strictEqual(buffer.toString(), inputString);
}));
buffer = Buffer.from(expectedBase64Gzip, 'base64');
zlib.unzip(buffer, common.mustCall((err, buffer) => {
  assert.strictEqual(buffer.toString(), inputString);
}));