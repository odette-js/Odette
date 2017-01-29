};
fn.call(win, win);
};
app.undefine(function (app, win) {
    if (win.document) {
        app.shims(win);
    }
});