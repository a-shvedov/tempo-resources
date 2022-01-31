'use strict';
if (!common.hasIntl) {
  common.skip('missing Intl');
}
const request = {
  response: require(fixtures.path(
    'wpt', 'url', 'resources', 'setters_tests.json'
  ))
};
function startURLSettersTests() {
         runURLSettersTests(request.response)
}
function runURLSettersTests(all_test_cases) {
  for (var attribute_to_be_set in all_test_cases) {
    if (attribute_to_be_set == "comment") {
      continue;
    }
    var test_cases = all_test_cases[attribute_to_be_set];
    for(var i = 0, l = test_cases.length; i < l; i++) {
      var test_case = test_cases[i];
      var name = `Setting <${test_case.href}>.${attribute_to_be_set}` +
                 ` = '${test_case.new_value}'`;
      if ("comment" in test_case) {
        name += ` ${test_case.comment}`;
      }
      test(function() {
        var url = new URL(test_case.href);
        url[attribute_to_be_set] = test_case.new_value;
        for (var attribute in test_case.expected) {
          assert_equals(url[attribute], test_case.expected[attribute])
        }
      }, `URL: ${name}`);
    }
  }
}
startURLSettersTests()