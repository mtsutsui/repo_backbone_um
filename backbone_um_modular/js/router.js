//11/24 begin
// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/userListView',
  'views/userEditView'
], function($, _, Backbone, UserListView, UserEditView) {
//11/24 end


    //router definition ---------------------------------------------------------------------------------------------------
    
    //var Router = Backbone.Router.extend({  //mas 11/25
    return  Backbone.Router.extend({  //mas 11/25
        routes: {
          "": "home",           //   drives home page index.html 
          "edit/:id": "edit",   //  /#edit/1234 is url suffix, "edit" is a route name, can be referenced as 'route:edit'
          "new": "edit",        //  /#new is url suffix, "edit" is a route name, can be referenced as 'route:edit'
	  ":route/:action": "process2params",  //mas test  Load Route/Action View
        },
    //});  //mas 11/25


  
  //var initialize = function(){  //11/24

    //var router = new Router;  //11/24

    //router.on('route:home', function() {  //"route" is predefined by Backbone //mas 11/25
    home: function () {  //mas 11/25
      console.log("hit router home");
      var userListView = new UserListView();  //<==================== 11/24
      userListView.render();     //render user list view
    //});
    },

    //router.on('route:edit', function(id) {
    edit: function(id) { //11/25
      console.log("hit router edit with id = " + id);
      var userEditView = new UserEditView();  //<==================== 11/24
      userEditView.render({id: id});  //render edit detail view
    //});
    },

    //mas test capture 2 params
    //router.on('route:process2params', function(route, action) {
    process2params: function(route, action) {
	console.log("hit route:process2params ... got parms: " + ":route = " + route + ", :action = " + action); 
	alert("2 params are: " + route + ", " + action); 
    //});
    }

    //Backbone.history.start();  //11/25

  //}; //11/24 end initialize

  //11/24
  //return { initialize: initialize };

  }); //end return

}); //11/24 end define