/**
 * Created by liwanchong on 2016/3/2.
 */
var namesOfLinkApp = angular.module("app");
namesOfLinkApp.controller("namesOfRwLinkController",["$scope","$timeout","dsMeta",function($scope,$timeout,dsMeta) {

    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();


    /*点击翻页*/
    $scope.goPaging = function(){
        if($scope.picNowNum == 0){
            if($scope.picTotal == 0 || $scope.picTotal == 1){
                $(".pic-next").attr("disabled","disabled")
            }else{
                $(".pic-next").removeAttr('disabled');
            }
            $(".pic-pre").prop('disabled',true);
            $(".pic-pre").attr("disabled","disabled")
        }else{
            if($scope.picTotal - ($scope.picNowNum+1) == 0){
                $(".pic-next").attr("disabled","disabled")
            }else{
                $(".pic-next").removeAttr('disabled');
            }
            $(".pic-pre").removeAttr('disabled');
        }
    }


    $scope.getPicsDate = function(){
        var nameParameter = {
            "name": $scope.rwName.name,
            "pageSize": $scope.pagesize,
            "pageNum":$scope.picNowNum
        }
        dsMeta.getNamesbyName(nameParameter).then(function (data){
            if(data.errcode == 0){
                $scope.pictures = data.data.data;
                $scope.picTotal = Math.ceil(data.data.total/5);
                $scope.goPaging();
            }
        });
    }

    $scope.selectNameInd=0;
    $scope.searchGroupidByNames=function(){
        $("#name").css("display", "block").css({"height":'300px'});
        $('.pic-show').show();

        $timeout(function(){
            $scope.picNowNum = 0;
            $scope.getPicsDate();
        },100);
    }

    $scope.selectNmaesId=function(nameid,name,e){
        $scope.rwName.nameId = nameid;
        $scope.rwName.name = name;
        $scope.hidePicSelect(e);
    }

    /*箭头图代码点击下一页*/
    $scope.picNext = function(){
        $scope.picNowNum += 1;
        $scope.getPicsDate();
    }
    /*箭头图代码点击上一页*/
    $scope.picPre = function(){
        $scope.picNowNum -= 1;
        $scope.getPicsDate();
    }
    /*点击关闭隐藏选择图片界面*/
    $scope.hidePicSelect = function(e){
        $(e.target).parents('.pic-show').hide();
        $("#name").css({"height":'0px'});
        //$scope.hidePicSelect();
    }


    $scope.initializeData = function (){
        $scope.names = objCtrl.data.names;
        $scope.rwName = objCtrl.data.rwName;

        $scope.picNowNum = 0;
        $scope.pagesize=5;

        //回到初始状态
        if($scope.nameRwDetailForm) {
            $scope.nameRwDetailForm.$setPristine();
        }
    };


    $scope.initializeData();

    eventController.on("CHANGELINKNAME",  $scope.initializeData);

}]);