// 11/24
define([
  'jquery',
  'underscore',
  'backbone',
  'models/UserModel'
], function($, _, Backbone, User){

    //User Collection 
    var Users = Backbone.Collection.extend({

      model: User,  // 11/24

      //both below work so long as case-sensitive, i.e.,  /backbonetdavis/... will not work
      //url: '/BackboneTDavis/restapi_user/users'
      url: 'restapi_user/users'
    });

    return Users;

});