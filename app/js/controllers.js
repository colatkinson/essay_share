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

essayControllers.controller('EssayListCtrl', ['$scope', '$http', '$location', '$rootScope', '$sce',
  function ($scope, $http, $location, $rootScope, $sce) {
    $http.get('api/essays.json').success(function(data) {
      $scope.essays = data;
    });
    //checkLoggedin($http, $location, angular.module("essayApp").controller("EssayTopLevel"));

    console.log($scope.user != 0);

    $scope.go = function(path) {
        go($location, path);
    };

    $scope.orderProp = '-date';

    $scope.trustAsHtml = $sce.trustAsHtml;
  }]);

essayControllers.controller('EssayDetailCtrl', ['$scope', '$routeParams', '$http', '$location', '$sce',
    function($scope, $routeParams, $http, $location, $sce) {
            $http.get('api/essay/' + $routeParams.essayId + '.json').success(function(data) {
                $scope.essay = data;
            });

        $scope.go = function(path) {
            go($location, path);
        };
        $scope.trustAsHtml = $sce.trustAsHtml;
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

essayControllers.controller("EssayUserCtrl", ["$scope", "$routeParams", "$http", '$location', '$sce',
    function($scope, $routeParams, $http, $location, $sce) {
        $http.get("api/user/" + $routeParams.username + ".json").success(function(data) {
            $scope.user = data;
            //$scope.query = $routeParams.term;
        });

        $scope.go = function(path) {
            go($location, path);
        };

        $scope.orderProp = '-date';
        $scope.trustAsHtml = $sce.trustAsHtml;
    }]
);

essayControllers.controller('EssaySignupCtrl', ['$scope', '$routeParams', '$http', '$location', '$rootScope',
    function($scope, $routeParams, $http, $location, $rootScope) {
            /*$http.get('api/essay/' + $routeParams.essayId + '.json').success(function(data) {
                $scope.essay = data;
            });*/

        $scope.pastPath = $rootScope.pastPath;

        $scope.go = function(path) {
            go($location, path);
        };
}]);

essayControllers.controller('EssayCreateCtrl', ['$scope', '$routeParams', '$http', '$location', '$rootScope',
    function($scope, $routeParams, $http, $location, $rootScope) {

        $scope.pastPath = $rootScope.pastPath;

        $scope.go = function(path) {
            go($location, path);
        };

        $scope.previewText = function() {
            var elem = document.getElementById("preview");
            elem.innerHTML = markdown.toHTML(document.getElementsByName("content")[0].value);
        }

        $scope.submitForm = function(isValid) {

            // check to make sure the form is completely valid
            if (!isValid) {
                alert('There is an error in the form. Please fix it.');
            }

        };
}]);