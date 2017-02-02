application.scope().run(window, function (module, app, _, factories, $) {
    var elementData = _.associator,
        divsLength = 5;
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
        }, 2);
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
        }, 1);
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
        }, 2);
        test.it('can attach dom elements', function () {
            var div = divs.eq();
            div.append(divs.item(1));
            test.expect(divs.children().item(0)).toEqual(divs.item(1));
        }, 1);
        test.it('can remove dom elements', function () {
            var div = divs.eq();
            div.append(divs.item(1));
            test.expect(divs.children().item(0)).toEqual(divs.item(1));
            div.children().remove();
            test.expect(div.children().length()).toEqual(0);
        }, 2);
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
            }, 4);
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
            }, 1);
            test.it('by filtering against a function', function () {
                var newDivs = divs.filter(function (item, idx) {
                    return ((idx % 3) - 1) === 0;
                });
                test.expect(newDivs.length()).toEqual(2);
                test.expect(newDivs.item()).toEqual(divs.item(1));
                test.expect(newDivs.item(1)).toEqual(divs.item(4));
            }, 3);
            // test.it('by passing in an object', function () {
            //     var newDivs = divs.filter({
            //         className: 'one not'
            //     });
            //     test.expect(newDivs.length()).toEqual(3);
            // });
            test.it('can also get the first item', function () {
                test.expect(divs.first()).toEqual(divs.item(0));
            }, 1);
            test.it('and the last element in the list', function () {
                test.expect(divs.last()).toEqual(divs.item(divs.length() - 1));
            }, 1);
        });
        test.describe('it can find it\'s children', function () {
            test.it('by calling the children method', function () {
                divs.forEach(function (manager, idx) {
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
                kids.forEach(function (kid, idx) {
                    test.expect(kid.element().localName).toEqual('span');
                });
                kids = divs.children(1);
                test.expect(kids.length()).toEqual(5);
                kids = divs.children('.span-2');
                test.expect(kids.toArray()).toEqual(divs.children().filter('.span-2').toArray());
                test.expect(kids.length()).toEqual(2);
                test.expect(kids.element() === kids.item(1)).toEqual(false);
            }, (divsLength * 2) + 5);
            test.it('by querying the dom elements', function () {
                divs.forEach(function (div, idx) {
                    div.element().innerHTML = '<span></span><img/>';
                });
                var kids = divs.$('img');
                test.expect(kids.length()).toEqual(5);
                kids.forEach(function (kid, idx) {
                    test.expect(kid.element().tagName).toEqual('IMG');
                });
            }, 6);
        });
        test.describe('it can also find it\'s parents', function () {
            test.it('either by counting up', function () {
                var $start = $('.leaves'),
                    $end = $('.tree'),
                    end = $start.parent(2);
                test.expect(end.first().element()).toEqual($end.first().element());
            }, 1);
            test.it('or by finding via selector', function () {
                var $start = $('.leaves'),
                    $end = $('.tree'),
                    end = $start.parent('.tree');
                test.expect(end.first().element()).toEqual($end.first().element());
            }, 1);
            test.it('or by passing a function', function () {
                var $start = $('.leaves'),
                    end = $start.parent(function (el) {
                        var parent = el.parentNode;
                        return [parent, parent && parent.tagName === 'BODY'];
                    });
                test.expect(end.item(0).element()).toEqual(document.body);
            }, 1);
            test.describe('or by passing a keyword', function () {
                test.it('like document', function () {
                    var $start = $('.leaves'),
                        end = $start.parent('document');
                    test.expect(end.first().element()).toEqual(document);
                }, 1);
                test.it('or window', function () {
                    var $start = $('.leaves'),
                        end = $start.parent('window');
                    test.expect(end.first().element()).toEqual(window);
                }, 1);
            });
        });
        test.describe('all of this traversing can be undone', function () {
            test.it('with the end method', function () {
                var $start = $('.results .failures');
                var $next = $start.parent();
                $next = $next.children();
                $next = $next.end();
                test.expect($next === $start).toEqual(true);
            }, 1);
        });
        test.describe('the domm is also special because it abstracts event listeners for you', function () {
            test.describe('can add handlers', function () {
                test.it('one at a time', function () {
                    divs.on('click', handler);
                    test.expect(count).toEqual(0);
                    divs.click();
                    test.expect(count).toEqual(5);
                }, 2);
                test.it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler);
                    test.expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    divs.dispatchEvent('mouseover');
                    divs.dispatchEvent('mouseout');
                    test.expect(count).toEqual(15);
                }, 2);
            });
        });
        test.describe('the domm is also special because it abstracts event listeners for you', function () {
            test.describe('can add handlers', function () {
                test.it('one at a time', function () {
                    divs.on('click', handler);
                    test.expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    test.expect(count).toEqual(5);
                }, 2);
                test.it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler);
                    test.expect(count).toEqual(0);
                    divs.dispatchEvent('click');
                    divs.dispatchEvent('mouseover');
                    divs.dispatchEvent('mouseout');
                    test.expect(count).toEqual(15);
                }, 2);
            });
            test.describe('also capture handlers', function () {
                test.it('one at a time', function () {
                    divs.on('click', handler, true);
                    test.expect(count).toEqual(0);
                    divs.dispatchEvent('click', {}, true);
                    test.expect(count).toEqual(5);
                }, 2);
                test.it('many at a time', function () {
                    divs.on('click mouseover mouseout', handler, true);
                    test.expect(count).toEqual(0);
                    divs.dispatchEvent('click', {}, true);
                    divs.dispatchEvent('mouseover', {}, true);
                    divs.dispatchEvent('mouseout', {}, true);
                    test.expect(count).toEqual(15);
                }, 2);
            });
            test.it('will only add a method to the queue once. if a duplicate is passed in, it will be ignored (just like the browser implementation)', function () {
                divs.on('click', handler).on('click', handler);
                test.expect(count).toEqual(0);
                divs.dispatchEvent('click');
                test.expect(count).toEqual(5);
                divs.dispatchEvent('click');
                test.expect(count).toEqual(10);
            }, 3);
            test.it('once wrappers can also be used with the once method and they can be added the same way as once', function () {
                divs.once('click', handler);
                test.expect(count).toEqual(0);
                divs.dispatchEvent('click');
                test.expect(count).toEqual(5);
                divs.dispatchEvent('click');
                test.expect(count).toEqual(5);
            }, 3);
            test.it('be careful with the once function because they can be added multiple times to the queue, since they use a proxy function, like the one available at _.once', function () {
                divs.once('click', handler);
                test.expect(count).toEqual(0);
                divs.dispatchEvent('click');
                test.expect(count).toEqual(5);
                divs.dispatchEvent('click');
                test.expect(count).toEqual(5);
            }, 3);
        });
        test.describe('the each function is special because', function () {
            test.it('it wraps each element in a DOMA object before passing it through your iterator', function () {
                divs.forEach(function (el, idx) {
                    test.expect(_.isInstance(el, factories.DOMA)).toEqual(false);
                    test.expect(factories.DomManager.isInstance(el)).toEqual(true);
                    test.expect(el.element()).toBe(divs.item(idx).element());
                });
            }, divsLength * 3);
            test.it('where the forEach and forEach function just gives you the element at each index, just like a collection', function () {
                divs.forEach(function (el, idx) {
                    test.expect(_.isInstance(el, $)).toEqual(false);
                });
                divs.forEach(function (el, idx) {
                    test.expect(_.isInstance(el, $)).toEqual(false);
                });
            }, divsLength * 2);
        });
        test.describe('adding and removing classes is done by string checking instead of the classList to invoke only one reflow', function () {
            test.it('you can use addClass', function () {
                divs.forEach(function (div, idx) {
                    test.expect(div.hasClass('three')).toEqual(false);
                });
                divs.addClass('three');
                divs.forEach(function (div, idx) {
                    test.expect(div.hasClass('three')).toEqual(true);
                });
            }, 10);
            test.it('you can use removeClass', function () {
                divs.forEach(function (div, idx) {
                    test.expect(div.hasClass('three')).toEqual(false);
                });
                test.expect(divs.hasClass('three')).toEqual(false);
                divs.addClass('three');
                test.expect(divs.hasClass('three')).toEqual(true);
            }, 7);
            test.it('you can use hasClass to check if all of the elements has a particular class', function () {
                test.expect(divs.hasClass('two')).toEqual(false);
                test.expect(divs.hasClass('one')).toEqual(true);
            }, 2);
            test.it('you can use toggleClass swap classes depending on whether or not they exist on each element', function () {
                divs.forEach(function (div, idx) {
                    test.expect(div.hasClass('one')).toEqual(true);
                });
                divs.toggleClass('one');
                divs.forEach(function (div, idx) {
                    test.expect(div.hasClass('one')).toEqual(false);
                });
            }, divsLength * 2);
            test.it('it will also do this for individual elements', function () {
                var list = [],
                    unique = [];
                divs.forEach(function (div, idx) {
                    var res = div.hasClass('two');
                    list.push(res);
                    _.add(unique, res);
                });
                divs.toggleClass('two');
                divs.forEach(function (div, idx) {
                    test.expect(div.hasClass('two')).toEqual(!list[idx]);
                }, divsLength + 1);
                test.expect(unique.length > 1).toEqual(true);
            }, divsLength + 1);
            test.it('you can also use changeClass as a shorthand of removeClass and addClass', function () {
                divs.changeClass('one not two', 'three');
                divs.forEach(function (div, idx) {
                    test.expect(div.hasClass('one')).toEqual(false);
                    test.expect(div.hasClass('two')).toEqual(false);
                    test.expect(div.hasClass('not')).toEqual(false);
                    test.expect(div.hasClass('three')).toEqual(true);
                });
            }, divsLength * 4);
        });
        test.describe('there is also a data attributes interface', function () {
            test.it('where you can add', function () {
                divs.forEach(function (div, idx) {
                    test.expect(div.element().getAttribute('data-one')).toEqual(null);
                    test.expect(div.element().getAttribute('data-two')).toEqual(null);
                });
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.forEach(function (div, idx) {
                    test.expect(div.element().getAttribute('data-one')).toEqual('one');
                    test.expect(div.element().getAttribute('data-two')).toEqual('two');
                });
            }, divsLength * 4);
            test.it('remove', function () {
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.forEach(function (div, idx) {
                    test.expect(div.element().getAttribute('data-one')).toEqual('one');
                    test.expect(div.element().getAttribute('data-two')).toEqual('two');
                });
                divs.data({
                    one: false,
                    two: false
                });
                divs.forEach(function (div, idx) {
                    test.expect(div.element().getAttribute('data-one')).toEqual(null);
                    test.expect(div.element().getAttribute('data-two')).toEqual(null);
                });
            }, divsLength * 4);
            test.it('and update data attributes', function () {
                divs.data({
                    one: 'one',
                    two: 'two'
                });
                divs.forEach(function (div) {
                    test.expect(div.element().getAttribute('data-one')).toEqual('one');
                    test.expect(div.element().getAttribute('data-two')).toEqual('two');
                });
            }, divsLength * 2);
        });
        test.describe('it can also manipulate elements in other ways', function () {
            test.it('like by manipulating their attributes', function () {
                divs.forEach(function (div) {
                    test.expect(div.element().getAttribute('tabindex')).toEqual(null);
                    test.expect(div.attr('tabindex')).toEqual(false);
                });
                divs.attr({
                    tabindex: -1
                });
                divs.forEach(function (div, idx) {
                    test.expect(div.attr('tabindex')).toEqual(-1);
                    test.expect(div.element().getAttribute('tabindex')).toEqual('-1');
                });
            }, divsLength * 4);
            test.it('or by manipulating their properties', function () {
                divs.forEach(function (div, idx) {
                    test.expect(div.element().align).toEqual('');
                    test.expect(div.element().align).toEqual('');
                });
                divs.prop({
                    align: 'left'
                });
                divs.forEach(function (div, idx) {
                    test.expect(div.prop('align')).toEqual('left');
                    test.expect(div.element().align).toEqual('left');
                });
            }, divsLength * 4);
            test.it('it can even handle cross attr property setting', function () {
                var $inputs = $(divs.map(function (div, index) {
                    return $.createElement('input');
                }).toArray());
                $inputs.forEach(function ($input) {
                    test.expect($input.prop('value')).toBe('');
                    test.expect($input.attr('value')).toBe(false);
                });
                $inputs.forEach(function ($input) {
                    $input.target.value = 'here';
                });
                $inputs.forEach(function ($input) {
                    test.expect($input.prop('value')).toBe('here');
                    test.expect($input.attr('value')).toBe(false);
                });
                $inputs.forEach(function ($input) {
                    $input.target.value = '';
                });
                $inputs.forEach(function ($input) {
                    test.expect($input.prop('value')).toBe('');
                    test.expect($input.attr('value')).toBe(false);
                });
                $inputs.prop('value', 'here');
                $inputs.forEach(function ($input) {
                    test.expect($input.prop('value')).toBe('here');
                    test.expect($input.attr('value')).toBe(false);
                });
                $inputs.prop('value', false);
                $inputs.forEach(function ($input) {
                    test.expect($input.prop('value')).toBe('');
                    test.expect($input.attr('value')).toBe(false);
                });
            }, divsLength * 2 * 5);
        });
        test.describe('can have specialized elements', function () {
            test.describe('has lifecycle events', function () {
                test.it('like attach', function () {
                    divs.remove();
                    divs.on('attach', handler);
                    test.expect(count).toEqual(0);
                    $con.append(divs);
                    test.expect(count).toEqual(5);
                }, 2);
                test.it('and detach', function () {
                    divs.once('detach', handler);
                    test.expect(count).toEqual(0);
                    divs.remove();
                    test.expect(count).toEqual(5);
                }, 2);
                test.it('and attribute change', function () {
                    divs.once('attributeChange:data-here', handler);
                    test.expect(count).toEqual(0);
                    divs.data('here', 1);
                    test.expect(count).toEqual(5);
                }, 2);
            });
            test.describe('there are also special handlers', function () {
                test.it('like create', function (done) {
                    $.registerElement('test-zero', {
                        create: true,
                        events: {
                            create: function () {
                                handler();
                                test.expect(count).toEqual(1);
                                done();
                            }
                        }
                    });
                    test.expect(count).toEqual(0);
                    $.createElement('test-zero');
                }, 2);
                test.it('and destroy', function () {
                    $.registerElement('test-one', {
                        events: {
                            destroy: handler
                        }
                    });
                    var div = $.createElement('test-one');
                    test.expect(count).toEqual(0);
                    div.destroy();
                    test.expect(count).toEqual(1);
                }, 2);
                test.it('understands how to handle attach and detach', function (done) {
                    $.registerElement('tester-time', {
                        attach: true,
                        detach: true,
                        create: true,
                        events: {
                            create: function () {
                                handler();
                                test.expect(count).toBe(1);
                                var el = this;
                                // setTimeout(function () {
                                $.returnsManager(document.body).append(el);
                                // });
                            },
                            attach: function () {
                                handler();
                                test.expect(count).toBe(2);
                                $.returnsManager(this).remove();
                            },
                            detach: function () {
                                handler();
                                test.expect(count).toBe(3);
                                done();
                            }
                        }
                    });
                    test.expect(count).toBe(0);
                    $.createElement('tester-time');
                    // test.expect(count).toBe(3);
                }, 4);
                test.it('can handle attribute changes', function () {
                    $.registerElement('tester-timer', {
                        attributeChange: true,
                        events: {
                            attributeChange: handler
                        }
                    });
                    var el = $.createElement('tester-timer');
                    test.expect(count).toBe(0);
                    el.data({
                        here: 'there'
                    });
                    test.expect(count).toBe(1);
                }, 2);
            });
        });
        // test.it('tags cannot be created without being registered first', function () {
        //     test.expect($.registeredElements['unregistered-test']).toEqual(undefined);
        //     $.registerElement('unregistered-test');
        //     test.expect(function () {
        //         $.createElement('unregistered-test');
        //     }).not.toThrow();
        // }, 2);
        test.it('tags are automatically queried for and registered', function () {
            // var nodiv = document.createElement('div');
            // div.id = 'datahere';
            // var div = document.createElement('div');
            // div.id = 'datahere';
            var data = $.document.data.get(document.getElementById('nodatahere'))
            test.expect(data).toEqual(void 0);
            // this one has an is property so it will be queried for automatically
            test.expect($.document.data.get(document.getElementById('datahere')).DomManager).not.toEqual(void 0);
        }, 2);
        test.it('can use direct parent selectors', function () {
            test.expect($('.branch').eq(0).$('> .leaves').length()).toEqual(5);
        }, 1);
        test.it('can traverse horizontally for it\'s siblings', function () {
            var $branch = $('.branch');
            var $item2 = $branch.item(2);
            test.expect(factories.DomManager.isInstance($item2)).toBe(true);
            test.expect($item2.prev()).toEqual($branch.item(1));
        }, 2);
        test.it('establishes dom managers immediately after an element\'s html is changed', function () {
            var $tree = $.createElement('div');
            $tree.html('<div><span is></span></div>');
            test.expect($tree.element().querySelectorAll('span')[0].__elid__).not.toEqual(void 0);
        }, 1);
        var template1 = function (data) {
            var listItems = _.map(data && data.points, function (item, index) {
                return [item.tag + '.' + "classname" + (item.number || index), {
                    key: 'listitem' + (item.number || index)
                }, item.text];
            });
            return ['div.tree', {
                    key: 'tree'
                },
                [
                    ['span.spanned', {
                        key: 'name'
                    }, 'name'],
                    ['ul.container', {
                            key: 'container'
                        },
                        listItems
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
            container: 'ul',
            tree: 'div'
        };
        var applyMutations = function (mutate) {
            _.forEach([mutate.swap, mutate.update], function (fn) {
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
                // 1
                test.expect($root.html()).toEqual('');
                // 2,3
                _.forOwn(diff.mutate, function (level, key) {
                    test.expect(_.isFunction(level)).toBe(true);
                });
                applyMutations(diff.mutate);
                // 4
                test.expect($root.html()).not.toEqual('');
            }, 4);
            test.it('collects keys that the template marks using index 3 of each child', function () {
                var diff = $.nodeComparison($root.element(), templatized);
                _.forOwn(diff.keys, function (element, key) {
                    test.expect(element.tagName.toLowerCase()).toEqual(basicTemplateKeyTagNames[key] || 'li');
                });
            }, 5);
            test.it('updates attributes when needed', function () {
                var attributes = {};
                var diff = $.nodeComparison($root.element(), templatized);
                var attrs = $root.attributes();
                applyMutations(diff.mutate);
                var attrs2 = $root.attributes();
                test.expect(attrs).not.toEqual(attrs2);
            }, 1);
            test.it('removes nodes when needed', function () {
                var diff = $.nodeComparison($root.element(), templatized);
                applyMutations(diff.mutate);
                templatized = makeBasicTemplate([{
                    tag: 'li',
                    text: 'sometext'
                }]);
                var $lis = $root.$('ul.container').children();
                var $first = $lis.first();
                var diff2 = $.nodeComparison($root.element(), templatized, diff.keys);
                applyMutations(diff2.mutate);
                var $newChildren = $root.$('ul.container').children();
                test.expect($first.element()).toBe($newChildren.first().element());
                test.expect($newChildren.length()).toEqual(1);
            }, 2);
            test.it('removes nodes even when they\'re at the front', function () {
                var diff = $.nodeComparison($root.element(), templatized);
                applyMutations(diff.mutate);
                templatized = makeBasicTemplate([{
                    tag: 'li',
                    text: 'someothertext2',
                    number: '1'
                }]);
                var $lis = $root.$('ul.container').children();
                var $first = $lis.first();
                var diff2 = $.nodeComparison($root.element(), templatized, diff.keys);
                applyMutations(diff2.mutate);
                var $newChildren = $root.$('ul.container').children();
                test.expect($first.element()).not.toBe(void 0);
                test.expect($first.element()).toBe($newChildren.first().element());
                test.expect($newChildren.length()).toEqual(1);
            }, 3);
            test.it('and inserts them at the front when needed', function () {
                templatized = makeBasicTemplate([{
                    tag: 'li',
                    text: 'someothertext2',
                    number: '1'
                }]);
                var diff = $.nodeComparison($root.element(), templatized);
                applyMutations(diff.mutate);
                var $lis = $root.$('ul.container').children();
                var $first = $lis.first();
                templatized = makeBasicTemplate();
                var diff2 = $.nodeComparison($root.element(), templatized, diff.keys);
                applyMutations(diff2.mutate);
                var $newChildren = $root.$('ul.container').children();
                test.expect($first.element()).toBe($newChildren.first().element());
                test.expect($newChildren.length()).toEqual(2);
            }, 2);
            // test.it('can rearrange elements as needed', function () {
            //     templatized = makeBasicTemplate([{
            //         tag: 'li',
            //         text: 'another',
            //         number: '2'
            //     }, {
            //         tag: 'li',
            //         text: 'someothertext2',
            //         number: '1'
            //     }, {
            //         tag: 'li',
            //         text: 'anotherone',
            //         number: '3'
            //     }, {
            //         tag: 'li',
            //         text: 'first',
            //         number: '0'
            //     }]);
            //     var diff = $.nodeComparison($root.element(), templatized);
            //     applyMutations(diff.mutate);
            //     var $lis = $root.$('ul.container').children();
            //     var list = $lis.elements().toArray().slice(0);
            //     templatized = makeBasicTemplate([{
            //         tag: 'li',
            //         text: 'first',
            //         number: '0'
            //     }, {
            //         tag: 'li',
            //         text: 'someothertextfirstindex',
            //         number: '1'
            //     }, {
            //         tag: 'li',
            //         text: 'anothersecondindex',
            //         number: '2'
            //     }, {
            //         tag: 'li',
            //         text: 'anotheronethird',
            //         number: '3'
            //     }]);
            //     var diff2 = $.nodeComparison($root.element(), templatized, diff.keys);
            //     applyMutations(diff2.mutate);
            //     var $newChildren = $root.$('ul.container').children();
            //     // should be strictly equal to since
            //     test.expect(list[3]).toBe($newChildren.element(0));
            //     test.expect(list[1]).toBe($newChildren.element(1));
            //     test.expect(list[0]).toBe($newChildren.element(2));
            //     test.expect(list[2]).toBe($newChildren.element(3));
            //     test.expect($newChildren.length()).toEqual(4);
            // }, 5);
        });
        test.describe('can create elements directly from css selectors', function () {
            test.it('such as tag selectors', function () {
                var div = $.createElement('div');
                test.expect(div.tagName).toBe('div');
                var li = $.createElement('li');
                test.expect(li.tagName).toBe('li');
                var ul = $.createElement('ul');
                test.expect(ul.tagName).toBe('ul');
            }, 3);
            test.it('tag with ids', function () {
                var div = $.createElement('div#one');
                test.expect(div.tagName).toBe('div');
                test.expect(div.attr('id')).toBe('one');
                console.log(div);
            }, 2);
        });
    });
});