var indexCtrl = angular.module("indexCtrl", ['ngRoute', 'ngAnimate']);

indexCtrl.config(["$routeProvider", ($routeProvider)=>{

  $routeProvider
    .when("/", {
      templateUrl: 'views/home.html',
      controller: 'IndexController'
    })
    .otherwise({
      redirectTo: "/"
    })

}])



indexCtrl.controller("IndexController", ["$scope", "$http", "$routeParams",
 "$location", function($scope, $http, $routeParams, $location){

   



}])
