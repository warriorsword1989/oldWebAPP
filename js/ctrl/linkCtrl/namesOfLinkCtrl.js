/**
 * Created by liwanchong on 2016/3/2.
 */
var namesOfLinkApp = angular.module("myApp", []);
namesOfLinkApp.controller("namesOfLinkController",function($scope,$timeout) {
    $scope.srcFlagOptions = [
        {"id": 0, "label": "0 现场道路名标牌"},
        {"id": 1, "label": "1 现场概略图"},
        {"id": 2, "label": "2 方向看板"},
        {"id": 3, "label": "3 旅游图"},
        {"id": 4, "label": "4 点门牌"},
        {"id": 5, "label": "5 线门牌"},
        {"id": 6, "label": "6 其他"},
        {"id": 9, "label": "9 来源无法确定"}
    ];
    $scope.routeAttOptions = [
        {"id": 0, "label": "0 工作中"},
        {"id": 1, "label": "1 上行"},
        {"id": 2, "label": "2 下行"},
        {"id": 3, "label": "3 环状"},
        {"id": 4, "label": "4 内环"},
        {"id": 5, "label": "5 外环"},
        {"id": 9, "label": "9 未定义"}
    ];
    var objCtrl = fastmap.uikit.ObjectEditController();
    if(objCtrl.data.data) {
        $scope.names = objCtrl.data.data.names;
    }else{
        $scope.names = objCtrl.data.names;
    }

    $scope.addRoadName=function(){
        var newName=fastmap.dataApi.linkname({"linkPid":objCtrl.data.pid})
        $scope.names.unshift(newName)
    }
    $scope.minusRoadName=function(id) {
        $scope.names.splice(id, 1);
        if($scope.names.length===0) {
        }
    };
    /*点击翻页*/
    $scope.goPaging = function(){
        if($scope.picNowNum == 0){
            if($scope.picTotal == 0 || $scope.picTotal == 1){
                $(".pic-next").prop('disabled','disabled');
            }else{
                $(".pic-next").prop('disabled',false);
            }
            $(".pic-pre").prop('disabled','disabled');
        }else{
            if($scope.picTotal - ($scope.picNowNum+1) == 0){
                $(".pic-next").prop('disabled','disabled');
            }else{
                $(".pic-next").prop('disabled',false);
            }
            $(".pic-pre").prop('disabled',false);
        }
        $scope.$apply();
    }
    $scope.picNowNum = 0;
    //$scope.pagesize=0;

    $scope.getPicsDate = function(){
        var nameParameter = {
            "name": $scope.inNmae,
            "pageSize": $scope.pagesize,
            "pageNum":$scope.picNowNum
        }
        Application.functions.getNamesbyName(JSON.stringify(nameParameter), function (data) {
            if(data.errcode == 0){
                $(".pic-loading").hide();
                $("#namesDiv").css("display", "block");
                $scope.pictures = data.data.data;
                $scope.picTotal = Math.ceil(data.data.total/5);
                $scope.goPaging();
                $scope.$apply();
            }
        });
    }

    $scope.selectNameInd=0;
    $scope.searchGroupidByNames=function(ind){
        $("#name" + ind).css("display", "block");
        $scope.namesOfFlag = "name" + ind;
        $scope.pagesize=5;//$("#pagesize").val();
        $scope.selectNameInd=ind;
        $scope.inNmae=$scope.names[ind].name;
        $timeout(function(){
            $scope.picNowNum = 0;
            $scope.getPicsDate();
            if($.trim( $scope.inNmae) == ''){
                $('.pic-show').hide();
            }else{
                $('.pic-show').show();
            }
            $scope.$apply();
        },100);
    }

    $scope.selectNmaesId=function(nameid,name){
        $scope.names[$scope.selectNameInd].nameGroupid=nameid;
        $scope.names[$scope.selectNameInd].name=name;
        $('.pic-show').hide();
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
        $("#" + $scope.namesOfFlag).css("display","none");
    }
    $scope.changeColor=function(ind){
        $("#minusNameSpan"+ind).css("color","#FFF");
    }
    $scope.backColor=function(ind){
        $("#minusNameSpan"+ind).css("color","darkgray");
    }

})