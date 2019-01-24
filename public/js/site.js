(function($) {

    Drupal.behaviors.site = {
        attach: function(context, settings) {

            ////////////////////////////////////////
            // Global variables
            ////////////////////////////////////////

            var $window = $(window),
                $html = $('html'),
                $bp3 = 1085;


            ////////////////////////////////////////
            // Breakpoint classes
            ////////////////////////////////////////

            function viewportWidth() {

                if ($window.width() < $bp3) {
                    $html.addClass('js-mobile');
                    $html.removeClass('js-non-mobile');
                } else {
                    $html.addClass('js-non-mobile');
                    $html.removeClass('js-mobile');
                }
            }

            // Execute on load and resize
            $(window).on('load', viewportWidth);
            $(window).on('resize', viewportWidth);

            // Run masonryGrid() on page load.
            setTimeout(function() {
                Drupal.masonryGrid();
            }, 100);


            ////////////////////////////////////////
            // Add class to front
            ////////////////////////////////////////

            $(document).ready(function() {
                if ($('body').hasClass('front')) {
                    setTimeout(function() {
                        $('body').addClass('js-front');
                    }, 1500);
                }
            });


            ////////////////////////////////////////
            // Header tab hover class
            ////////////////////////////////////////
            $('.header-tab').hover(function() {
                $(this).toggleClass('js-hover');
            })


            ////////////////////////////////////////
            // Header close button
            ////////////////////////////////////////
            $('.header__close').click(function() {
                if ($('html').hasClass('js-non-mobile')) {
                    $('body').removeClass('js-menu-open');
                    Drupal.masonryGrid();
                }
            });

            $('.header-tab__menu').click(function() {
                if ($('html').hasClass('js-non-mobile')) {
                    $('body').addClass('js-menu-open');
                    Drupal.masonryGrid();
                }
            });


            ////////////////////////////////////////
            // Header tab menu
            ////////////////////////////////////////
            $('.header-tab__menu').click(function() {
                if ($('html').hasClass('js-mobile')) {
                    $('body').toggleClass('js-menu-open');
                }
            });


            ////////////////////////////////////////
            // Trigger fitvids -- currently not working
            ////////////////////////////////////////
            // $('.typeset iframe[src*="youtube"]').parent().fitVids();


            ////////////////////////////////////////
            // Fixed contact bar trigger
            ////////////////////////////////////////
            function checkOffset() {
                if ($('.contact-bar').offset().top + $('.contact-bar').height() >= $('.footer').offset().top - 10)
                    $('.contact-bar').addClass('js-static');
                if ($(document).scrollTop() + window.innerHeight < $('.footer').offset().top)
                    $('.contact-bar').removeClass('js-static');
            }

            // Trigger on scroll
            $(document).scroll(function() {
                checkOffset();
            });
        }
    };

    // Masonry functions, moved to the global namespace for access by other
    // scripts.
    Drupal.masonryGrid = function() {
        $('.grid').masonry({
            columnWidth: '.grid-sizer',
            gutter: '.gutter-sizer',
            itemSelector: '.grid-item',
            percentPosition: true
        });
    };

    // Reload the grid on changes. With an optional timeout.
    Drupal.masonryReload = function(timeout) {
        if (timeout > 0) {
            setTimeout(function() {}, timeout);
        }
        $('.grid').masonry('reloadItems');
        $('.grid').masonry('layout');
    };

})(jQuery, Drupal);