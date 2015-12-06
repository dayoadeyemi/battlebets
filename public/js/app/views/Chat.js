// View.js
// -------
define(["jquery", "backbone", "models/Model", "text!templates/chat.html"],

    function($, Backbone, Model, template){
        console.log("Init View")
        var Chat = Backbone.View.extend({

            // The DOM Element associated with this view
            el: ".eventChat",


            // View constructor
            initialize: function() {
                _this = this
                $(window).on('resize', function(){ _this.render() });
                // Calls the view's render method
                this.render();

            },

            // View Event Handlers
            events: {

            },

            // Renders the view's template to the UI
            render: function() {

                var chatHeight = $(window).height() - 67
                // Setting the view's template property using the Underscore template method
                this.template = _.template(template, {'chatHeight': chatHeight});

                // Dynamically updates the UI with the view's template
                this.$el.html(this.template);

                // Maintains chainability
                this.$el.css('height', chatHeight)
                return this;

            }

        });

        // Returns the View class
        return Chat;

    }

);