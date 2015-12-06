// Model.js
// --------
define(["jquery", "backbone"],

    function($, Backbone) {

        // Creates a new Backbone Model class object
        var Event = Backbone.Model.extend({


            url : "https://cece9dca.ngrok.io/events",

            // Model Constructor
            initialize: function() {

            },



            // Default values for all of the Model attributes
            defaults: {

            },

            // Gets called automatically by Backbone when the set and/or save methods are called (Add your own logic)
            validate: function(attrs) {

            }

        });

        // Returns the Model class
        return Event;

    }

);
