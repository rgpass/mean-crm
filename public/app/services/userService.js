angular.module('userService', [])
.factory('User', function($http) {
  var userFactory = {};
  var usersPath = '/api/users/';

  // users#show
  userFactory.get = function(id) {
    return $http.get(usersPath + id);
  };

  // users#index
  userFactory.all = function() {
    return $http.get(usersPath);
  };

  // users#create
  userFactory.create = function(userData) {
    return $http.post(usersPath, userData);
  };

  // users#update
  userFactory.update = function(id, userData) {
    return $http.put(usersPath + id, userData);
  };

  // users#destroy
  userFactory.delete = function(id) {
    return $http.delete(usersPath + id);
  };

  return userFactory;
});