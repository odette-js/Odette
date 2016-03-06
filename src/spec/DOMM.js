application.scope().run(function (app, _, factories) {
    var elementData = _.associator;
    describe('DOMM', function () {
        var divs, count, $empty = $(),
            $win = $(window),
            $doc = $(document),
            $body = $(document.body),
            handler = function () {
                // return true;
                count++;
            },
            handler2 = function () {
                return false;
            },
            create = function () {
                count = 0;
                var _divs = divs && divs.remove();
                divs = $().count(function (item, index) {
                    var div = $.createElement('div');
                    var className = 'one';
                    if (index % 2) {
                        className += ' two';
                    } else {
                        className += ' not';
                    }
                    div.addClass(className);
                    this.push(div);
                }, 0, 5);
                $con.append(divs);
                return divs;
            },
            $con = $.createElements('div').style({
                height: '100%',
                width: '100%'
            });
        $(document.body).append($con);
        beforeEach(create);
        it('is essentially a collection', function () {
            expect(_.isInstance($empty, factories.DOMM)).toEqual(true);
            expect(_.isInstance($empty, factories.Collection)).toEqual(true);
        });
        it('it knows it\'s own client rect', function () {
            var div = divs.eq(0);
            expect(div.rect()).toEqual(_.extend({}, div.element().getBoundingClientRect()));
        });
        it('can show and hide elements', function () {
            expect(divs.hide().map(function (manager) {
                var el = manager.element();
                if (el.style.display === 'none') {
                    return '';
                } else {
                    return el.style.display;
                }
            }).join('')).toEqual('');
            expect(divs.show().map(function (manager) {
                var el = manager.element();
                if (el.style.display === 'block') {
                    return '';
                } else {
                    return el.style.display;
                }
            }).join('')).toEqual('');
        });
        it('can attach dom elements', function () {
            var div = divs.eq();
            div.append(divs.element(1));
            expect(div.children().element()).toEqual(divs.element(1));
        });
        it('can remove dom elements', function () {
            var div = divs.eq();
            div.append(divs.element(1));
            expect(div.children().element()).toEqual(divs.element(1));
            div.children().remove();
            expect(div.children().length()).toEqual(0);
        });
        describe('except it has some methods that are highly pertinant to DOM manipulation... ergo: DOMM', function () {
            it('can check if its items are windows', function () {
                expect($win.isWindow()).toEqual(true);
                expect($doc.isWindow()).toEqual(false);
                expect($body.isWindow()).toEqual(false);
            });
            it('can check if its items are documents', function () {
                expect($win.isDocument()).toEqual(false);
                expect($doc.isDocument()).toEqual(true);
                expect($body.isDocument()).toEqual(false);
            });
            it('can check if its items are actually elements', function () {
                expect($win.allElements()).toEqual(false);
                expect($doc.allElements()).toEqual(false);
                expect($body.allElements()).toEqual(true);
                expect($('a').allElements()).toEqual(true);
            });
            it('can check if its items are document fragments', function () {
                var frag = document.createDocumentFragment();
                frag.appendChild(document.createElement('div'));
                expect($win.isFragment()).toEqual(false);
                expect($doc.isFragment()).toEqual(false);
                expect($body.isFragment()).toEqual(false);
                expect($('a').isFragment()).toEqual(false);
                expect($(frag).isFragment()).toEqual(true);
            });
        });
        describe('it can filter itself', function () {
            it('by query string matching', function () {
                var newDivs = divs.filter('.two');
                expect(newDivs.length()).toEqual(2);
            });
            it('by filtering against a function', function () {
                var newDivs = divs.filter(function (item, idx) {
                    return ((idx % 3) - 1) === 0;
                });
                expect(newDivs.length()).toEqual(2);
                expect(newDivs.get()).toEqual(divs.get(1));
                expect(newDivs.get(1)).toEqual(divs.get(4));
            });
            it('by passing in an object', function () {
                var newDivs = divs.filter({
                    className: 'one not'
                });
                expect(newDivs.length()).toEqual(3);
            });
            it('can also get the first', function () {
                expect(divs.first().element()).toEqual(divs.element(0));
            });
            it('and the last element in the list', function () {
                expect(divs.last().element()).toEqual(divs.element(divs.length() - 1));
            });
        });
        describe('it can find it\'s children', function () {
            it('by calling the children method', function () {
                divs.duff(function (manager, idx) {
                    var div = manager.element();
                    var span1 = document.createElement('span');
                    var span2 = document.createElement('span');
                    span1.className = 'span-' + idx;
                    span2.className = 'span-' + (idx * 2);
                    div.appendChild(span1);
                    div.appendChild(span2);
                });
                var kids = divs.children();
                expect(kids.length()).toEqual(10);
                kids.duff(function (kid, idx) {
                    expect(kid.element().localName).toEqual('span');
                });
                kids = divs.children(1);
                expect(kids.length()).toEqual(5);
                kids = divs.children('.span-2');
                expect(kids.unwrap()).toEqual(divs.children().filter('.span-2').unwrap());
                expect(kids.length()).toEqual(2);
                expect(kids.element() === kids.element(1)).toEqual(false);
            });
            it('by querying the dom elements', function () {
                divs.duff(function (div, idx) {
                    div.element().innerHTML = '<span></span><img/>';
                });
                var kids = divs.$('img');
                expect(kids.length()).toEqual(5);
                kids.duff(function (kid, idx) {
                    expect(kid.element().tagName).toEqual('IMG');
                });
            });
        });
        describe('it can also find it\'s parents', function () {
            it('either by counting up', function () {
                var $start = $('.results .failures'),
                    $end = $('.jasmine_html-reporter'),
                    end = $start.parent(2);
                expect(end.element()).toEqual($end.element());
            });
            it('or by finding via selector', function () {
                var $start = $('.results .failures'),
                    $end = $('.jasmine_html-reporter'),
                    end = $start.parent('.jasmine_html-reporter');
                expect(end.element()).toEqual($end.element());
            });
            it('or by passing a function', function () {
                var $start = $('.results .failures'),
                    end = $start.parent(function (el) {
                        return el.tagName === 'BODY';
                    });
                expect(end.element()).toEqual(document.body);
            });
            describe('or by passing a keyword', function () {
                it('like document', function () {
                    var $start = $('.results .failures'),
                        end = $start.parent('document');
                    expect(end.element()).toEqual(document);
                });
                it('or window', function () {
                    var $start = $('.results .failures'),
                        end = $start.parent('window');
                    expect(end.element()).toEqual(window);
                });
            });
        });
        describe('all of this traversing can be undone', function () {
            it('with the end method', function () {
                var $start = $('.results .failures');
                var $next = $start.parent();
                $next = $next.children();
                $next = $next.end();
                expect($next === $start).toEqual(true);
            });
        });
        describe('the domm is also special because it abstracts event listeners for you', function () {
            describe('can add handlers', function () {
                it('one at a time', function () {
                    divs.on('click', handler);
                    expect(count).toEqual(0);
                    divs.click();
                    expect(count).toEqual(5);
                });
                it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler);
                    expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    divs.dispatchEvent('mouseover');
                    divs.dispatchEvent('mouseout');
                    expect(count).toEqual(15);
                });
            });
        });
        describe('the domm is also special because it abstracts event listeners for you', function () {
            describe('can add handlers', function () {
                it('one at a time', function () {
                    divs.on('click', handler);
                    expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    expect(count).toEqual(5);
                });
                it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler);
                    expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    divs.dispatchEvent('mouseover');
                    divs.dispatchEvent('mouseout');
                    expect(count).toEqual(15);
                });
            });
            describe('also capture handlers', function () {
                it('one at a time', function () {
                    divs.on('_click', handler);
                    expect(count).toEqual(0);
                    divs.dispatchEvent('click', {}, true);
                    expect(count).toEqual(5);
                });
                it('many at a time', function () {
                    divs.on('_click _mouseover _mouseout', handler);
                    expect(count).toEqual(0);
                    divs.dispatchEvent('click', {}, true);
                    divs.dispatchEvent('mouseover', {}, true);
                    divs.dispatchEvent('mouseout', {}, true);
                    expect(count).toEqual(15);
                });
            });
            it('will only add a method to the queue once. if a duplicate is passed in, it will be ignored (just like the browser implementation)', function () {
                divs.on('click', handler).on('click', handler);
                expect(count).toEqual(0);
                divs.dispatchEvent('click');
                expect(count).toEqual(5);
                divs.dispatchEvent('click');
                expect(count).toEqual(10);
            });
            it('once wrappers can also be used with the once method and they can be added the same way as once', function () {
                divs.once('click', handler);
                expect(count).toEqual(0);
                divs.dispatchEvent('click');
                expect(count).toEqual(5);
                divs.dispatchEvent('click');
                expect(count).toEqual(5);
            });
            it('be careful with the once function because they can be added multiple times to the queue, since they use a proxy function, like the one available at _.once', function () {
                divs.once('click', handler);
                expect(count).toEqual(0);
                divs.dispatchEvent('click');
                expect(count).toEqual(5);
                divs.dispatchEvent('click');
                expect(count).toEqual(5);
            });
        });
        describe('the each function is special because', function () {
            it('it wraps each element in a DOMM object before passing it through your iterator', function () {
                divs.each(function (el, idx) {
                    expect(_.isInstance(el, factories.DOMM)).toEqual(false);
                    expect(factories.DomManager.isInstance(el)).toEqual(true);
                    expect(divs.element(idx) === el.element());
                });
            });
            it('where the duff and forEach function just gives you the element at each index, just like a collection', function () {
                divs.duff(function (el, idx) {
                    expect(_.isInstance(el, $)).toEqual(false);
                });
                divs.forEach(function (el, idx) {
                    expect(_.isInstance(el, $)).toEqual(false);
                });
            });
        });
        describe('adding and removing classes is done by string checking instead of the classList to invoke only one reflow', function () {
            it('you can use addClass', function () {
                divs.each(function (div, idx) {
                    expect(div.hasClass('three')).toEqual(false);
                });
                divs.addClass('three');
                divs.each(function (div, idx) {
                    expect(div.hasClass('three')).toEqual(true);
                });
            });
            it('you can use removeClass', function () {
                divs.each(function (div, idx) {
                    expect(div.hasClass('three')).toEqual(false);
                });
                expect(divs.hasClass('three')).toEqual(false);
                divs.addClass('three');
                expect(divs.hasClass('three')).toEqual(true);
            });
            it('you can use hasClass to check if all of the elements has a particular class', function () {
                expect(divs.hasClass('two')).toEqual(false);
                expect(divs.hasClass('one')).toEqual(true);
            });
            it('you can use toggleClass swap classes depending on whether or not they exist on each element', function () {
                divs.each(function (div, idx) {
                    expect(div.hasClass('one')).toEqual(true);
                });
                divs.toggleClass('one');
                divs.each(function (div, idx) {
                    expect(div.hasClass('one')).toEqual(false);
                });
            });
            it('it will also do this for individual elements', function () {
                var list = [],
                    unique = [];
                divs.each(function (div, idx) {
                    var res = div.hasClass('two');
                    list.push(res);
                    _.add(unique, res);
                });
                divs.toggleClass('two');
                divs.each(function (div, idx) {
                    expect(div.hasClass('two')).toEqual(!list[idx]);
                });
                expect(unique.length > 1).toEqual(true);
            });
            it('you can also use changeClass as a shorthand of removeClass and addClass', function () {
                divs.changeClass('one not two', 'three');
                divs.each(function (div, idx) {
                    expect(div.hasClass('one')).toEqual(false);
                    expect(div.hasClass('two')).toEqual(false);
                    expect(div.hasClass('not')).toEqual(false);
                    expect(div.hasClass('three')).toEqual(true);
                });
            });
        });
        describe('there is also a data attributes interface', function () {
            it('where you can add', function () {
                divs.duff(function (div, idx) {
                    expect(div.element().getAttribute('data-one')).toEqual(null);
                    expect(div.element().getAttribute('data-two')).toEqual(null);
                });
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div, idx) {
                    expect(div.element().getAttribute('data-one')).toEqual('one');
                    expect(div.element().getAttribute('data-two')).toEqual('two');
                });
            });
            it('remove', function () {
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div, idx) {
                    expect(div.element().getAttribute('data-one')).toEqual('one');
                    expect(div.element().getAttribute('data-two')).toEqual('two');
                });
                divs.data({
                    one: false,
                    two: false
                });
                divs.duff(function (div, idx) {
                    expect(div.element().getAttribute('data-one')).toEqual(null);
                    expect(div.element().getAttribute('data-two')).toEqual(null);
                });
            });
            it('and update data attributes', function () {
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div) {
                    expect(div.element().getAttribute('data-one')).toEqual('one');
                    expect(div.element().getAttribute('data-two')).toEqual('two');
                });
            });
        });
        describe('it can also manipulate elements in other ways', function () {
            it('like by manipulating their attributes', function () {
                divs.duff(function (div) {
                    expect(div.element().getAttribute('tabindex')).toEqual(null);
                });
                divs.attr({
                    tabindex: -1
                });
                divs.each(function (div, idx) {
                    expect(div.attr('tabindex')).toEqual(-1);
                });
            });
            it('or by manipulating their properties', function () {
                divs.duff(function (div, idx) {
                    expect(div.element().align).toEqual('');
                });
                divs.prop({
                    align: 'left'
                });
                divs.each(function (div, idx) {
                    expect(div.prop('align')).toEqual('left');
                });
            });
        });
        describe('can have specialized elements', function () {
            describe('has lifecycle events', function () {
                it('like attach', function () {
                    divs.remove();
                    divs.on('attach', handler);
                    expect(count).toEqual(0);
                    $con.append(divs);
                    expect(count).toEqual(5);
                });
                it('and detach', function () {
                    divs.once('detach', handler);
                    expect(count).toEqual(0);
                    divs.remove();
                    expect(count).toEqual(5);
                });
                it('and attribute change', function () {
                    divs.once('attributeChange:data-here', handler);
                    expect(count).toEqual(0);
                    divs.data('here', 1);
                    expect(count).toEqual(5);
                });
            });
            describe('there are also special handlers', function () {
                it('like create', function () {
                    $.registerElement('test0', {
                        onCreate: handler
                    });
                    expect(count).toEqual(0);
                    $.createElement('test0');
                    expect(count).toEqual(1);
                });
                it('and destroy', function () {
                    $.registerElement('test1', {
                        onDestroy: handler
                    });
                    var div = $.createElement('test1');
                    expect(count).toEqual(0);
                    div.destroy();
                    expect(count).toEqual(1);
                });
            });
        });
        it('tags cannot be created without being registered first', function () {
            expect(function () {
                $.createElement('unregistered');
            }).toThrow();
        });
    });
});