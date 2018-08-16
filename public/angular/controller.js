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

     if(data.data.user == null){
       location.href = "/"
     }
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

          $scope.month = $scope.svrData.date[1];
          $scope.date = $scope.svrData.date[2]+1;
     })


    //this is a redundant function --> how can I use the above function for on-load & on call
     $scope.grabData = ()=>{
       $http.get("/home/getCalendarInfo").then((data)=>{
         $scope.svrData = data.data;
         console.log($scope.svrData);

            $scope.month = $scope.svrData.date[1];
            $scope.date = $scope.svrData.date[2]+1;
            $(".true_checkbox").attr("checked", "true");
       })
     }


   $scope.newEntry = (subject, hwName, month, date) => {
     console.log(subject, "OK?");
     $http.post("/home/newEntry", {
       subject: subject.subject,
       hwName: hwName,
       month: month,
       date: date
     }).then((receipt)=>{
       if(receipt.data.error){
         console.log("error: ", receipt.data.msg);
       }
       if(!receipt.data.error){
         console.log("SUCCESS!!");
         $scope.addNewEvent = false;
         $scope.grabData();
       }
     })
   }

   $scope.completed = (id) =>{
     $http.post("/home/completed", {
       id: id
     }).then((receipt)=>{
       if(receipt.data.error){
         console.log("error: ", receipt.data.msg);
       }
       if(!receipt.data.error){
         console.log("SUCCESS!!");
         $scope.grabData()
       }
     });
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
         $scope.addNewSubject = false;
         $scope.grabData();
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
         $scope.grabData()
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
