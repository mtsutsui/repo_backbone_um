// Author: Thomas Davis <thomasalwyndavis@gmail.com>
// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    jquery: 'lib/jquery-min',
    underscore: 'lib/underscore-min',
    backbone: 'lib/backbone-min',
    templates: '../templates'
  }

});

/*
require([
  // Load our app module and pass it to our definition function
  'app',
], function(App){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize();
});
*/

//mas 11/25
require([ 'jquery', 'backbone', 'router' ], function($, Backbone, Router){
   var router = new Router();

   //mas 11/25
   Backbone.View.prototype.goTo = function (loc) {
      router.navigate(loc, true);
   };

   Backbone.history.start();
});

