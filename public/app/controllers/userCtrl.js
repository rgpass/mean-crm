// Independent module, inject userService
angular.module('userCtrl', ['userService'])
.controller('userController', function(User) {
  var vm = this;

  vm.processing++;

  // Grab all users on page load
  User.all()
    .success(function(data) {
      vm.processing--;
      vm.users = data;
    });

  vm.deleteUser = function(id) {
    vm.processing++;

    User.delete(id)
      .success(function(data) {
        // Grab all the users to update the table
        // Can also setup destroy action to return all users
        User.all()
          .success(function(data) {
            vm.processing--;
            vm.users = data;
          });
      });
  };
})
.controller('userNewController', function(User) {
  var vm = this;
  vm.type = 'create';

  vm.saveUser = function() {
    vm.processing++;

    // Clear the message
    vm.message = '';

    User.create(vm.userData)
      .success(function(data) {
        vm.processing--;
        vm.userData = {};
        vm.message = data.message;
      });
  }
})
.controller('userEditController', function($stateParams, User) {
  var vm = this;
  vm.type = 'edit';

  // Grab user info on page load
  User.get($stateParams.userId)
    .success(function(data) {
      vm.userData = data;
    });

  vm.saveUser = function() {
    vm.processing++;
    vm.message = '';

    User.update($stateParams.userId, vm.userData)
      .success(function(data) {
        vm.processing--;
        vm.message = data.message;
      });
  }
});
