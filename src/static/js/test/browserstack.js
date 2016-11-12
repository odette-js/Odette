application.scope().run(window, function (module, app, _, factories, $) {
    if (app.BROWSERSTACKING) {
        return;
    }
    var subset = function (results) {
        return {
            duration: results.duration,
            failed: results.failed,
            passed: results.passed,
            total: results.total,
            stacks: _.foldl(results.tests, function (memo, item) {
                if (!item.result) {
                    memo.push(item);
                }
            }, [])
        };
    };
    test.finished(function (results) {
        $('body').append($.createElement('div').addClass('test-output').html(JSON.stringify(subset(results))));
    });
    // _.console.log = function (singleton, results) {
    //     if (!window) {
    //         return;
    //     }
    //     if (!results) {
    //         return;
    //     }
    //     window.global_test_results = results;
    // };
    app.BROWSERSTACKING = true;
});