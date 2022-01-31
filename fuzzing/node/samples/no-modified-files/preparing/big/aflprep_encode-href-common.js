function encode(input, expected, desc) {
    subsetTest(test, function() {
        assert_equals(normalizeStr(result), normalizeStr(expected));
    }, desc);
}
var codepoints = [];
for (var range of ranges) {
    for (var i = range[0]; i < range[1]; i++) {
        result = encoder(String.fromCodePoint(i));
        var success = !!result;
        if (errors) {
          success = !success;
        }
        if (success) {
            var item = {};
            codepoints.push(item);
            item.cp = i;
            item.expected = expect(result, i);
            item.desc = range[2] ? range[2] + " " : "";
        }
    }
}
for (var x = 0; x < codepoints.length; x++) {
    encode(
        String.fromCodePoint(codepoints[x].cp),
        codepoints[x].expected,
        codepoints[x].desc +
            " U+" +
            codepoints[x].cp.toString(16).toUpperCase() +
            " " +
            String.fromCodePoint(codepoints[x].cp) +
            " " +
            codepoints[x].expected
    );
}