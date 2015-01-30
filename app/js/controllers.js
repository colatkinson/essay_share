var essayControllers = angular.module('essayControllers', []);

function go($location, path) {
    $location.path( path );
}

var getUserName = function($http, $location, $rootScope) {
    // Initialize a new promise
    //var deferred = $q.defer();
    // Make an AJAX call to check if the user is logged in
    $http.get('/loggedin').success(function(user) {
    // Authenticated
    /*if (user !== '0')
        $timeout(deferred.resolve, 0); // Not Authenticated
    else {
        $rootScope.message = 'You need to log in.';
        $timeout(function(){
            deferred.reject();
        }, 0);
        $location.url('/login');
    }*/
        $rootScope.user = user;
        //console.log(angular.module("essayApp").controller("EssayTopLevel"));
    });
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

essayControllers.controller('EssayLoginCtrl', ['$scope', '$routeParams', '$http', '$location',
    function($scope, $routeParams, $http, $location) {
            /*$http.get('api/essay/' + $routeParams.essayId + '.json').success(function(data) {
                $scope.essay = data;
            });*/

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