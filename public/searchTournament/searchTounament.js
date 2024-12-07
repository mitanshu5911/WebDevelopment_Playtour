var module=angular.module("kuchModule",[]);
var controller=module.controller("kuchController",function($scope,$http){
    $scope.doFetchCity=function(){
        $http.get("/getCities").then(done,fail);
        function done(response){
            // alert(JSON.stringify(response.data));
            $scope.jsonCity=response.data;
        }
        function fail(err){
            alert(err.data);
        }
    }
    $scope.selCity="None";
    $scope.doShowSelCity=function()
    {
        //   alert($scope.selCity);
    }


    $scope.doFetchGame=function(){
        $http.get("/getGames").then(done,fail);
        function done(response){
            // alert(JSON.stringify(response.data));
            $scope.jsonGame=response.data;
        }
        function fail(err){
            alert(err.data);
        }
    }
    $scope.selGame="None";
    $scope.doShowSelGame=function()
    {
        //   alert($scope.selCity);
    }


    $scope.doFetchAll=function(){
        $http.get("/fetch-all?city="+$scope.selCity+"&game="+$scope.selGame).then(done,fail);
        function done(response){
            $scope.jsonArray=response.data;
        }
        function fail(err){
            alert(err.data);
        }
    }
    $scope.doFetchBySearch=function() {
        $http.get("/fetchUsingSearch?city="+$scope.inputSearch+"&game="+$scope.inputSearch+"&title="+$scope.inputSearch).then(done,fail);
        function done(response){
            $scope.jsonArray=response.data;
        }
        function fail(err){
            alert(err.data);
        }
    }
})
$(document).ready(function(){
    $("#seachinput").click(function(){
        $(this).prop("placeholder","City, Game, Title");
    })
})