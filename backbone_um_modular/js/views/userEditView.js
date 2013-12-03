
// mas 11/24 Filename: js/views/userListView
define([
  'jquery',
  'underscore',
  'backbone',
  'models/userModel',
  'views/userListView',  //mas 11/24 added this to avoid router.navigate
  'text!templates/UserDetailTemplate.html'
], function($, _, Backbone, User, UserListView, userDetailTemplate){


    var UserEditView = Backbone.View.extend({
      el: '.page',
	  
      events: {
        //'submit .edit-user-form': 'saveUser',   //mas not using Thomas form tag in edit user template
        'click .save': 'saveUser2',  //mas
        'click .delete': 'deleteUser',  //mas somehow this also drives saveUser  why ???  related to use of form tag ??
	'click .cancel': 'cancelUser',  //mas somehow this also drives saveUser  why ???  related to use of form tag ??
        'click .reset':  'resetUser'   
      },
	  
      //mas did it in Christoph way
      saveUser2: function (ev) {
      	console.log("UserEditView saveUser2");
        //create a new model and set properties based on user inputs
	this.model = new User();
	this.model.set({
		firstname: $('#firstname').val(),
		lastname: $('#lastname').val(),
		age: $('#age').val(),
		id: $('#id').val()
        });
	//ref: http://stackoverflow.com/questions/11322182/backbone-model-save-not-calling-either-error-or-success-callbacks
	//pass null obj since model is fully populated when creating or updating
	this.model.save(null, 
		{ 
		success: function (user) { // need to pass null obj, otherwise the callback will NOT be called.
	    		console.log("...user save success callback,  drive route home")

			//mas 11/24 instead of using router, render list view
            		//router.navigate('', {trigger:true});  // '' is home,  this will no longer work with Require.js wrapping
                        
			//mas this works, but browser url will not be updated to reflect the list page
			//var userListView = new UserListView();
			//userListView.render();   
                        console.log("...Backbone.View.prototype.goTo ...")   
			Backbone.View.prototype.goTo('');  //mas 11/25 best
            		}
         	});
	return false;

      },
	  
      /* 
      saveUser: function (ev) {
        var userDetails = $(ev.currentTarget).serializeObject();  //mas util to convert the form detail into js object
	console.log("hit saveUser $(ev.currentTarget).text() = " +  $(ev.currentTarget).text());
        console.log("userDetails = " + userDetails.toSource());  // .toSource is a native js function, does NOT produce JSON string 
        var user = new User();   //create a user instance and populate based on form ev.currentTarget
        //mas Backbone is smart enough whether to issue POST or PUT by checking whether or not the model has id/value in it. 
        user.save(userDetails, {
          success: function (user) {
            router.navigate('', {trigger:true});
          }
        });
        return false;
      },
      */  
	  
      deleteUser: function (ev) {
        //Q: mas how do i have a handle on this.user ??? 
        //A: view's render method did  that.user = new User({id: options.id});  which attached user obj to the view
        console.log("hit deleteUser,  this.user.get('firstname') = " + this.user.get('firstname') );
        this.user.destroy({       //??? mas how do i have a handle on this.user ???
          success: function () {
            console.log('destroyed');
            //mas 11/24 instead of using router, render list view
            //router.navigate('', {trigger:true});

	    //var userListView = new UserListView();
	    //userListView.render();
	    Backbone.View.prototype.goTo('');  //mas 11/25 best
          }
        });
       
      },
	  
      //mas extra work 1 handle cancel button, go back to list
      cancelUser: function (ev) {
	console.log("hit cancelUser $(ev.currentTarget).text() = " +  $(ev.currentTarget).text());
        //router.navigate('', {trigger:true});  //mas 11/25this no longer work with Require.js wrapping
        //instead of navigate back to home, which will cause refetch of the list, just re-render the list with what i already have saved
	//mas 11/21 that would not update address url properly, so i decided to force navigate to list page
        //userListView.renderWithoutFetch();  //mas 11/21
        Backbone.View.prototype.goTo('');  //mas 11/25 best
      },

      //mas extra work 2  handle reset button click, restore old data that i have already, w/o doing refetch (http get)
      resetUser: function (ev) {
        console.log("hit resetUser $(ev.currentTarget).text() = " +  $(ev.currentTarget).text());
        console.log("this.user.id = " + this.user.id);
        //router.navigate('edit/' + this.user.id, {trigger:true});  //mas why this not driving router?? doc says cant re-route to same route
        //userEditView.render({id: this.user.id});        //directly call re-render
        userEditView.renderWOFetch({id: this.user.id});   //directly call re-render without doing GET re-fetch
      },
	
      //mas 9/29/13 render the page with the old data i have already saved (w/o issuing newly fetch/GET)
      renderWOFetch: function (options) {
         //this.user should already be there - original render took care of creating n attaching the user model to the view 
		console.log("UserEditView renderNoFetch with user firstname = " + this.user.get('firstname'));  //this.user should already be there
        var template = _.template($('#edit-user-template2').html(), {user: this.user});  //this.user should already from the 1st render
        this.$el.html(template);
      },

      render: function (options) {
	console.log("UserEditView render, this = " + this);
        var that = this;  //saving this as that so success callback can refer to the view  
        if(options.id) {

	  //HTTP GET to get model (to get the latest data?) even though the userlist in UserListView already contains it
          this.user = new User({id: options.id});    // create a User instance with id and attach it to the view
          console.log("user.fetch() with options.id = " + options.id);
          this.user.fetch({  //mas this will lead to GET .../users/whatever options.id is
            success: function (user) {  //mas crucial to do rendering the view in this success callback (only after i got data back)
		console.log("successful user.fetch() callback, user = " + user + ",  user.get('firstname') = " + user.get('firstname'));
		//var template = _.template($('#edit-user-template2').html(), {user: user});  //mas 11/24
		var template = _.template(userDetailTemplate, {user: user});   //mas 1124

		that.$el.html(template);  //i need to use 'that'(saved 'this' earlier)!!! because 'this' does not point to the view any more
		//that.el.innerHTML = template;  //mas does this work instead ?  yes
            }
          });
	
         /*
         //mas 10/25 instead of doing a HTTP GET for a user, go to userlist already contained in UserListView
         this.user = userListView.users.get(options.id);
         //var template = _.template($('#edit-user-template2').html(), {user: this.user});  //mas 11/24
	 var template = _.template(userDetailTemplate, {user: this.user});  //mas 11/24
         this.$el.html(template);  //repaint .page div
	 //mas 10/25 end
         */

        } else {
          //var template = _.template($('#edit-user-template').html(), {user: null});
          //var template = _.template($('#edit-user-template2').html(), {user: null});  //mas 11/24
          var template = _.template(userDetailTemplate, {user: null});    //mas 11/24
          that.$el.html(template);
        }
      }

    });

    return UserEditView;  //mas 11/24

    //var userEditView = new UserEditView();

});  //mas 11/24

