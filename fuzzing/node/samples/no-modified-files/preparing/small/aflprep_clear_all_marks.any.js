test(function() {
    self.performance.mark("mark1");
    self.performance.mark("mark2");
    var entries = self.performance.getEntriesByType("mark");
    assert_equals(entries.length, 2, "Two marks have been created for this test.");
    self.performance.clearMarks();
    entries = self.performance.getEntriesByType("mark");
    assert_equals(entries.length, 0, "All marks have been cleared.");
}, "Clearing all marks remove all of them.");
