var indexCtrl = angular.module("indexCtrl", ['ngRoute', 'ngAnimate']);

indexCtrl.config(["$routeProvider", ($routeProvider)=>{

  $routeProvider
    .when("/", {
      templateUrl: 'views/home.html',
      controller: 'IndexController'
    })
    .when("/schedule", {
      templateUrl: "views/schedule.html",
      controller: "ScheduleController"
    })
    .otherwise({
      redirectTo: "/"
    })

}])



indexCtrl.controller("IndexController", ["$scope", "$http", "$routeParams",
 "$location", function($scope, $http, $routeParams, $location){

   $scope.page = "Home";

   $http.get("/home/userInfo").then((data)=>{
     //if profile is not returned, then we ask them to login
     $scope.user = data.data.user
   })

}])

indexCtrl.controller("ScheduleController", ["$scope", "$http", "$routeParams",
 "$location", function($scope, $http, $routeParams, $location){

   $scope.page = "Schedule";

   //grab all the current hwData
   $http.get("/home/getCalendarInfo").then((data)=>{
     $scope.svrData = data.data;
     console.log($scope.svrData);
   })

   $scope.newEntry = (subject, hwName, hwDate) => {
     console.log(hwDate, "is this in a usable format?");
     $http.post("/home/newEntry", {
       subject: subject,
       hwName: hwName,
       hwDate: hwDate
     }).then((receipt)=>{
       if(receipt.data.error){
         console.log("error: ", receipt.data.msg);
       }
       if(!receipt.data.error){
         console.log("SUCCESS!!");
       }
     })
   }

   $scope.newSubject = (subject) =>{
     $http.post("/home/newSubject", {
       subject: subject
     }).then((receipt)=>{
       if(receipt.data.error){
         console.log("error: ", receipt.data.msg);
       }
       if(!receipt.data.error){
         console.log("SUCCESS!!");
       }
     });
   }

   $scope.deleteSubjectActive = false;
   $scope.showDeleteSubject = (currentState)=>{
     console.log('commence');
     $scope.deleteSubjectActive = !currentState;
   };

   $scope.deleteSubject = (subjectId)=>{
     $http.post("/home/deleteSubject", {
       subject: subjectId
     }).then((receipt)=>{
       if(receipt.data.error){
         console.log("error: ", receipt.data.msg);
       }
       if(!receipt.data.error){
         console.log("SUCCESS!!");
       }
     });
   }

   $scope.newEvent = (view, state) =>{
     if(view == "hw"){
       if (state){
         $scope.addNewEvent = true;
       }else{
         $scope.addNewEvent = false;
       }
     }
     if(view == "subject"){
       if (state){
         $scope.addNewSubject = true;
       }else{
         $scope.addNewSubject = false;
       }
     }

   }

 }])
