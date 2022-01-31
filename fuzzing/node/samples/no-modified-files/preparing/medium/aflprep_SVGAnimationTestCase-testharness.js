function expectFillColor(element, red, green, blue, message) {
    let color = window.getComputedStyle(element, null).fill;
    var re = new RegExp("rgba?\\(([^, ]*), ([^, ]*), ([^, ]*)(?:, )?([^, ]*)\\)");
    rgb = re.exec(color);
    assert_approx_equals(Number(rgb[1]), red, 2.0, message);
    assert_approx_equals(Number(rgb[2]), green, 2.0, message);
    assert_approx_equals(Number(rgb[3]), blue, 2.0, message);
}
function expectColor(element, red, green, blue, property) {
    if (typeof property != "string")
      color = getComputedStyle(element).getPropertyValue("color");
    else
      color = getComputedStyle(element).getPropertyValue(property);
    var re = new RegExp("rgba?\\(([^, ]*), ([^, ]*), ([^, ]*)(?:, )?([^, ]*)\\)");
    rgb = re.exec(color);
    assert_approx_equals(Number(rgb[1]), red, 2.0);
    assert_approx_equals(Number(rgb[2]), green, 2.0);
    assert_approx_equals(Number(rgb[3]), blue, 2.0);
}
function createSVGElement(type) {
}
function moveAnimationTimelineAndSample(index) {
    var animationId = expectedResults[index][0];
    var time = expectedResults[index][1];
    var sampleCallback = expectedResults[index][2];
    var animation = rootSVGElement.ownerDocument.getElementById(animationId);
    newTime = time;
    rootSVGElement.setCurrentTime(newTime);
    if (time != 0.0)
        sampleCallback();
}
var currentTest = 0;
var expectedResults;
function sampleAnimation(t) {
    if (currentTest == expectedResults.length) {
        t.done();
        return;
    }
    moveAnimationTimelineAndSample(currentTest);
    ++currentTest;
    step_timeout(t.step_func(function () { sampleAnimation(t); }), 0);
}
function runAnimationTest(t, expected) {
    if (!expected)
        throw("Expected results are missing!");
    if (currentTest > 0)
        throw("Not allowed to call runAnimationTest() twice");
    expectedResults = expected;
    testCount = expectedResults.length;
    currentTest = 0;
    step_timeout(t.step_func(function () { sampleAnimation(this); }), 50);
}
function smil_async_test(func) {
  async_test(t => {
    window.onload = t.step_func(function () {
      rootSVGElement.pauseAnimations();
      func(t);
    });
  });
}