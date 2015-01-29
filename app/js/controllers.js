var essayControllers = angular.module('essayControllers', []);

function go($location, path) {
    $location.path( path );
}

essayControllers.controller('EssayListCtrl', ['$scope', '$http', '$location',
  function ($scope, $http, $location) {
    $http.get('api/essays.json').success(function(data) {
      $scope.essays = data;
    });

    $scope.go = function(path) {
        go($location, path);
    };

    $scope.orderProp = '-date';
  }]);

essayControllers.controller('EssayDetailCtrl', ['$scope', '$routeParams', '$http', '$location',
  function($scope, $routeParams, $http, $location) {
    $http.get('api/essay/' + $routeParams.essayId + '.json').success(function(data) {
      $scope.essay = data;
    });

    $scope.go = function(path) {
        go($location, path);
    };
  }]);

essayControllers.controller("EssaySearchCtrl", ["$scope", "$routeParams", "$http", '$location',
    function($scope, $routeParams, $http, $location) {
        $http.get("api/essays.json?search=" + $routeParams.term).success(function(data) {
            $scope.essays = data;
            $scope.query = $routeParams.term;
        });

        $scope.go = function(path) {
            go($location, path);
        };

        $scope.orderProp = '-date';
    }]);