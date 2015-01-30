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

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
    console.log("Checking if logged in");
    // Initialize a new promise
    var deferred = $q.defer();
    // Make an AJAX call to check if the user is logged in
    $http.get('/loggedin').success(function(user){
        // Authenticated
        if (user !== '0')
            $timeout(deferred.resolve, 0);
        // Not Authenticated
        else {
            $rootScope.message = 'You need to log in.';
            $timeout(function(){
                deferred.reject();
            }, 0);
            $location.url('/login');
        }
    });
};

essayApp.config(['$routeProvider', '$locationProvider', '$provide', '$httpProvider',
    function($routeProvider, $locationProvider, $provide, $httpProvider) {
        $routeProvider.
            when('/essays', {
                templateUrl: 'partials/essay-list.html',
                controller: 'EssayListCtrl',
                resolve: {
                    //loggedin: checkLoggedin,
                    userName: getUserName
                }
            }).
            when('/essay/:essayId', {
                templateUrl: 'partials/essay-detail.html',
                controller: 'EssayDetailCtrl',
                resolve: {
                    userName: getUserName
                }
            }).
            when("/search/:term", {
                templateUrl: "partials/essay-list.html",
                controller: "EssaySearchCtrl",
                resolve: {
                    userName: getUserName
                }
            }).
            when("/login", {
                templateUrl: "partials/login.html",
                controller: "EssayLoginCtrl",
                resolve: {
                    userName: getUserName
                    //pastLocation: setPastLocation
                }
            }).
            when("/user/:username", {
                templateUrl: 'partials/user.html',
                controller: "EssayUserCtrl",
                resolve: {
                    userName: getUserName
                }
            }).
            when("/logout", {
                templateUrl: 'partials/blank.html',
                controller: "EssayLogoutCtrl"
            }).
            otherwise({
                redirectTo: '/essays'
            });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);

    /*$provide.decorator('$sniffer', function($delegate) {
        $delegate.history = false;
        return $delegate;
    });*/
    $locationProvider
        .html5Mode(true)
        .hashPrefix('!');

    console.log($httpProvider);

    $httpProvider.interceptors.push(function($q, $location) {
        return function(promise) {
            return promise.then(
                // Success: just return the response
                function(response){
                    return response;
                },
                // Error: check the error status to get only the 401
                function(response) {
                    if (response.status === 401)
                        $location.url('/login'); 
                    return $q.reject(response);
            });
        }
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