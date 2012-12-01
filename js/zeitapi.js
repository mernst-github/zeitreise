angular.module('zeitapi', ['ng']).config(['$httpProvider', function (http) {
  delete http.defaults.headers.common['X-Requested-With'];
}]).factory('Author', function ($http) {
          var Author = {
            get:function (params, cb) {
              $http.get('http://api.zeit.de/author/' + params.id + '?fields=uuid,release_date', {
                headers:{'X-Authorization':'602c992cc45dd61c013925c253777e31447df5b2ea6e83152283'}
              }).success(function (response) {
                cb(response);
              });
            }
          };

          return Author;
        });
