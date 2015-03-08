var moreaControllers = angular.module('moreaControllers', []);

moreaControllers.controller('MoreaListCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('/').success(function(data) {
            $scope.phones = data;
        });

        $scope.orderProp = 'age';
    }]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams',
    function($scope, $routeParams) {
        $scope.phoneId = $routeParams.phoneId;
    }]);