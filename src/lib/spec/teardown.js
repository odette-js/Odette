test.done(function (infos) {
    var item, expectation, j, i = 0,
        successful = [],
        failures = [],
        time = 0,
        sync = {
            delta: 0,
            total: 0
        },
        async = {
            delta: 0,
            total: 0
        };
    for (; i < infos.length; i++) {
        item = infos[i];
        time += item.delta;
        for (j = 0; j < item.expectations.length; j++) {
            expectation = item.expectations[j];
            if (expectation.success) {
                successful.push(expectation);
            } else {
                failures.push(expectation);
            }
        }
        if (item.async) {
            async.delta += item.delta;
            async.total++;
        } else {
            sync.delta += item.delta;
            sync.total++;
        }
        if (!item.expecting) {
            console.error('missing expectation count: ', item);
        }
    }
    console.log(time);
    console.log(successful);
    console.log(failures);
    console.log('sync time for ' + sync.total + ': ' + sync.delta);
    console.log('async time for ' + async.total + ': ' + async.delta);
});