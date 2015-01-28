var essayApp = angular.module('essayApp', [
  'ngRoute',

  'essayAnimations',
  'essayControllers'
]);

essayApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/essays', {
        templateUrl: 'partials/essay-list.html',
        controller: 'EssayListCtrl'
      }).
      when('/essay/:essayId', {
        templateUrl: 'partials/essay-detail.html',
        controller: 'EssayDetailCtrl'
      }).
      otherwise({
        redirectTo: '/essays'
      });
  }]);