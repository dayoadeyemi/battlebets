// DesktopRouter.js
// ----------------
define(["jquery", "backbone", "models/Model", "views/View", "views/Betting", "views/EventsView", "collections/Events"],

    function($, Backbone, Model, View, Betting, EventsView, Collection) {

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
                this.events.fetch().then( function(resp) {// fetch client collection from db
                    // renders twitch iframe
                    new View({collection: resp.data});
                    new EventsView({collection: resp.data});
                    new Betting({collection: resp.data });
                });

            }

        });

        // Returns the DesktopRouter class
        return DesktopRouter;

    }

);