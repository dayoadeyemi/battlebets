// View.js
// -------
define(["jquery", "backbone", "text!templates/eventssection.html"],

    function($, Backbone, template){
        console.log("Init Events View");
        var EventsView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: ".eventSection",
            collection : null,

            // View constructor
            initialize: function(options) {
                this.collection = options;
                // Calls the view's render method
                this.render();

            },

            // View Event Handlers
            events: {

            },

            // Renders the view's template to the UI
            render: function() {
                // Setting the view's template property using the Underscore template method

                console.log(this.collection.models);
                this.template = _.template(template, {models : this.collection.models});

                // Dynamically updates the UI with the view's template
                this.$el.append(this.template);

                // Maintains chainability
                return this;

            }

        });

        // Returns the View class
        return EventsView;

    }

);