/**
 * Created by liwanchong on 2015/10/29.
 */
var basicApp = angular.module("lazymodule", []);
basicApp.controller("basicController",function($scope,$timeout) {
    var selectCtrl = fastmap.uikit.SelectController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    $("#multiDigitizedbtn"+$scope.linkData.multiDigitized).removeClass("btn btn-default").addClass("btn btn-primary");    //for(var sitem in $scope.roadlinkData.speedlimits){
    setTimeout(function(){
        for(var sitem in $scope.linkData.names){
        var flag=$scope.linkData.names[sitem].nameClass;
        var codeflag=$scope.linkData.names[sitem].code;
            $("#nameClass"+flag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
            $("#codebtn"+codeflag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
        }
        if($scope.linkData.names!="undefined"){
            if($scope.linkData.names.length>=1){
                $('#'+$scope.linkData.names[0].linkPid+'_'+0).collapse('show');
            }else{

            }
        }
    },10)
    $scope.kindOptions = [
        {"id": 0, "label": "0 作业中"},
        {"id": 1, "label": "1 高速道路"},
        {"id": 2, "label": "2 城市高速"},
        {"id": 3, "label": "3 国道"},
        {"id": 4, "label": "4 省道"},
        {"id": 5, "label": "5 预留"},
        {"id": 6, "label": "6 县道"},
        {"id": 7, "label": "7 乡镇村道路"},
        {"id": 8, "label": "8 其它道路"},
        {"id": 9, "label": "9 非引导道路"},
        {"id": 10, "label": "10 步行道路"},
        {"id": 11, "label": "11 人渡"},
        {"id": 13, "label": "13 轮渡"},
        {"id": 15, "label": "15 10级路(障碍物)"}
    ];
    $scope.laneClassOptions = [
        {"id": 0, "label": "0 未赋值"},
        {"id": 1, "label": "1 一条车道"},
        {"id": 2, "label": "2 2或3条"},
        {"id": 3,"label":"3 4条及以上"}
    ];
    $scope.imiCodeOptions = [
        {"id": 0, "label": "0 其他道路"},
        {"id": 1, "label": "1 交叉点内部道路"},
        {"id": 2, "label": "2 转弯道"},
        {"id": 3, "label": "3 无法描述的"}
    ];
    $scope.functionClassOptions = [
        {"id": 0, "label": "0 未赋值"},
        {"id": 1, "label": "1 等级1"},
        {"id": 2, "label": "2 等级2"},
        {"id": 3, "label": "3 等级3"},
        {"id": 4, "label": "4 等级4"},
        {"id": 5, "label": "5 等级5"}
    ];
    $scope.nameTypeOptions = [
        {"id": 0, "label": "0 普通"},
        {"id": 1, "label": "1 立交桥名(链接路)"},
        {"id": 2, "label": "2 立交桥名(主路)"},
        {"id": 3, "label": "3 风景线路"},
        {"id": 4, "label": "4 桥"},
        {"id": 5, "label": "5 隧道"},
        {"id": 6, "label": "6 虚拟名称"},
        {"id": 7, "label": "7 出口编号"},
        {"id": 8, "label": "8 编号名称"},
        {"id": 9, "label": "9 虚拟连接名称"},
        {"id": 14, "label": "14 点门牌"},
        {"id": 15, "label": "15 线门牌"}
    ];
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
    $scope.routeAttOptions=[
        {"id":0,"label":"0 工作中"},
        {"id":1,"label":"1 上行"},
        {"id":2,"label":"2 下行"},
        {"id":3,"label":"3 环状"},
        {"id":4,"label":"4 内环"},
        {"id":5,"label":"5 外环"},
        {"id":9,"label":"9 未定义"}
    ]



    $scope.addRoadName=function(){
        if(!$("#loadPropertyDiv").hasClass("in")) {
            $("#loadPropertyDiv").addClass("in");
        }
        $scope.linkData.names.unshift({
            code:0,
            inputTime:"",
            linkPid: $scope.linkData.pid,
            name: "",
            nameClass: 1,
            nameGroupid: 0,
            nameType: 0,
            routeAtt:0,
            rowId: "",
            seqNum: 1,
            srcFlag:0
        })
        setTimeout(function(){
        for(var sitem in $scope.linkData.names){
            var flag=$scope.linkData.names[sitem].nameClass;
            var codeflag=$scope.linkData.names[sitem].code;
                $("#nameClass"+flag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
                $("#codebtn"+codeflag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
        }
        },10)
    }
    $scope.minusRoadName=function(id) {
        $scope.linkData.names.splice(id, 1);
        if($scope.linkData.names.length===0) {
            if($("#loadPropertyDiv").hasClass("in")) {
                $("#loadPropertyDiv").removeClass("in");
            }
        }
    };

    $scope.checkMultiDigitized=function(flag){
        $("#multiDigitizeddiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#multiDigitizedbtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.linkData.multiDigitized=flag;
    }

    $scope.checknameClass=function(flag,item,index){
        $("#nameClassdiv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#nameClass"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.nameClass=flag;
    }

    $scope.checkcode=function(flag,item,index){
        $("#codediv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#codebtn"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.code=flag;
    }

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
            if($scope.picTotal - $scope.picNowNum == 0){
                $(".pic-next").prop('disabled','disabled');
            }
            $(".pic-pre").prop('disabled',false);
        }
        $scope.$apply();
    }
    $scope.picNowNum = 0;
    $scope.getPicsDate = function(){
        var nameParameter = {
            "name": $scope.inNmae,
            "pageSize": 10,
            "pageNum":$scope.picNowNum
        }
        Application.functions.getNamesbyName(JSON.stringify(nameParameter), function (data) {
            if(data.errcode == 0){
                $(".pic-loading").hide();
                $("#namesDiv").css("display", "block");
                $scope.pictures = data.data.data;
                $scope.picTotal = Math.ceil(data.data.total/10);
                $scope.goPaging();
                $scope.$apply();
            }
        });
    }

    $scope.selectNameInd=0;
    $scope.searchGroupidByNames=function(ind){
        $scope.selectNameInd=ind;
        $scope.inNmae=$scope.linkData.names[ind].name;
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
        $scope.linkData.names[$scope.selectNameInd].nameGroupid=nameid;
        $scope.linkData.names[$scope.selectNameInd].name=name;
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
    }
})