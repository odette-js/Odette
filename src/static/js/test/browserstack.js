application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
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
    _.testFinished(function (results) {
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