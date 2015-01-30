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

    console.log($scope.user);

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

/*$rootScope.$on('$routeChangeStart', function (event, next) {
    var userAuthenticated = ...; /* Check if the user is logged in *

    if (!userAuthenticated && !next.isLogin) {
        /* You can save the user's location to take him back to the same page after he has logged-in *
        $rootScope.savedLocation = $location.url();

        $location.path('/User/LoginUser');
    }
});*/