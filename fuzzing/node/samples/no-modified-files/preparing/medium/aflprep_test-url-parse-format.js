'use strict';
if (!common.hasIntl)
  common.skip('missing Intl');
const assert = require('assert');
const inspect = require('util').inspect;
const url = require('url');
const parseTests = {
  },
  'http:\\\\evil-phisher\\foo.html#h\\a\\s\\h': {
    protocol: 'http:',
    slashes: true,
    host: 'evil-phisher',
    hostname: 'evil-phisher',
    hash: '#h%5Ca%5Cs%5Ch',
  },
  'http:\\\\evil-phisher\\foo.html?json="\\"foo\\""#h\\a\\s\\h': {
    protocol: 'http:',
    slashes: true,
    host: 'evil-phisher',
    hostname: 'evil-phisher',
    search: '?json=%22%5C%22foo%5C%22%22',
    query: 'json=%22%5C%22foo%5C%22%22',
    hash: '#h%5Ca%5Cs%5Ch',
  },
  'http:\\\\evil-phisher\\foo.html#h\\a\\s\\h?blarg': {
    protocol: 'http:',
    slashes: true,
    host: 'evil-phisher',
    hostname: 'evil-phisher',
    hash: '#h%5Ca%5Cs%5Ch?blarg',
  },
  'http:\\\\evil-phisher\\foo.html': {
    protocol: 'http:',
    slashes: true,
    host: 'evil-phisher',
    hostname: 'evil-phisher',
  },
    protocol: 'http:',
    slashes: true,
    host: 'www.example.com',
    hostname: 'www.example.com',
  },
    protocol: 'http:',
    slashes: true,
    host: 'www.example.com',
    hostname: 'www.example.com',
  },
    protocol: 'http:',
    slashes: true,
    host: 'www.example.com',
    hostname: 'www.example.com',
  },
    protocol: 'http:',
    slashes: true,
    auth: 'user:pw',
    host: 'www.example.com',
    hostname: 'www.example.com',
  },
    protocol: 'http:',
    slashes: true,
    auth: 'USER:PW',
    host: 'www.example.com',
    hostname: 'www.example.com',
  },
    protocol: 'http:',
    slashes: true,
    auth: 'user',
    host: 'www.example.com',
    hostname: 'www.example.com',
  },
    protocol: 'http:',
    slashes: true,
    auth: 'user:pw',
    host: 'www.example.com',
    hostname: 'www.example.com',
  },
    protocol: 'http:',
    slashes: true,
    host: 'x.com',
    hostname: 'x.com',
    search: '?that%27s',
    query: 'that%27s',
    hash: '#all,%20folks',
  },
    protocol: 'http:',
    slashes: true,
    host: 'x.com',
    hostname: 'x.com',
  },
    protocol: 'http:',
    slashes: true,
    host: 'www.example.com',
    hostname: 'www.example.com',
  },
    protocol: 'http:',
    slashes: true,
    host: 'x.y.com+a',
    hostname: 'x.y.com+a',
  },
    protocol: 'http:',
    slashes: true,
    host: 'x.y.com',
    hostname: 'x.y.com',
    search: '?d=e',
    query: 'd=e',
    hash: '#f%20g%3Ch%3Ei',
  },
    protocol: 'http:',
    slashes: true,
    host: 'x.y.com',
    hostname: 'x.y.com',
    search: '?d=e',
    query: 'd=e',
    hash: '#f%20g%3Ch%3Ei',
  },
    protocol: 'http:',
    slashes: true,
    host: 'x...y...',
    hostname: 'x...y...',
    hash: '#p',
  },
    protocol: 'http:',
    slashes: true,
    host: 'x',
    hostname: 'x',
  },
  },
    protocol: 'http:',
    slashes: true,
    host: 'www.narwhaljs.org',
    hostname: 'www.narwhaljs.org',
    search: '?id=news',
    query: 'id=news',
  },
    protocol: 'http:',
    slashes: true,
    host: 'mt0.google.com',
    hostname: 'mt0.google.com',
  },
          '&x=2&y=2&z=3&s=',
    protocol: 'http:',
    slashes: true,
    host: 'mt0.google.com',
    hostname: 'mt0.google.com',
    search: '???&hl=en&src=api&x=2&y=2&z=3&s=',
    query: '??&hl=en&src=api&x=2&y=2&z=3&s=',
  },
    protocol: 'http:',
    slashes: true,
    host: 'mt0.google.com',
    auth: 'user:pass',
    hostname: 'mt0.google.com',
    search: '???&hl=en&src=api&x=2&y=2&z=3&s=',
    query: '??&hl=en&src=api&x=2&y=2&z=3&s=',
  },
    slashes: true,
    protocol: 'file:',
    hostname: '',
    host: '',
  },
    protocol: 'file:',
    slashes: true,
    hostname: 'localhost',
    host: 'localhost',
  },
    protocol: 'file:',
    slashes: true,
    hostname: 'foo',
    host: 'foo',
  },
    slashes: true,
    protocol: 'file:',
    hostname: '',
    host: '',
  },
    protocol: 'file:',
    slashes: true,
    hostname: 'localhost',
    host: 'localhost',
  },
    protocol: 'file:',
    slashes: true,
    hostname: 'foo',
    host: 'foo',
  },
    protocol: 'http:',
  },
    protocol: 'http:',
    slashes: true,
    host: 'example.com:8000',
    auth: 'user:pass',
    port: '8000',
    hostname: 'example.com',
    hash: '#frag',
    search: '?baz=quux',
    query: 'baz=quux',
  },
    slashes: true,
    host: 'example.com:8000',
    auth: 'user:pass',
    port: '8000',
    hostname: 'example.com',
    hash: '#frag',
    search: '?baz=quux',
    query: 'baz=quux',
  },
    hash: '#frag',
    search: '?baz=quux',
    query: 'baz=quux',
  },
    protocol: 'http:',
    hash: '#frag',
    search: '?baz=quux',
    query: 'baz=quux',
  },
  'mailto:foo@bar.com?subject=hello': {
    href: 'mailto:foo@bar.com?subject=hello',
    protocol: 'mailto:',
    host: 'bar.com',
    auth: 'foo',
    hostname: 'bar.com',
    search: '?subject=hello',
    query: 'subject=hello',
    path: '?subject=hello'
  },
  'javascript:alert(\'hello\');': {
    href: 'javascript:alert(\'hello\');',
    protocol: 'javascript:',
    pathname: 'alert(\'hello\');',
    path: 'alert(\'hello\');'
  },
  'xmpp:isaacschlueter@jabber.org': {
    href: 'xmpp:isaacschlueter@jabber.org',
    protocol: 'xmpp:',
    host: 'jabber.org',
    auth: 'isaacschlueter',
    hostname: 'jabber.org'
  },
    protocol: 'http:',
    slashes: true,
    host: '127.0.0.1:8080',
    auth: 'atpass:foo@bar',
    hostname: '127.0.0.1',
    port: '8080',
    search: '?search=foo',
    query: 'search=foo',
    hash: '#bar',
  },
    host: 'foo',
    hostname: 'foo',
    protocol: 'svn+ssh:',
    slashes: true
  },
    host: 'foo',
    hostname: 'foo',
    protocol: 'dash-test:',
    slashes: true
  },
    host: 'foo',
    hostname: 'foo',
    protocol: 'dash-test:',
  },
    host: 'foo',
    hostname: 'foo',
    protocol: 'dot.test:',
    slashes: true
  },
    host: 'foo',
    hostname: 'foo',
    protocol: 'dot.test:',
  },
    protocol: 'http:',
    slashes: true,
    host: 'www.xn--wgv71a119e.com',
    hostname: 'www.xn--wgv71a119e.com',
  },
    protocol: 'http:',
    slashes: true,
    host: 'example.xn--bcher-kva.com',
    hostname: 'example.xn--bcher-kva.com',
  },
    protocol: 'http:',
    slashes: true,
    host: 'www.xn--ffchen-9ta.com',
    hostname: 'www.xn--ffchen-9ta.com',
  },
    protocol: 'http:',
    slashes: true,
    host: 'www.xn--ffchen-9ta.com',
    hostname: 'www.xn--ffchen-9ta.com',
    search: '?d=e',
    query: 'd=e',
    hash: '#f%20g%3Ch%3Ei',
  },
    protocol: 'http:',
    slashes: true,
    host: 'xn--slier-bsa.com',
    hostname: 'xn--slier-bsa.com',
  },
    protocol: 'http:',
    slashes: true,
    host: 'xn--egbpdaj6bu4bxfgehfvwxn.xn--egb9f',
    hostname: 'xn--egbpdaj6bu4bxfgehfvwxn.xn--egb9f',
  },
    protocol: 'http:',
    slashes: true,
    host: 'xn--hgi.ws',
    hostname: 'xn--hgi.ws',
  },
    protocol: 'http:',
    slashes: true,
    host: 'bucket_name.s3.amazonaws.com',
    hostname: 'bucket_name.s3.amazonaws.com',
  },
    protocol: 'git+http:',
    slashes: true,
    host: 'github.com',
    hostname: 'github.com',
  },
  'local1@domain1': {
    pathname: 'local1@domain1',
    path: 'local1@domain1',
    href: 'local1@domain1'
  },
  'www.example.com': {
    href: 'www.example.com',
    pathname: 'www.example.com',
    path: 'www.example.com'
  },
  '[fe80::1]': {
    href: '[fe80::1]',
    pathname: '[fe80::1]',
    path: '[fe80::1]'
  },
    protocol: 'coap:',
    slashes: true,
    host: '[fedc:ba98:7654:3210:fedc:ba98:7654:3210]',
    hostname: 'fedc:ba98:7654:3210:fedc:ba98:7654:3210',
  },
    protocol: 'coap:',
    slashes: true,
    host: '[1080:0:0:0:8:800:200c:417a]:61616',
    port: '61616',
    hostname: '1080:0:0:0:8:800:200c:417a',
  },
    protocol: 'http:',
    slashes: true,
    auth: 'user:password',
    host: '[3ffe:2a00:100:7031::1]:8080',
    port: '8080',
    hostname: '3ffe:2a00:100:7031::1',
  },
    protocol: 'coap:',
    slashes: true,
    auth: 'u:p',
    host: '[::192.9.5.5]:61616',
    port: '61616',
    hostname: '::192.9.5.5',
    search: '?n=Temperature',
    query: 'n=Temperature',
  },
    protocol: 'http:',
    slashes: true,
    host: 'example.com',
    hostname: 'example.com',
  },
    protocol: 'http:',
    slashes: true,
    host: 'example.com',
    hostname: 'example.com',
  },
    protocol: 'http:',
    slashes: true,
    host: 'example.com',
    hostname: 'example.com',
    search: '?a=b',
    query: 'a=b',
  },
    protocol: 'http:',
    slashes: true,
    host: 'example.com',
    hostname: 'example.com',
    hash: '#abc',
  },
    protocol: 'http:',
    slashes: true,
    host: '[fe80::1]',
    hostname: 'fe80::1',
    search: '?a=b',
    query: 'a=b',
    hash: '#abc',
  },
    protocol: 'http:',
    slashes: true,
    host: '-lovemonsterz.tumblr.com',
    hostname: '-lovemonsterz.tumblr.com',
  },
    protocol: 'http:',
    slashes: true,
    port: '80',
    host: '-lovemonsterz.tumblr.com:80',
    hostname: '-lovemonsterz.tumblr.com',
  },
    protocol: 'http:',
    slashes: true,
    auth: 'user:pass',
    host: '-lovemonsterz.tumblr.com',
    hostname: '-lovemonsterz.tumblr.com',
  },
    protocol: 'http:',
    slashes: true,
    auth: 'user:pass',
    port: '80',
    host: '-lovemonsterz.tumblr.com:80',
    hostname: '-lovemonsterz.tumblr.com',
  },
    protocol: 'http:',
    slashes: true,
    host: '_jabber._tcp.google.com',
    hostname: '_jabber._tcp.google.com',
  },
    protocol: 'http:',
    slashes: true,
    auth: 'user:pass',
    host: '_jabber._tcp.google.com',
    hostname: '_jabber._tcp.google.com',
  },
    protocol: 'http:',
    slashes: true,
    port: '80',
    host: '_jabber._tcp.google.com:80',
    hostname: '_jabber._tcp.google.com',
  },
    protocol: 'http:',
    slashes: true,
    auth: 'user:pass',
    port: '80',
    host: '_jabber._tcp.google.com:80',
    hostname: '_jabber._tcp.google.com',
  },
    protocol: 'http:',
    slashes: true,
    host: 'x:1',
    port: '1',
    hostname: 'x',
  },
    protocol: 'http:',
    slashes: true,
    auth: 'a@b',
    host: 'c',
    hostname: 'c',
  },
    protocol: 'http:',
    slashes: true,
    auth: 'a',
    host: 'b',
    hostname: 'b',
    search: '?@c',
    query: '@c'
  },
    protocol: 'http:',
    slashes: true,
    host: 'a.b',
    port: null,
    hostname: 'a.b',
    hash: null,
    search: '?mn%5Cop%5Eq=r%6099%7Bst%7Cuv%7Dwz',
    query: 'mn%5Cop%5Eq=r%6099%7Bst%7Cuv%7Dwz',
  },
    protocol: 'http:',
    slashes: true,
    auth: 'a\r" \t\n<\'b:b',
    host: 'c',
    port: null,
    hostname: 'c',
    hash: null,
    search: '?f',
    query: 'f',
  },
    protocol: 'git+ssh:',
    slashes: true,
    auth: 'git',
    host: 'github.com',
    port: null,
    hostname: 'github.com',
    hash: null,
    search: null,
    query: null,
  },
    protocol: 'https:',
    slashes: true,
    auth: null,
    host: '',
    port: null,
    hostname: '',
    hash: null,
    search: null,
    query: null,
  },
  'javascript:alert(1);a=\x27@white-listed.com\x27': {
    protocol: 'javascript:',
    slashes: null,
    auth: null,
    host: null,
    port: null,
    hostname: null,
    hash: null,
    search: null,
    query: null,
    pathname: "alert(1);a='@white-listed.com'",
    path: "alert(1);a='@white-listed.com'",
    href: "javascript:alert(1);a='@white-listed.com'"
  },
  'javAscript:alert(1);a=\x27@white-listed.com\x27': {
    protocol: 'javascript:',
    slashes: null,
    auth: null,
    host: null,
    port: null,
    hostname: null,
    hash: null,
    search: null,
    query: null,
    pathname: "alert(1);a='@white-listed.com'",
    path: "alert(1);a='@white-listed.com'",
    href: "javascript:alert(1);a='@white-listed.com'"
  },
    protocol: 'ws:',
    slashes: true,
    hostname: 'www.example.com',
    host: 'www.example.com',
  },
    protocol: 'wss:',
    slashes: true,
    hostname: 'www.example.com',
    host: 'www.example.com',
  }
};
for (const u in parseTests) {
  let actual = url.parse(u);
  const spaced = url.parse(`     \t  ${u}\n\t`);
  let expected = Object.assign(new url.Url(), parseTests[u]);
  Object.keys(actual).forEach(function(i) {
    if (expected[i] === undefined && actual[i] === null) {
      expected[i] = null;
    }
  });
  assert.deepStrictEqual(
    actual,
    expected,
    `expected ${inspect(expected)}, got ${inspect(actual)}`
  );
  assert.deepStrictEqual(
    spaced,
    expected,
    `expected ${inspect(expected)}, got ${inspect(spaced)}`
  );
  expected = parseTests[u].href;
  actual = url.format(parseTests[u]);
  assert.strictEqual(actual, expected,
                     `format(${u}) == ${u}\nactual:${actual}`);
}
{
    .resolveObject('jAvascript:alert(1);a=\x27@white-listed.com\x27');
  const expected = Object.assign(new url.Url(), {
    protocol: 'javascript:',
    slashes: null,
    auth: null,
    host: null,
    port: null,
    hostname: null,
    hash: null,
    search: null,
    query: null,
    pathname: "alert(1);a='@white-listed.com'",
    path: "alert(1);a='@white-listed.com'",
    href: "javascript:alert(1);a='@white-listed.com'"
  });
  assert.deepStrictEqual(parsed, expected);
}