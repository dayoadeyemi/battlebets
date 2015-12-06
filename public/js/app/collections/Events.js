// Collection.js
// -------------
define(["jquery","backbone","models/Event", "text!json/events.json"],

  function($, Backbone, Model, JSON) {
      console.log("Starting Events collection");

      // Creates a new Backbone Collection class object
    var Events = Backbone.Collection.extend({


        url: "https://cece9dca.ngrok.io/events",

      // Tells the Backbone Collection that all of it's models will be of type Model (listed up top as a dependency)
      model: Model

    });

    // Returns the Model class
    return Events;

  }

);