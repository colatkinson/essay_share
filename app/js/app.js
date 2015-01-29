var essayApp = angular.module('essayApp', [
  'ngRoute',

  'essayAnimations',
  'essayControllers'
]);

essayApp.factory("essayService", function() {
    return {
        go: $scope.go = function (path) {
            $location.path( path );
        }
    }
});

/*function MyController($scope, essayService){
    $scope.go = essayService.go;
}*/

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
      when("/search/:term", {
        templateUrl: "partials/essay-list.html",
        controller: "EssaySearchCtrl"
      }).
      otherwise({
        redirectTo: '/essays'
      });
  }]);

essayApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});