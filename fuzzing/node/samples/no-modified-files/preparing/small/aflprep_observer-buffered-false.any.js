async_test(t => {
  performance.mark('foo');
  t.step_timeout(() => {
    new PerformanceObserver(() => {
      assert_unreached('Should not have observed any entry!');
    }).observe({type: 'mark', buffered: false});
    t.step_timeout(t.step_func_done(() => {}), 100);
  }, 0);
}, 'PerformanceObserver without buffered flag set to false cannot see past entries.');
