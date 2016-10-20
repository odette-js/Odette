test.done(function (infos) {
    var item, expectation, j, i = 0,
        successful = [],
        failures = [];
    for (; i < infos.length; i++) {
        item = infos[i];
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
    console.log(successful, failures);
});