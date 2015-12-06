// Betting.js
// -------
define(["jquery", "jqueryui", "backbone", "models/Model", "text!templates/bettingsection.html"],

    function($, jqueryui, Backbone, Model, template){

        console.log("Init Betting View");

        var Betting = Backbone.View.extend({

            // The DOM Element associated with this Betting
            el: ".bettingSection",


            // Betting constructor
            initialize: function() {

                // Calls the Betting's render method
                this.render();

            },

            // Betting Event Handlers
            events: {

            },


            sliderInit : function() {
                console.log("Init slider");
                $( "#slider" ).slider({
                    value:10,
                    min: 0,
                    max: 250,
                    step: 1,
                    slide: function( event, ui ) {
                        $( "#amount" ).val( "$" + ui.value );
                    }
                });
                $( "#amount" ).val( "$" + $( "#slider" ).slider( "value" ) );
            },

            // Renders the Betting's template to the UI
            render: function() {
                // Setting the Betting's template property using the Underscore template method
                this.template = _.template(template, {});

                // Dynamically updates the UI with the Betting's template
                this.$el.html(this.template);
                this.sliderInit();
                // Maintains chainability
                return this;

            }

        });

        // Returns the Betting class
        return Betting;

    }

);