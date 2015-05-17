angular.module('authService', [])
// ===================================================
// auth factory to login and get information
// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================
.factory('Auth', function($http, $q, AuthToken) {

  var authFactory = {};

  // Handle login
  authFactory.login = function(username, password) {
    var data = {
      username: username,
      password: password
    };
    return $http.post('/api/authenticate', data)
      .success(function(data) {
        AuthToken.setToken(data.token);
        return data;
      });
  };

  // Handle logout
  authFactory.logout = function() {
    // Clear the token by passing in nothing
    AuthToken.setToken();
  };

  // Check if the user is logged in
  authFactory.isLoggedIn = function() {
    if (AuthToken.getToken()) {
      return true;
    } else {
      return false;
    }
  };

  // Get the user info
  authFactory.getUser = function() {
    if (AuthToken.getToken()) {
      // After the first request, store the response in cache
      return $http.get('/api/me', { cache: true });
    } else {
      // $q is a promise object, can run it similar to a response from $http
      return $q.reject({ message: 'User has no token.' });
    }
  };

  return authFactory;
})
// ===================================================
// factory for handling tokens
// inject $window to store token client-side
// ===================================================
.factory('AuthToken', function($window) {
  var authTokenFactory = {};

  // Get the token
  authTokenFactory.getToken = function() {
    // Local storage can be seen in Dev Tools -> Resources -> Local Storage
    return $window.localStorage.getItem('token');
  };

  // Set the token or clear the token
  authTokenFactory.setToken = function(token) {
    // Local storage can be seen in Dev Tools -> Resources -> Local Storage
    if (token) {
      $window.localStorage.setItem('token', token);
    } else {
      $window.localStorage.removeItem('token');
    }
  };

  return authTokenFactory;
})
// ===================================================
// application configuration to integrate token into requests
// =================================================== 
.factory('AuthInterceptor', function($q, AuthToken, $location) {
  var interceptorFactory = {};

  // Attach token to every request
  interceptorFactory.request = function(config) {
    var token = AuthToken.getToken();

    if (token) { config.headers['x-access-token'] = token; }

    return config;
  };

  // Redirect if a token doesn't authenticate
  interceptorFactory.responseError = function(response) {
    if (response.status === 403) {  // 403 == Forbidden
      AuthToken.setToken();         // Clear token
      $location.path('/login');     // Redirect to login page
    }

    // Return errors from the server as a promise
    return $q.reject(response);
  };

  return interceptorFactory;
});
