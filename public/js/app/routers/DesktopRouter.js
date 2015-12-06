// DesktopRouter.js
// ----------------
define(["jquery", "backbone", "models/Model", "views/View", "views/Betting", "views/EventsView", "collections/Events", "views/Chat"],

    function($, Backbone, Model, View, Betting, EventsView, Collection, Chat) {

        var DesktopRouter = Backbone.Router.extend({

            initialize: function() {

                // Tells Backbone to start watching for hashchange events
                Backbone.history.start();

            },

            events : new Collection(),

            // All of your Backbone Routes (add more)
            routes: {

                // When there is no hash on the url, the home method is called
                "": "index"

            },

            index: function() {

                new View({});

                new Chat();
                this.events.fetch({reset: true});
                this.events.bind('reset', function(events){
                    new EventsView({collection: events});
                    new Betting({collection: events });
                });
            }

        });

        // Returns the DesktopRouter class
        return DesktopRouter;

    }

);