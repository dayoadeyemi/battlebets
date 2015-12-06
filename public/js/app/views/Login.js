// View.js
// -------
define(["jquery", "backbone", "text!templates/login.html", "text!templates/loggedin.html", "models/Authenticate"],

    function ($, Backbone, Login, LoggedIn, Authenticate) {
        console.log("Init Login")
        var Login = Backbone.View.extend({

            // The DOM Element associated with this view
            el: ".eventLogin",
            authenticated: false,
            model : new Authenticate(),

            // View constructor
            initialize: function () {
                // Calls the view's render method
                this.render();
            },

            events: {
                'click .submitButton': 'onLoginAttempt'
            },

            // Renders the view's template to the UI

            onLoginAttempt: function (evt) {
                console.log("Loggin you in Shephard");
                evt.preventDefault();

                var requestURL = "https://cece9dca.ngrok.io/login/" + this.$("#username").val() + "/" + this.$("#password").val();

                    this.model.fetch({
                        url : requestURL,
                        success: function(){
                            $(".eventLogin").html("<h2>Logged In </h2>");
                        }
                    });
            },


            render: function () {

                if (this.authenticated) {
                    console.log("Logged in");
                    // Setting the view's template property using the Underscore template method
                    this.template = _.template(LoggedIn, {});

                }
                else {
                    console.log("Not logged in");
                    //this.template = _.template(Login);
                }

                // Dynamically updates the UI with the view's template
                this.$el.html(this.template);

                // Maintains chainability
                return this;

            }

        });

        // Returns the View class
        return Login;

    }
);