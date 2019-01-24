(function($) {
    Drupal.behaviors.collections = {
        attach: function(context, settings) {

            // Prepare our data.
            var $filter_one = [];
            var $filter_two = [];
            var $content = [];
            var $oneSelected = '';
            var $twoSelected = '';
            var $list = [];
            var $inserts = [];

            // Note: there are global vars from the template file.
            //  $nodeId is the node id of the current page.
            //  $includeAll is a boolean to add all content in addition to featured.
            //  $includeFilters is a boolean to load the filters.
            //  $includeInserts is a boolean to show text inserts.
            //  $contentTypes is a list of types to load.
            //  $categoryOne is the first filter vocabulary.
            //  $categoryTwo is the second filter vocabulary.
            //  $nodeOptions is filter by type option.

            // Get the first list for the select menu.
            function getFilterOne() {
                if ($includeFilters === true) {
                    if ($categoryOne !== 'Content') {
                        $.getJSON("/rest/taxonomy/" + $categoryOne + "/terms.json?_format=json", function(data, status) {
                            $.each(data, function(key, val) {
                                $filter_one.push(val);
                            });
                        });
                    } else {
                        // The JSON is munged by Twig. Fix it here.
                        $filter_one = JSON.parse($nodeOptions.replace(/&quot;/g, '"'));
                    }
                }
                return $filter_one;
            }

            // Get the industry list for the select menu.
            function getFilterTwo() {
                if ($includeFilters === true) {
                    $.getJSON("/rest/taxonomy/" + $categoryTwo + "/terms.json?_format=json", function(data, status) {
                        $.each(data, function(key, val) {
                            $filter_two.push(val);
                        });
                    });
                }
                return $filter_two;
            }

            // Get the content to display. This is a two-step process to avoid
            // AJAX async issues. First we get the 'featured' content. Then we load
            // the rest, using the list array to avoid duplicate content.
            function getContent() {
                if ($nodeId !== undefined && $nodeId > 0) {
                    $.getJSON("/rest/content/" + $nodeId + "/top.json?_format=json", function(data, status) {
                        $.each(data, function(key, val) {
                            if ($.inArray(val.nid, $list) < 0) {
                                $content.push(val);
                                $list.push(val.nid);
                            }
                        });
                    });
                }
                // Now load the extra content.
                if ($includeAll === true) {
                    $content = getExtraContent($content, $list);
                }
                return $content;
            }

            // Load non-featured (e.g. all) content.
            function getExtraContent($content, $list) {
                // Ensure that we don't print duplicate items.
                $.getJSON("/rest/content/" + $contentTypes + "/all-content.json?_format=json", function(data, status) {
                    $.each(data, function(key, val) {
                        if ($.inArray(val.nid, $list) < 0) {
                            $content.push(val);
                            $list.push(val.nid);
                        }
                    });
                });
                return $content;
            }

            // Get any inserts to display.
            function getInserts() {
                if ($includeInserts === true) {
                    $.getJSON("/rest/content/" + $nodeId + "/paragraphs.json?_format=json", function(data, status) {
                        $.each(data, function(key, val) {
                            $inserts.push(val);
                        });
                    });
                }
                return $inserts;
            }

            // Adds inserts to the content.
            function addInserts(content, inserts, oneSelected) {
                // Check for selection restriction. Only applies to quotes on the
                // work page. See https://palantir.atlassian.net/browse/PNET-163.
                if ($categoryOne == 'Industries' && oneSelected !== 'All Industries') {
                    // Filter by selected industry.
                    inserts = inserts.filter(function(item) {
                        return item.industries.match(oneSelected);
                    })
                }
                var count = content.length;
                var num = inserts.length;
                if (num > 0) {
                    if (count < 5) {
                        content.push(inserts[0]);
                    } else {
                        $.each(inserts, function(key, val) {
                            var pos = key * 9;
                            if (key === 0) {
                                pos = 4;
                            }
                            content.splice(pos, 0, val);
                        });
                    }
                }
                return content;
            }

            // Set our Vue.js app.
            var app = new Vue({
                el: '#app',
                data: {
                    filter_one: getFilterOne(),
                    filter_two: getFilterTwo(),
                    content: getContent(),
                    inserts: getInserts(),
                    oneSelected: 'All ' + $categoryOne, // dynamic var
                    twoSelected: 'All ' + $categoryTwo, // dynamic var
                    categoryOneName: 'All ' + $categoryOne, // static var
                    categoryTwoName: 'All ' + $categoryTwo, // static var
                    display: 16,
                    offset: 16,
                    trigger: 200,
                    end: false,
                },
                props: [$nodeId],
                methods: {
                    // Get the content to display based on user choices.
                    selectedContent: function(content, display, oneSelected, twoSelected) {
                        // Filter by selected first item.
                        var newVar = content.filter(function(item) {
                                if (oneSelected !== 'All ' + $categoryOne) {
                                    if ($categoryOne !== 'Content') {
                                        return item.terms.match(oneSelected);
                                    } else {
                                        var typeMatch = getContentTypeMatch(oneSelected);
                                        return item.content_type.match(typeMatch);
                                    }
                                }
                                return item;
                            })
                            // Filter by selected industry.
                        newVar = newVar.filter(function(item) {
                                if (twoSelected !== 'All ' + $categoryTwo) {
                                    return item.terms.match(twoSelected);
                                }
                                return item;
                            })
                            // Return the subset based on scroll position.
                        var newContent = newVar.slice(0, display);

                        // Add any inserts.
                        var withInserts = addInserts(newContent, $inserts, oneSelected);

                        // Set a limit to how much content to display.
                        return withInserts.slice(0, $displayLimit);
                    },
                    // Get proper background image for each cell.
                    background: function(index, image) {
                        if (image === undefined || image.length === 0) {
                            if (index % 2 == 1) {
                                return '/images/core/pattern--dark.svg';
                            } else {
                                return '/images/core/pattern--light.svg';
                            }
                        }
                        // Using Drupal image styles may introduce special characters.
                        image = this.$options.filters.decode(image);
                        return image;
                    },
                    // Get proper class for each cell.
                    getClass: function(index, type, image) {
                        var $class = '';
                        if (index == 2 || index == 5 || (index > 12 && index % 5 == 1)) {
                            $class = $class + ' grid-item--lg';
                        }
                        if (type == 'Case Study') {
                            $class = $class + ' grid-item--cs grid-item--dark';
                        } else if (type == 'Collection') {
                            $class = $class + ' grid-item--collection';
                            if (index % 2 == 1) {
                                $class = $class + ' grid-item--dark';
                            }
                        } else {
                            $class = $class + ' grid-item--default';
                        }
                        if (image === undefined || image.length === 0) {
                            if (index % 2 == 1) {
                                return $class + ' grid-item--dark';
                            }
                            return $class;
                        }
                        return $class + ' grid-item--dark';
                    },
                    // Get link overlay text.
                    getLinkText(type) {
                        var $text = 'View ' + type;
                        if (type == 'Collection') {
                            $text = 'Learn More';
                        }
                        if (type == 'Podcast') {
                            $text = 'Listen to Podcast';
                        }
                        if (type == 'Blog Post') {
                            $text = 'Read Blog Post';
                        }
                        return $text;
                    },
                    // Get author display. @TODO replace with string literal.
                    getAuthors(drupalUsers, userImages, displayString) {
                        if (displayString.length > 0) {
                            return 'By ' + displayString;
                        }
                        return '';
                    },
                    // Handle scrolling events to show more content.
                    handleScroll: function() {
                        if (window.innerHeight + window.scrollY >= (document.body.offsetHeight - this.trigger)) {
                            if (this.display < this.content.length) {
                                this.display = this.display + this.offset;
                            } else {
                                this.end = true;
                            }
                        }
                    },
                    // Set categoryOne.
                    setCatOne: function(event) {
                        this.oneSelected = event.target.innerText;
                    },
                    // Set categoryTwo.
                    setCatTwo: function(event) {
                        this.twoSelected = event.target.innerText;
                    }
                },
                // Handle changes to our selections by resetting the item count.
                watch: {
                    oneSelected: function(val, oldVal) {
                        this.display = this.offset;
                    },
                    twoSelected: function(val, oldVal) {
                        this.display = this.offset;
                    },
                },
                // On create, add our scroll listener.
                created: function() {
                    window.addEventListener('scroll', this.handleScroll);
                },
                // On destroy, kill or scroll listener.
                destroyed: function() {
                    window.removeEventListener('scroll', this.handleScroll);
                },
                // On update, fire a masonry reload.
                updated: function() {
                    // @TODO: some animation of changes might be nice.
                    var timeout = 0;
                    if (this.display > this.offset) {
                        timeout = 15000;
                    }
                    Drupal.masonryReload(timeout);
                }
            })

            // Add a text filter to decode HTML entities in titles.
            Vue.filter('decode', function(str) {
                if (str === undefined) {
                    return '';
                }
                var entities = [
                    ['amp', '&'],
                    ['apos', '\''],
                    ['#x27', '\''],
                    ['#x2F', '/'],
                    ['#39', '\''],
                    ['#47', '/'],
                    ['lt', '<'],
                    ['gt', '>'],
                    ['nbsp', ' '],
                    ['quot', '"']
                ];
                for (var i = 0, max = entities.length; i < max; ++i) {
                    str = str.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);
                }
                return str.replace(/&#(\d+);/g, function(match, dec) {
                    return String.fromCharCode(dec);
                });
            })

            function getContentTypeMatch(label) {
                var types = {
                    'Appearances': 'appearance',
                    'Blog Posts': 'blog',
                    'Case Studies': 'case_study',
                    'Containers': 'dynamic_list',
                    'Events': 'event',
                    'Forms': 'hubspot_form',
                    'Landing Pages': 'landing',
                    'landing_page': 'Landing Pages',
                    'Pages': 'page',
                    'Podcasts': 'podcast',
                    'Collections': 'collection',
                };
                return types[label];
            }

        }
    };
})(jQuery, Drupal);