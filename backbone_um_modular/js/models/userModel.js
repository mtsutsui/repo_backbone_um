
// 11/24
define([
  'underscore',
  'backbone'
], function(_, Backbone) {

    var User = Backbone.Model.extend({
      //both below work so long as case-sensitive, i.e.,  /backbonetdavis/... will not work
      //urlRoot: '/BackboneTDavis/restapi_user/users'
      urlRoot: 'restapi_user/users'
    });

    return User;  // 11/24

});