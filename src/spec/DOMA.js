application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    var elementData = _.associator,
        test = _.test;
    test.describe('DOMA', function () {
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
            },
            $con = $.createElement('div').css({
                height: '100%',
                width: '100%'
            });
        $(document.body).append($con);
        test.beforeEach(create);
        test.afterEach(function () {
            divs.destroy();
        });
        test.it('is essentially a collection', function () {
            test.expect(_.isInstance($empty, factories.DOMA)).toEqual(true);
            test.expect(_.isInstance($empty, factories.Collection)).toEqual(true);
        });
        test.it('it knows it\'s own client rect', function () {
            var div = divs.first();
            var rect = div.element().getBoundingClientRect();
            test.expect(div.client()).toEqual({
                height: rect.height,
                width: rect.width,
                bottom: rect.bottom,
                right: rect.right,
                left: rect.left,
                top: rect.top
            });
        });
        test.it('can show and hide elements', function () {
            test.expect(divs.hide().map(function (manager) {
                var el = manager.element();
                if (el.style.display === 'none') {
                    return '';
                } else {
                    return el.style.display;
                }
            }).join('')).toEqual('');
            test.expect(divs.show().map(function (manager) {
                var el = manager.element();
                if (el.style.display === 'block') {
                    return '';
                } else {
                    return el.style.display;
                }
            }).join('')).toEqual('');
        });
        test.it('can attach dom elements', function () {
            var div = divs.eq();
            div.append(divs.item(1));
            test.expect(divs.children().item(0)).toEqual(divs.item(1));
        });
        test.it('can remove dom elements', function () {
            var div = divs.eq();
            div.append(divs.item(1));
            test.expect(divs.children().item(0)).toEqual(divs.item(1));
            div.children().remove();
            test.expect(div.children().length()).toEqual(0);
        });
        test.describe('except it has some methods that are highly pertinant to DOM manipulation... ergo: DOMA', function () {
            // test.it('can check if its items are windows', function () {
            //     test.expect($win.is('window')).toEqual(true);
            //     test.expect($doc.is('window')).toEqual(false);
            //     test.expect($body.is('window')).toEqual(false);
            // });
            // test.it('can check if its items are documents', function () {
            //     test.expect($win.is('document')).toEqual(false);
            //     test.expect($doc.is('document')).toEqual(true);
            //     test.expect($body.is('document')).toEqual(false);
            // });
            test.it('can check if its items are actually elements', function () {
                test.expect($win.allElements()).toEqual(false);
                test.expect($doc.allElements()).toEqual(false);
                test.expect($body.allElements()).toEqual(true);
                test.expect($('div').allElements()).toEqual(true);
            });
            // test.it('can check if its items are document fragments', function () {
            //     var frag = document.createDocumentFragment();
            //     frag.appendChild(document.createElement('div'));
            //     test.expect($win.is('fragment')).toEqual(false);
            //     test.expect($doc.is('fragment')).toEqual(false);
            //     test.expect($body.is('fragment')).toEqual(false);
            //     test.expect($('div').is('fragment')).toEqual(false);
            //     test.expect($(frag).is('fragment')).toEqual(true);
            // });
        });
        test.describe('it can filter itself', function () {
            test.it('by query string matching', function () {
                var newDivs = divs.filter('.two');
                test.expect(newDivs.length()).toEqual(2);
            });
            test.it('by filtering against a function', function () {
                var newDivs = divs.filter(function (item, idx) {
                    return ((idx % 3) - 1) === 0;
                });
                test.expect(newDivs.length()).toEqual(2);
                test.expect(newDivs.item()).toEqual(divs.item(1));
                test.expect(newDivs.item(1)).toEqual(divs.item(4));
            });
            // test.it('by passing in an object', function () {
            //     var newDivs = divs.filter({
            //         className: 'one not'
            //     });
            //     test.expect(newDivs.length()).toEqual(3);
            // });
            test.it('can also get the first item', function () {
                test.expect(divs.first()).toEqual(divs.item(0));
            });
            test.it('and the last element in the list', function () {
                test.expect(divs.last()).toEqual(divs.item(divs.length() - 1));
            });
        });
        test.describe('it can find it\'s children', function () {
            test.it('by calling the children method', function () {
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
                test.expect(kids.length()).toEqual(10);
                kids.duff(function (kid, idx) {
                    test.expect(kid.element().localName).toEqual('span');
                });
                kids = divs.children(1);
                test.expect(kids.length()).toEqual(5);
                kids = divs.children('.span-2');
                test.expect(kids.toArray()).toEqual(divs.children().filter('.span-2').toArray());
                test.expect(kids.length()).toEqual(2);
                test.expect(kids.element() === kids.item(1)).toEqual(false);
            });
            test.it('by querying the dom elements', function () {
                divs.duff(function (div, idx) {
                    div.element().innerHTML = '<span></span><img/>';
                });
                var kids = divs.$('img');
                test.expect(kids.length()).toEqual(5);
                kids.duff(function (kid, idx) {
                    test.expect(kid.element().tagName).toEqual('IMG');
                });
            });
        });
        test.describe('it can also find it\'s parents', function () {
            test.it('either by counting up', function () {
                var $start = $('.leaves'),
                    $end = $('.tree'),
                    end = $start.parent(2);
                test.expect(end.first().element()).toEqual($end.first().element());
            });
            test.it('or by finding via selector', function () {
                var $start = $('.leaves'),
                    $end = $('.tree'),
                    end = $start.parent('.tree');
                test.expect(end.first().element()).toEqual($end.first().element());
            });
            test.it('or by passing a function', function () {
                var $start = $('.leaves'),
                    end = $start.parent(function (el) {
                        var parent = el.parentNode;
                        return [parent, parent && parent.tagName === 'BODY'];
                    });
                test.expect(end.item(0).element()).toEqual(document.body);
            });
            test.describe('or by passing a keyword', function () {
                test.it('like document', function () {
                    var $start = $('.leaves'),
                        end = $start.parent('document');
                    test.expect(end.first().element()).toEqual(document);
                });
                test.it('or window', function () {
                    var $start = $('.leaves'),
                        end = $start.parent('window');
                    test.expect(end.first().element()).toEqual(window);
                });
            });
        });
        test.describe('all of this traversing can be undone', function () {
            test.it('with the end method', function () {
                var $start = $('.results .failures');
                var $next = $start.parent();
                $next = $next.children();
                $next = $next.end();
                test.expect($next === $start).toEqual(true);
            });
        });
        test.describe('the domm is also special because it abstracts event listeners for you', function () {
            test.describe('can add handlers', function () {
                test.it('one at a time', function () {
                    divs.on('click', handler);
                    test.expect(count).toEqual(0);
                    divs.click();
                    test.expect(count).toEqual(5);
                });
                test.it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler);
                    test.expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    divs.dispatchEvent('mouseover');
                    divs.dispatchEvent('mouseout');
                    test.expect(count).toEqual(15);
                });
            });
        });
        test.describe('the domm is also special because it abstracts event listeners for you', function () {
            test.describe('can add handlers', function () {
                test.it('one at a time', function () {
                    divs.on('click', handler);
                    test.expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    test.expect(count).toEqual(5);
                });
                test.it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler);
                    test.expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    divs.dispatchEvent('mouseover');
                    divs.dispatchEvent('mouseout');
                    test.expect(count).toEqual(15);
                });
            });
            test.describe('also capture handlers', function () {
                test.it('one at a time', function () {
                    divs.on('click', handler, true);
                    test.expect(count).toEqual(0);
                    divs.dispatchEvent('click', {}, true);
                    test.expect(count).toEqual(5);
                });
                test.it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler, true);
                    test.expect(count).toEqual(0);
                    divs.dispatchEvent('click', {}, true);
                    divs.dispatchEvent('mouseover', {}, true);
                    divs.dispatchEvent('mouseout', {}, true);
                    test.expect(count).toEqual(15);
                });
            });
            test.it('will only add a method to the queue once. if a duplicate is passed in, it will be ignored (just like the browser implementation)', function () {
                divs.on('click', handler).on('click', handler);
                test.expect(count).toEqual(0);
                divs.dispatchEvent('click');
                test.expect(count).toEqual(5);
                divs.dispatchEvent('click');
                test.expect(count).toEqual(10);
            });
            test.it('once wrappers can also be used with the once method and they can be added the same way as once', function () {
                divs.once('click', handler);
                test.expect(count).toEqual(0);
                divs.dispatchEvent('click');
                test.expect(count).toEqual(5);
                divs.dispatchEvent('click');
                test.expect(count).toEqual(5);
            });
            test.it('be careful with the once function because they can be added multiple times to the queue, since they use a proxy function, like the one available at _.once', function () {
                divs.once('click', handler);
                test.expect(count).toEqual(0);
                divs.dispatchEvent('click');
                test.expect(count).toEqual(5);
                divs.dispatchEvent('click');
                test.expect(count).toEqual(5);
            });
        });
        test.describe('the each function is special because', function () {
            test.it('it wraps each element in a DOMA object before passing it through your iterator', function () {
                divs.each(function (el, idx) {
                    test.expect(_.isInstance(el, factories.DOMA)).toEqual(false);
                    test.expect(factories.DomManager.isInstance(el)).toEqual(true);
                    test.expect(el.element()).toBe(divs.item(idx).element());
                });
            });
            test.it('where the duff and forEach function just gives you the element at each index, just like a collection', function () {
                divs.duff(function (el, idx) {
                    test.expect(_.isInstance(el, $)).toEqual(false);
                });
                divs.forEach(function (el, idx) {
                    test.expect(_.isInstance(el, $)).toEqual(false);
                });
            });
        });
        test.describe('adding and removing classes is done by string checking instead of the classList to invoke only one reflow', function () {
            test.it('you can use addClass', function () {
                divs.each(function (div, idx) {
                    test.expect(div.hasClass('three')).toEqual(false);
                });
                divs.addClass('three');
                divs.each(function (div, idx) {
                    test.expect(div.hasClass('three')).toEqual(true);
                });
            });
            test.it('you can use removeClass', function () {
                divs.each(function (div, idx) {
                    test.expect(div.hasClass('three')).toEqual(false);
                });
                test.expect(divs.hasClass('three')).toEqual(false);
                divs.addClass('three');
                test.expect(divs.hasClass('three')).toEqual(true);
            });
            test.it('you can use hasClass to check if all of the elements has a particular class', function () {
                test.expect(divs.hasClass('two')).toEqual(false);
                test.expect(divs.hasClass('one')).toEqual(true);
            });
            test.it('you can use toggleClass swap classes depending on whether or not they exist on each element', function () {
                divs.each(function (div, idx) {
                    test.expect(div.hasClass('one')).toEqual(true);
                });
                divs.toggleClass('one');
                divs.each(function (div, idx) {
                    test.expect(div.hasClass('one')).toEqual(false);
                });
            });
            test.it('it will also do this for individual elements', function () {
                var list = [],
                    unique = [];
                divs.each(function (div, idx) {
                    var res = div.hasClass('two');
                    list.push(res);
                    _.add(unique, res);
                });
                divs.toggleClass('two');
                divs.each(function (div, idx) {
                    test.expect(div.hasClass('two')).toEqual(!list[idx]);
                });
                test.expect(unique.length > 1).toEqual(true);
            });
            test.it('you can also use changeClass as a shorthand of removeClass and addClass', function () {
                divs.changeClass('one not two', 'three');
                divs.each(function (div, idx) {
                    test.expect(div.hasClass('one')).toEqual(false);
                    test.expect(div.hasClass('two')).toEqual(false);
                    test.expect(div.hasClass('not')).toEqual(false);
                    test.expect(div.hasClass('three')).toEqual(true);
                });
            });
        });
        test.describe('there is also a data attributes interface', function () {
            test.it('where you can add', function () {
                divs.duff(function (div, idx) {
                    test.expect(div.element().getAttribute('data-one')).toEqual(null);
                    test.expect(div.element().getAttribute('data-two')).toEqual(null);
                });
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div, idx) {
                    test.expect(div.element().getAttribute('data-one')).toEqual('one');
                    test.expect(div.element().getAttribute('data-two')).toEqual('two');
                });
            });
            test.it('remove', function () {
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div, idx) {
                    test.expect(div.element().getAttribute('data-one')).toEqual('one');
                    test.expect(div.element().getAttribute('data-two')).toEqual('two');
                });
                divs.data({
                    one: false,
                    two: false
                });
                divs.duff(function (div, idx) {
                    test.expect(div.element().getAttribute('data-one')).toEqual(null);
                    test.expect(div.element().getAttribute('data-two')).toEqual(null);
                });
            });
            test.it('and update data attributes', function () {
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div) {
                    test.expect(div.element().getAttribute('data-one')).toEqual('one');
                    test.expect(div.element().getAttribute('data-two')).toEqual('two');
                });
            });
        });
        test.describe('it can also manipulate elements in other ways', function () {
            test.it('like by manipulating their attributes', function () {
                divs.duff(function (div) {
                    test.expect(div.element().getAttribute('tabindex')).toEqual(null);
                });
                divs.attr({
                    tabindex: -1
                });
                divs.each(function (div, idx) {
                    test.expect(div.attr('tabindex')).toEqual(-1);
                });
            });
            test.it('or by manipulating their properties', function () {
                divs.duff(function (div, idx) {
                    test.expect(div.element().align).toEqual('');
                });
                divs.prop({
                    align: 'left'
                });
                divs.each(function (div, idx) {
                    test.expect(div.prop('align')).toEqual('left');
                });
            });
        });
        test.describe('can have specialized elements', function () {
            test.describe('has lifecycle events', function () {
                test.it('like attach', function () {
                    divs.remove();
                    divs.on('attach', handler);
                    test.expect(count).toEqual(0);
                    $con.append(divs);
                    test.expect(count).toEqual(5);
                });
                test.it('and detach', function () {
                    divs.once('detach', handler);
                    test.expect(count).toEqual(0);
                    divs.remove();
                    test.expect(count).toEqual(5);
                });
                test.it('and attribute change', function () {
                    divs.once('attributeChange:data-here', handler);
                    test.expect(count).toEqual(0);
                    divs.data('here', 1);
                    test.expect(count).toEqual(5);
                });
            });
            test.describe('there are also special handlers', function () {
                test.it('like create', function () {
                    $.registerElement('test0', {
                        creation: handler
                    });
                    test.expect(count).toEqual(0);
                    $.createElement('test0');
                    test.expect(count).toEqual(1);
                });
                test.it('and destroy', function () {
                    $.registerElement('test1', {
                        destruction: handler
                    });
                    var div = $.createElement('test1');
                    test.expect(count).toEqual(0);
                    div.destroy();
                    test.expect(count).toEqual(1);
                });
            });
        });
        test.it('tags cannot be created without being registered first', function () {
            test.expect(function () {
                $.createElement('unregistered-test');
            }).toThrow();
            test.expect($.registeredElements['unregistered-test']).toEqual(undefined);
            $.registerElement('unregistered-test');
            test.expect(function () {
                $.createElement('unregistered-test');
            }).not.toThrow();
        });
        test.it('tags are automatically queried for and registered', function () {
            test.expect($.document.data.get(document.getElementById('nodatahere')).DomManager).toEqual(void 0);
            // this one has an is property so it will be queried for automatically
            test.expect($.document.data.get(document.getElementById('datahere')).DomManager).not.toEqual(void 0);
        });
        test.it('can use direct parent selectors', function () {
            test.expect($('.branch').eq(0).$('> .leaves').length()).toEqual(5);
        });
        test.it('can traverse horizontally for it\'s siblings', function () {
            var $branch = $('.branch');
            var $item2 = $branch.item(2);
            test.expect(factories.DomManager.isInstance($item2)).toBe(true);
            test.expect($item2.prev()).toEqual($branch.item(1));
        });
        test.it('establishes dom managers immediately after an element\'s html is changed', function () {
            var $tree = $.createElement('div');
            $tree.html('<div><span is></span></div>');
            test.expect($tree.element().querySelectorAll('span')[0].__elid__).not.toEqual(void 0);
        });
        var template1 = function (data) {
            var listItems = _.map(data && data.points, function (item, index) {
                return [item.tag, {
                        class: "classname" + (item.number || index)
                    },
                    item.text, {
                        key: 'listitem' + (item.number || index)
                    }
                ];
            });
            return ['div', {
                    class: 'tree'
                },
                [
                    ['span', {
                        class: 'spanned'
                    }, 'name', {
                        key: 'name'
                    }],
                    ['ul', {
                            class: 'container'
                        },
                        listItems, {
                            key: 'container'
                        }
                    ]
                ]
            ];
        };
        var makeBasicTemplate = function (points) {
            return template1({
                points: points || [{
                    tag: 'li',
                    text: 'sometext'
                }, {
                    tag: 'li',
                    text: 'someothertext'
                }]
            });
        };
        var basicTemplateKeyTagNames = {
            name: 'span',
            container: 'ul'
        };
        var applyMutations = function (mutations) {
            _.duff([mutations.remove, mutations.update, mutations.insert], function (fn) {
                fn();
            });
        };
        test.describe('can diff node trees and update them', function () {
            var $root, templatized;
            test.beforeEach(function () {
                $root = $.createElement('div');
                templatized = makeBasicTemplate();
            });
            test.it('and update them', function () {
                var diff = $.nodeComparison($root.element(), templatized);
                test.expect($root.html()).toEqual('');
                _.each(diff.mutations, function (level, key) {
                    test.expect(_.isFunction(level)).toBe(true);
                });
                applyMutations(diff.mutations);
                test.expect($root.html()).not.toEqual('');
            });
            test.it('collects keys that the template marks using index 3 of each child', function () {
                var diff = $.nodeComparison($root.element(), templatized);
                _.each(diff.keys, function (element, key) {
                    test.expect(element.tagName.toLowerCase()).toEqual(basicTemplateKeyTagNames[key] || 'li');
                });
            });
            test.it('updates attributes when needed', function () {
                var attributes = {};
                var diff = $.nodeComparison($root.element(), templatized);
                var attrs = $root.attributes();
                test.expect(attrs).not.toEqual(templatized[1]);
                applyMutations(diff.mutations);
                attrs = $root.attributes();
                test.expect(attrs).toEqual(templatized[1]);
            });
            test.it('removes nodes when needed', function () {
                var diff = $.nodeComparison($root.element(), templatized);
                applyMutations(diff.mutations);
                templatized = makeBasicTemplate([{
                    tag: 'li',
                    text: 'sometext'
                }]);
                var $lis = $root.$('ul.container').children();
                var $first = $lis.first();
                var diff2 = $.nodeComparison($root.element(), templatized, diff.keys);
                applyMutations(diff2.mutations);
                var $newChildren = $root.$('ul.container').children();
                test.expect($first.element()).toBe($newChildren.first().element());
                test.expect($newChildren.length()).toEqual(1);
            });
            test.it('removes nodes even when they\'re at the front', function () {
                var diff = $.nodeComparison($root.element(), templatized);
                applyMutations(diff.mutations);
                templatized = makeBasicTemplate([{
                    tag: 'li',
                    text: 'someothertext2',
                    number: '1'
                }]);
                var $lis = $root.$('ul.container').children();
                var $first = $lis.first();
                var diff2 = $.nodeComparison($root.element(), templatized, diff.keys);
                applyMutations(diff2.mutations);
                var $newChildren = $root.$('ul.container').children();
                test.expect($first.element()).not.toBe(void 0);
                test.expect($first.element()).not.toBe($newChildren.first().element());
                test.expect($newChildren.length()).toEqual(1);
            });
            test.it('and inserts them at the front when needed', function () {
                templatized = makeBasicTemplate([{
                    tag: 'li',
                    text: 'someothertext2',
                    number: '1'
                }]);
                var diff = $.nodeComparison($root.element(), templatized);
                applyMutations(diff.mutations);
                var $lis = $root.$('ul.container').children();
                var $first = $lis.first();
                templatized = makeBasicTemplate();
                var diff2 = $.nodeComparison($root.element(), templatized, diff.keys);
                applyMutations(diff2.mutations);
                var $newChildren = $root.$('ul.container').children();
                test.expect($first.element()).not.toBe($newChildren.first().element());
                test.expect($newChildren.length()).toEqual(2);
            });
            test.it('can rearrange elements as needed', function () {
                templatized = makeBasicTemplate([{
                    tag: 'li',
                    text: 'another',
                    number: '2'
                }, {
                    tag: 'li',
                    text: 'someothertext2',
                    number: '1'
                }, {
                    tag: 'li',
                    text: 'anotherone',
                    number: '3'
                }, {
                    tag: 'li',
                    text: 'first',
                    number: '0'
                }]);
                var diff = $.nodeComparison($root.element(), templatized);
                applyMutations(diff.mutations);
                var $lis = $root.$('ul.container').children();
                var list = $lis.elements().toArray();
                templatized = makeBasicTemplate([{
                    tag: 'li',
                    text: 'first',
                    number: '0'
                }, {
                    tag: 'li',
                    text: 'someothertextfirstindex',
                    number: '1'
                }, {
                    tag: 'li',
                    text: 'anothersecondindex',
                    number: '2'
                }, {
                    tag: 'li',
                    text: 'anotheronethird',
                    number: '3'
                }]);
                var diff2 = $.nodeComparison($root.element(), templatized, diff.keys);
                applyMutations(diff2.mutations);
                var $newChildren = $root.$('ul.container').children();
                // should be strictly equal to since
                test.expect(list[3]).toBe($newChildren.element(0));
                test.expect(list[1]).toBe($newChildren.element(1));
                test.expect(list[0]).toBe($newChildren.element(2));
                test.expect(list[2]).toBe($newChildren.element(3));
                test.expect($newChildren.length()).toEqual(4);
            });
        });
    });
});