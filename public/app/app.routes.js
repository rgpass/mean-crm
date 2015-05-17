angular.module('app.routes', ['ui.router'])
.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/views/home.html'
    })
    .state('login', {
      url: '/login',
      views: {
        'content@': {
          templateUrl: 'app/views/login.html',
          controller: 'mainController as login'
        }
      }
    })
    .state('users', {
      url: '/users',
      views: {
        'content@': {
          templateUrl: 'app/views/users/all.html',
          controller: 'userController as user'
        }
      }
    })
      .state('users.new', {
        url: '/new',
        views: {
          'content@': {
            templateUrl: 'app/views/users/single.html', // Same view as users#edit
            controller: 'userNewController as user'
          }
        }
      })
      .state('users.edit', {
        url: '/edit/:userId',
        views: {
          'content@': {
            templateUrl: 'app/views/users/single.html', // Same view as users#edit
            controller: 'userEditController as user'
          }
        }
      })
});
