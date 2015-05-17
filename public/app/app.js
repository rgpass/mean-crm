var app = angular.module('userApp', [
  'ngAnimate',
  'app.routes',
  // 'ui.router',
  'authService',
  'mainCtrl',
  'userCtrl',
  'userService'
])
// App config to send token into each request
.config(function($httpProvider) {
  // Attach our auth interceptor to each http request
  $httpProvider.interceptors.push('AuthInterceptor');
});
