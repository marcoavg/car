/**
 * @file
 * A JavaScript file for the site.
 *
 * Our JavaScript must be wrapped in a closure.
 * @see https://drupal.org/node/1446420
 * @see http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
 *
 * @copyright Copyright 2017 Palantir.net
 */

(function($) {

    Drupal.behaviors.gridFilters = {
        attach: function(context, settings) {

            $(".filters__menu li:first-child").addClass('js-active');

            ////////////////////////////////////////
            // Grid filters
            ////////////////////////////////////////
            $(".filters__button").click(function(e) {

                // Variables
                var $button = $(this);
                var $menu = $button.siblings(".filters__menu");

                // Remove class from other active dropdowns
                $(".filters__button").not(this).siblings(".filters__menu").removeClass('js-open');

                // Toggle class on active dropdown
                $menu.toggleClass("js-open");
                $menu.children("li").click(function(e) {
                    $(this).siblings("li").removeClass("js-active");
                    $(this).addClass("js-active");
                    $menu.removeClass("js-open");
                    $button.html($(this).children("a").html());
                    e.preventDefault();
                });
                e.stopPropagation();
            });

            // Hide dropdown when user clicks outside of dropdown list
            $(document).click(function() {
                $(".filters__menu").removeClass("js-open");
            });

        }
    };

})(jQuery, Drupal);