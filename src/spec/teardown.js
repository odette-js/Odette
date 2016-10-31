test.done(function (infos) {
    var item, expectation, j, i = 0,
        successful = [],
        failures = [],
        time = 0;
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
        if (!item.expecting) {
            console.error('missing expectation count: ', item);
        }
    }
    console.log(time, successful, failures);
});