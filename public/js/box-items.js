(function($) {

    Drupal.behaviors.boxItems = {
        attach: function(context, settings) {

            ////////////////////////////////////////
            // Box item equal height
            ////////////////////////////////////////

            $('.box-item').matchHeight();

        }
    };

})(jQuery, Drupal);