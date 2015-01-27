var essayControllers = angular.module('essayControllers', []);

essayControllers.controller('EssayListCtrl', ['$scope', '$http',
  function ($scope, $http) {
    $http.get('api/essays.json').success(function(data) {
      $scope.essays = data;
    });

    $scope.orderProp = '-date';
  }]);

essayControllers.controller('EssayDetailCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    $http.get('api/essay/' + $routeParams.essayId + '.json').success(function(data) {
      $scope.essay = data;
    });
  }]);