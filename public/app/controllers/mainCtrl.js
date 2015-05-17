angular.module('mainCtrl', [])
.controller('mainController', function($rootScope, $location, Auth) {
  var vm = this;
  vm.processing = 0;

  // Get info if person logged in
  vm.loggedIn = Auth.isLoggedIn();

  // Check to see if a user is logged in on every request
  $rootScope.$on('$routeChangeStart', function() {
    vm.loggedIn = Auth.isLoggedIn();

    // Get user info on route change
    Auth.getUser()
      .success(function(data) {
        vm.user = data;
      });
  });

  // Function to handle login form
  vm.doLogin = function() {
    vm.processing++;
    vm.errorMessage = '';
    // Call Auth.login() function
    Auth.login(vm.loginData.username, vm.loginData.password)
      .success(function(data) {
        vm.processing--;

        // If successful login
        if (data.success) {
          $location.path('/users'); // Send to /users if logged in
        } else {
          vm.errorMessage = data.message;
        }
      });
  };

  // Handle logging out
  vm.doLogout = function() {
    Auth.logout();
    vm.user = {}; // Reset all user info
    $location.path('/login');
  };
});