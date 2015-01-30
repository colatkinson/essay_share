var essayControllers = angular.module('essayControllers', []);

function go($location, path) {
    $location.path( path );
}

var getUserName = function($http, $location, $rootScope) {
    $http.get('/loggedin').success(function(user) {
        $rootScope.user = user;
    });

    $rootScope.pastPath = $rootScope.curPath;
    $rootScope.curPath = $location.path();
    console.log($rootScope.pastPath, $rootScope.curPath);
};

essayControllers.controller('EssayListCtrl', ['$scope', '$http', '$location', '$rootScope',
  function ($scope, $http, $location, $rootScope) {
    $http.get('api/essays.json').success(function(data) {
      $scope.essays = data;
    });
    //checkLoggedin($http, $location, angular.module("essayApp").controller("EssayTopLevel"));

    console.log($scope.user != 0);

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

essayControllers.controller('EssayLoginCtrl', ['$scope', '$routeParams', '$http', '$location', '$rootScope',
    function($scope, $routeParams, $http, $location, $rootScope) {
            /*$http.get('api/essay/' + $routeParams.essayId + '.json').success(function(data) {
                $scope.essay = data;
            });*/

        $scope.pastPath = $rootScope.pastPath;

        $scope.go = function(path) {
            go($location, path);
        };
}]);

essayControllers.controller('EssayLogoutCtrl', ['$scope', '$routeParams', '$http', '$location',
    function($scope, $routeParams, $http, $location) {
        $http.post('/logoutReq').success(function(data) {
            console.log("Success!");
            $location.path("/");
        });

        $scope.go = function(path) {
            go($location, path);
        };
}]);

essayControllers.controller("EssayUserCtrl", ["$scope", "$routeParams", "$http", '$location',
    function($scope, $routeParams, $http, $location) {
        $http.get("api/user/" + $routeParams.username + ".json").success(function(data) {
            $scope.user = data;
            //$scope.query = $routeParams.term;
        });

        $scope.go = function(path) {
            go($location, path);
        };

        $scope.orderProp = '-date';
    }]
);