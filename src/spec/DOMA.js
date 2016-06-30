application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    var elementData = _.associator;
    _.describe('DOMA', function () {
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
        _.beforeEach(create);
        _.afterEach(function () {
            divs.destroy();
        });
        _.it('is essentially a collection', function () {
            _.expect(_.isInstance($empty, factories.DOMA)).toEqual(true);
            _.expect(_.isInstance($empty, factories.Collection)).toEqual(true);
        });
        _.it('it knows it\'s own client rect', function () {
            var div = divs.first();
            var rect = div.element().getBoundingClientRect();
            _.expect(div.client()).toEqual({
                height: rect.height,
                width: rect.width,
                bottom: rect.bottom,
                right: rect.right,
                left: rect.left,
                top: rect.top,
            });
        });
        _.it('can show and hide elements', function () {
            _.expect(divs.hide().map(function (manager) {
                var el = manager.element();
                if (el.style.display === 'none') {
                    return '';
                } else {
                    return el.style.display;
                }
            }).join('')).toEqual('');
            _.expect(divs.show().map(function (manager) {
                var el = manager.element();
                if (el.style.display === 'block') {
                    return '';
                } else {
                    return el.style.display;
                }
            }).join('')).toEqual('');
        });
        _.it('can attach dom elements', function () {
            var div = divs.eq();
            div.append(divs.item(1));
            _.expect(divs.children().item(0)).toEqual(divs.item(1));
        });
        _.it('can remove dom elements', function () {
            var div = divs.eq();
            div.append(divs.item(1));
            _.expect(divs.children().item(0)).toEqual(divs.item(1));
            div.children().remove();
            _.expect(div.children().length()).toEqual(0);
        });
        _.describe('except it has some methods that are highly pertinant to DOM manipulation... ergo: DOMA', function () {
            // _.it('can check if its items are windows', function () {
            //     _.expect($win.isWindow()).toEqual(true);
            //     _.expect($doc.isWindow()).toEqual(false);
            //     _.expect($body.isWindow()).toEqual(false);
            // });
            // _.it('can check if its items are documents', function () {
            //     _.expect($win.isDocument()).toEqual(false);
            //     _.expect($doc.isDocument()).toEqual(true);
            //     _.expect($body.isDocument()).toEqual(false);
            // });
            _.it('can check if its items are actually elements', function () {
                _.expect($win.allElements()).toEqual(false);
                _.expect($doc.allElements()).toEqual(false);
                _.expect($body.allElements()).toEqual(true);
                _.expect($('div').allElements()).toEqual(true);
            });
            // _.it('can check if its items are document fragments', function () {
            //     var frag = document.createDocumentFragment();
            //     frag.appendChild(document.createElement('div'));
            //     _.expect($win.isFragment()).toEqual(false);
            //     _.expect($doc.isFragment()).toEqual(false);
            //     _.expect($body.isFragment()).toEqual(false);
            //     _.expect($('div').isFragment()).toEqual(false);
            //     _.expect($(frag).isFragment()).toEqual(true);
            // });
        });
        _.describe('it can filter itself', function () {
            _.it('by query string matching', function () {
                var newDivs = divs.filter('.two');
                _.expect(newDivs.length()).toEqual(2);
            });
            _.it('by filtering against a function', function () {
                var newDivs = divs.filter(function (item, idx) {
                    return ((idx % 3) - 1) === 0;
                });
                _.expect(newDivs.length()).toEqual(2);
                _.expect(newDivs.get()).toEqual(divs.get(1));
                _.expect(newDivs.get(1)).toEqual(divs.get(4));
            });
            _.it('by passing in an object', function () {
                var newDivs = divs.filter({
                    className: 'one not'
                });
                _.expect(newDivs.length()).toEqual(3);
            });
            _.it('can also get the first', function () {
                _.expect(divs.first()).toEqual(divs.item(0));
            });
            _.it('and the last element in the list', function () {
                _.expect(divs.last()).toEqual(divs.item(divs.length() - 1));
            });
        });
        _.describe('it can find it\'s children', function () {
            _.it('by calling the children method', function () {
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
                _.expect(kids.length()).toEqual(10);
                kids.duff(function (kid, idx) {
                    _.expect(kid.element().localName).toEqual('span');
                });
                kids = divs.children(1);
                _.expect(kids.length()).toEqual(5);
                kids = divs.children('.span-2');
                _.expect(kids.unwrap()).toEqual(divs.children().filter('.span-2').unwrap());
                _.expect(kids.length()).toEqual(2);
                _.expect(kids.element() === kids.item(1)).toEqual(false);
            });
            _.it('by querying the dom elements', function () {
                divs.duff(function (div, idx) {
                    div.element().innerHTML = '<span></span><img/>';
                });
                var kids = divs.$('img');
                _.expect(kids.length()).toEqual(5);
                kids.duff(function (kid, idx) {
                    _.expect(kid.element().tagName).toEqual('IMG');
                });
            });
        });
        _.describe('it can also find it\'s parents', function () {
            _.it('either by counting up', function () {
                var $start = $('.leaves'),
                    $end = $('.tree'),
                    end = $start.parent(2);
                _.expect(end.first().element()).toEqual($end.first().element());
            });
            _.it('or by finding via selector', function () {
                var $start = $('.leaves'),
                    $end = $('.tree'),
                    end = $start.parent('.tree');
                _.expect(end.first().element()).toEqual($end.first().element());
            });
            _.it('or by passing a function', function () {
                var $start = $('.leaves'),
                    end = $start.parent(function (el) {
                        var parent = el.parentNode;
                        return [parent, parent && parent.tagName === 'BODY'];
                    });
                _.expect(end.item(0).element()).toEqual(document.body);
            });
            _.describe('or by passing a keyword', function () {
                _.it('like document', function () {
                    var $start = $('.leaves'),
                        end = $start.parent('document');
                    _.expect(end.first().element()).toEqual(document);
                });
                _.it('or window', function () {
                    var $start = $('.leaves'),
                        end = $start.parent('window');
                    _.expect(end.first().element()).toEqual(window);
                });
            });
        });
        _.describe('all of this traversing can be undone', function () {
            _.it('with the end method', function () {
                var $start = $('.results .failures');
                var $next = $start.parent();
                $next = $next.children();
                $next = $next.end();
                _.expect($next === $start).toEqual(true);
            });
        });
        _.describe('the domm is also special because it abstracts event listeners for you', function () {
            _.describe('can add handlers', function () {
                _.it('one at a time', function () {
                    divs.on('click', handler);
                    _.expect(count).toEqual(0);
                    divs.click();
                    _.expect(count).toEqual(5);
                });
                _.it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler);
                    _.expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    divs.dispatchEvent('mouseover');
                    divs.dispatchEvent('mouseout');
                    _.expect(count).toEqual(15);
                });
            });
        });
        _.describe('the domm is also special because it abstracts event listeners for you', function () {
            _.describe('can add handlers', function () {
                _.it('one at a time', function () {
                    divs.on('click', handler);
                    _.expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    _.expect(count).toEqual(5);
                });
                _.it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler);
                    _.expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    divs.dispatchEvent('mouseover');
                    divs.dispatchEvent('mouseout');
                    _.expect(count).toEqual(15);
                });
            });
            _.describe('also capture handlers', function () {
                _.it('one at a time', function () {
                    divs.on('click', handler, true);
                    _.expect(count).toEqual(0);
                    divs.dispatchEvent('click', {}, true);
                    _.expect(count).toEqual(5);
                });
                _.it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler, true);
                    _.expect(count).toEqual(0);
                    divs.dispatchEvent('click', {}, true);
                    divs.dispatchEvent('mouseover', {}, true);
                    divs.dispatchEvent('mouseout', {}, true);
                    _.expect(count).toEqual(15);
                });
            });
            _.it('will only add a method to the queue once. if a duplicate is passed in, it will be ignored (just like the browser implementation)', function () {
                divs.on('click', handler).on('click', handler);
                _.expect(count).toEqual(0);
                divs.dispatchEvent('click');
                _.expect(count).toEqual(5);
                divs.dispatchEvent('click');
                _.expect(count).toEqual(10);
            });
            _.it('once wrappers can also be used with the once method and they can be added the same way as once', function () {
                divs.once('click', handler);
                _.expect(count).toEqual(0);
                divs.dispatchEvent('click');
                _.expect(count).toEqual(5);
                divs.dispatchEvent('click');
                _.expect(count).toEqual(5);
            });
            _.it('be careful with the once function because they can be added multiple times to the queue, since they use a proxy function, like the one available at _.once', function () {
                divs.once('click', handler);
                _.expect(count).toEqual(0);
                divs.dispatchEvent('click');
                _.expect(count).toEqual(5);
                divs.dispatchEvent('click');
                _.expect(count).toEqual(5);
            });
        });
        _.describe('the each function is special because', function () {
            _.it('it wraps each element in a DOMA object before passing it through your iterator', function () {
                divs.each(function (el, idx) {
                    _.expect(_.isInstance(el, factories.DOMA)).toEqual(false);
                    _.expect(factories.DomManager.isInstance(el)).toEqual(true);
                    _.expect(divs.item(idx) === el.element());
                });
            });
            _.it('where the duff and forEach function just gives you the element at each index, just like a collection', function () {
                divs.duff(function (el, idx) {
                    _.expect(_.isInstance(el, $)).toEqual(false);
                });
                divs.forEach(function (el, idx) {
                    _.expect(_.isInstance(el, $)).toEqual(false);
                });
            });
        });
        _.describe('adding and removing classes is done by string checking instead of the classList to invoke only one reflow', function () {
            _.it('you can use addClass', function () {
                divs.each(function (div, idx) {
                    _.expect(div.hasClass('three')).toEqual(false);
                });
                divs.addClass('three');
                divs.each(function (div, idx) {
                    _.expect(div.hasClass('three')).toEqual(true);
                });
            });
            _.it('you can use removeClass', function () {
                divs.each(function (div, idx) {
                    _.expect(div.hasClass('three')).toEqual(false);
                });
                _.expect(divs.hasClass('three')).toEqual(false);
                divs.addClass('three');
                _.expect(divs.hasClass('three')).toEqual(true);
            });
            _.it('you can use hasClass to check if all of the elements has a particular class', function () {
                _.expect(divs.hasClass('two')).toEqual(false);
                _.expect(divs.hasClass('one')).toEqual(true);
            });
            _.it('you can use toggleClass swap classes depending on whether or not they exist on each element', function () {
                divs.each(function (div, idx) {
                    _.expect(div.hasClass('one')).toEqual(true);
                });
                divs.toggleClass('one');
                divs.each(function (div, idx) {
                    _.expect(div.hasClass('one')).toEqual(false);
                });
            });
            _.it('it will also do this for individual elements', function () {
                var list = [],
                    unique = [];
                divs.each(function (div, idx) {
                    var res = div.hasClass('two');
                    list.push(res);
                    _.add(unique, res);
                });
                divs.toggleClass('two');
                divs.each(function (div, idx) {
                    _.expect(div.hasClass('two')).toEqual(!list[idx]);
                });
                _.expect(unique.length > 1).toEqual(true);
            });
            _.it('you can also use changeClass as a shorthand of removeClass and addClass', function () {
                divs.changeClass('one not two', 'three');
                divs.each(function (div, idx) {
                    _.expect(div.hasClass('one')).toEqual(false);
                    _.expect(div.hasClass('two')).toEqual(false);
                    _.expect(div.hasClass('not')).toEqual(false);
                    _.expect(div.hasClass('three')).toEqual(true);
                });
            });
        });
        _.describe('there is also a data attributes interface', function () {
            _.it('where you can add', function () {
                divs.duff(function (div, idx) {
                    _.expect(div.element().getAttribute('data-one')).toEqual(null);
                    _.expect(div.element().getAttribute('data-two')).toEqual(null);
                });
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div, idx) {
                    _.expect(div.element().getAttribute('data-one')).toEqual('one');
                    _.expect(div.element().getAttribute('data-two')).toEqual('two');
                });
            });
            _.it('remove', function () {
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div, idx) {
                    _.expect(div.element().getAttribute('data-one')).toEqual('one');
                    _.expect(div.element().getAttribute('data-two')).toEqual('two');
                });
                divs.data({
                    one: false,
                    two: false
                });
                divs.duff(function (div, idx) {
                    _.expect(div.element().getAttribute('data-one')).toEqual(null);
                    _.expect(div.element().getAttribute('data-two')).toEqual(null);
                });
            });
            _.it('and update data attributes', function () {
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.duff(function (div) {
                    _.expect(div.element().getAttribute('data-one')).toEqual('one');
                    _.expect(div.element().getAttribute('data-two')).toEqual('two');
                });
            });
        });
        _.describe('it can also manipulate elements in other ways', function () {
            _.it('like by manipulating their attributes', function () {
                divs.duff(function (div) {
                    _.expect(div.element().getAttribute('tabindex')).toEqual(null);
                });
                divs.attr({
                    tabindex: -1
                });
                divs.each(function (div, idx) {
                    _.expect(div.attr('tabindex')).toEqual(-1);
                });
            });
            _.it('or by manipulating their properties', function () {
                divs.duff(function (div, idx) {
                    _.expect(div.element().align).toEqual('');
                });
                divs.prop({
                    align: 'left'
                });
                divs.each(function (div, idx) {
                    _.expect(div.prop('align')).toEqual('left');
                });
            });
        });
        _.describe('can have specialized elements', function () {
            _.describe('has lifecycle events', function () {
                _.it('like attach', function () {
                    divs.remove();
                    divs.on('attach', handler);
                    _.expect(count).toEqual(0);
                    $con.append(divs);
                    _.expect(count).toEqual(5);
                });
                _.it('and detach', function () {
                    divs.once('detach', handler);
                    _.expect(count).toEqual(0);
                    divs.remove();
                    _.expect(count).toEqual(5);
                });
                _.it('and attribute change', function () {
                    divs.once('attributeChange:data-here', handler);
                    _.expect(count).toEqual(0);
                    divs.data('here', 1);
                    _.expect(count).toEqual(5);
                });
            });
            _.describe('there are also special handlers', function () {
                _.it('like create', function () {
                    $.registerElement('test0', {
                        creation: handler
                    });
                    _.expect(count).toEqual(0);
                    $.createElement('test0');
                    _.expect(count).toEqual(1);
                });
                _.it('and destroy', function () {
                    $.registerElement('test1', {
                        destruction: handler
                    });
                    var div = $.createElement('test1');
                    _.expect(count).toEqual(0);
                    div.destroy();
                    _.expect(count).toEqual(1);
                });
            });
        });
        _.it('tags cannot be created without being registered first', function () {
            _.expect(function () {
                $.createElement('unregistered-test');
            }).toThrow();
            $.registerElement('unregistered-test');
            _.expect(function () {
                $.createElement('unregistered-test');
            }).not.toThrow();
        });
        _.it('tags are automatically queried for and registered', function () {
            _.expect($.document.data.get(document.getElementById('nodatahere')).DomManager).toEqual(void 0);
            // this one has an is property so it will be queried for automatically
            _.expect($.document.data.get(document.getElementById('datahere')).DomManager).not.toEqual(void 0);
        });
        _.it('can use direct parent selectors', function () {
            _.expect($('.branch').eq(0).$('> .leaves').length()).toEqual(5);
        });
        _.it('can traverse horizontally for it\'s siblings', function () {
            var $branch = $('.branch');
            var $item2 = $branch.item(2);
            _.expect(factories.DomManager.isInstance($item2));
            _.expect($item2.prev()).toEqual($branch.item(1));
        });
        _.it('establishes dom managers immediately after an element\'s html is changed', function () {
            var $tree = $.createElement('div');
            $tree.html('<div><span is></span></div>');
            _.expect($tree.element().querySelectorAll('span')[0].__elid__).not.toEqual(void 0);
        });
        var template1 = function (data) {
            var listItems = _.map(data && data.points, function (item, index) {
                return [item.tag, {
                        class: "classname" + index
                    },
                    item.text, {
                        key: 'listitem' + index
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
            _.each(mutations, function (level) {
                _.each(level, function (fn) {
                    fn();
                });
            });
        };
        _.describe('can diff node trees and update them', function () {
            var $root, templatized;
            _.beforeEach(function () {
                $root = $.createElement('div');
                templatized = makeBasicTemplate();
            });
            _.it('and update them', function () {
                var diff = $.nodeComparison($root.element(), templatized);
                _.expect($root.html()).toEqual('');
                _.each(diff.mutations, function (level) {
                    _.expect(_.isArray(level)).toBe(true);
                    _.each(level, function (mutator) {
                        _.expect(_.isFunction(mutator)).toBe(true);
                    });
                });
                applyMutations(diff.mutations);
                _.expect($root.html()).not.toEqual('');
            });
            _.it('collects keys that the template marks using index 3 of each child', function () {
                var diff = $.nodeComparison($root.element(), templatized);
                _.each(diff.keys, function (element, key) {
                    _.expect(element.tagName.toLowerCase()).toEqual(basicTemplateKeyTagNames[key] || 'li');
                });
            });
            _.it('updates attributes when needed', function () {
                var attributes = {};
                var diff = $.nodeComparison($root.element(), templatized);
                var attrs = $root.attributes();
                _.expect(attrs).not.toEqual(templatized[1]);
                applyMutations(diff.mutations);
                attrs = $root.attributes();
                _.expect(attrs).toEqual(templatized[1]);
            });
            _.it('removes nodes when needed', function () {
                var diff = $.nodeComparison($root.element(), templatized);
                applyMutations(diff.mutations);
                templatized = makeBasicTemplate([{
                    tag: 'li',
                    text: 'sometext'
                }]);
                var $lis = $root.$('ul.container').children();
                var $first = $lis.first();
                var diff2 = $.nodeComparison($root.element(), templatized);
                applyMutations(diff2.mutations);
                var $newChildren = $root.$('ul.container').children();
                _.expect($first.element()).toBe($newChildren.first().element());
                _.expect($newChildren.length()).toEqual(1);
            });
        });
    });
});