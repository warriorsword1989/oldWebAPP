/**
 * Created by liuzhaoxia on 2015/12/11.
 */
var selectApp = angular.module("mapApp", ['oc.lazyLoad']);
selectApp.controller("rdCrossController",function ($scope) {

    $scope.langCodeOptions=[
        {"id":0,"label":"0  中文"},
    ];


    $scope.checksignal=function(flag){
        $("#signaldiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#signalbtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        //$scope.rdCrossData.signal=flag;
    }

    $scope.checktype=function(flag){
        $("#typediv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#typebtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        //$scope.rdCrossData.type=flag;
    }

    $scope.checkelectRoeye=function(flag){
        $("#electRoeyediv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#electRoeyebtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        //$scope.rdCrossData.electRoeye=flag;
    }

    $scope.checksrcFlag=function(flag,item,index){
        $("#srcFlagdiv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#srcFlag"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.srcFlag=flag;
    }

    $scope.addrdCrossName=function(){
        if(!$("#namesDiv").hasClass("in")) {
            $("#namesDiv").addClass("in");
        }
        $scope.rdCrossData.names.unshift({
            nameId:0,
            nameGroupid:0,
            langCode:"",
            name: "",
            phonetic: "",
            srcFlag: 0
        })
    }

    $scope.minusrdCrossName=function(id) {
        $scope.rdCrossData.names.splice(id, 1);
        if($scope.rdCrossData.names.length===0) {
            if($("#namesDiv").hasClass("in")) {
                $("#namesDiv").removeClass("in");
            }
        }
    };

});