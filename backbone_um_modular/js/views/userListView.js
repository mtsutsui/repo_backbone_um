
// mas 11/24 Filename: js/views/userListView
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above,
  'models/userModel',
  'models/userCollection',
  'text!templates/UserListTemplate.html'
], function($, _, Backbone, User, Users, userListTemplate){


    var UserListView = Backbone.View.extend({
      el: '.page',

	  events:{'click .search':  'searchUser' },
	  
	  searchUser: function(){
		//var searchVal = $('#search').val();
		console.log("hit search function, search input = " + $('#search').val());
		var dataObj = {username : $('#search').val()}; /* change made here */
		//mas 11/19 code is simlar to render fun below. TODO refactor to combine them into one
		var that = this;
        	var users = new Users();  //maybe i can use  this.users  which was creaed during initial render
		users.fetch({
			data: dataObj, /* mas 11/19 */
			success: function (users) {
				that.users = users;  //attach users to the view so i can use it in my renderWithoutFetch function
				//var template = _.template($('#user-list-template').html(), {users: users.models});  
				var searchObj = {searchtoken: $('#search').val()};  //pass this to template to keep search input displayed 
				//var template = _.template($('#user-list-template').html(), {users:users.models, search: searchObj});  
				var template = _.template(userListTemplate, {users:users.models, search: searchObj});  //mas 11/24
				that.$el.html(template); //insert the resolved template into .page DOM element
			}
        	})
	},
	  
      render: function () {
        console.log("hit UserListView.render,   this = " + this);
        var that = this;
        var users = new Users();
        users.fetch({
			success: function (users) {
				that.users = users;  //attach users to the view so i can use it in renderWithoutFetch function
				//var template = _.template($('#user-list-template').html(), {users: users.models});
				//var template = _.template($('#user-list-template').html(), {users:users.models, search:{}});  
                                var template = _.template(userListTemplate, {users:users.models, search:{}});  //mas 11/24
				that.$el.html(template); //insert the resolved template into .page DOM element
			}
        })
      },

      renderWithoutFetch: function () {
        console.log("UserListview.renderWithoutFetch");
        var template = _.template($('#user-list-template').html(), {users:this.users.models, search:{}});  //pass users that i already have
        this.$el.html(template);
      }
	  
    });

    return UserListView;  //mas 11/24

    //var userListView = new UserListView();  //mas 11/24

});