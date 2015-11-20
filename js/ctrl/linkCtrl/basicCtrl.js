/**
 * Created by liwanchong on 2015/10/29.
 */
var basicApp = angular.module("lazymodule", []);
basicApp.controller("basicController",function($scope) {
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
    },10)
    $scope.kindOptions = [
        {"id": 0, "label": "作业中"},
        {"id": 1, "label": "高速道路"},
        {"id": 2, "label": "城市高速"},
        {"id": 3, "label": "国道"},
        {"id": 4, "label": "省道"},
        {"id": 5, "label": "预留"},
        {"id": 6, "label": "县道"},
        {"id": 7, "label": "乡镇村道路"},
        {"id": 8, "label": "其它道路"},
        {"id": 9, "label": "非引导道路"},
        {"id": 10, "label": " 步行道路"},
        {"id": 11, "label": "人渡"},
        {"id": 13, "label": "轮渡"},
        {"id": 15, "label": "10级路(障碍物)"}
    ];
    $scope.laneClassOptions = [
        {"id": 0, "label": "未赋值"},
        {"id": 1, "label": "一条车道"},
        {"id": 2, "label": "2或3条"},
        {"id": 3,"label":"4条及以上"}
    ];
    $scope.imiCodeOptions = [
        {"id": 0, "label": "其他道路"},
        {"id": 1, "label": "交叉点内部道路"},
        {"id": 2, "label": "转弯道"},
        {"id": 3, "label": "无法描述的"}
    ];
    $scope.functionClassOptions = [
        {"id": 0, "label": "未赋值"},
        {"id": 1, "label": "等级1"},
        {"id": 2, "label": "等级2"},
        {"id": 3, "label": "等级3"},
        {"id": 4, "label": "等级4"},
        {"id": 5, "label": "等级5"}
    ];
    $scope.nameTypeOptions = [
        {"id": 0, "label": "普通"},
        {"id": 1, "label": "立交桥名(链接路)"},
        {"id": 2, "label": "立交桥名(主路)"},
        {"id": 3, "label": "风景线路"},
        {"id": 4, "label": "桥"},
        {"id": 5, "label": "隧道"},
        {"id": 6, "label": "虚拟名称"},
        {"id": 7, "label": "出口编号"},
        {"id": 8, "label": "编号名称"},
        {"id": 9, "label": "虚拟连接名称"},
        {"id": 14, "label": "点门牌"},
        {"id": 15, "label": "线门牌"}
    ];
    $scope.srcFlagOptions = [
        {"id": 0, "label": "现场道路名标牌"},
        {"id": 1, "label": "现场概略图"},
        {"id": 2, "label": "方向看板"},
        {"id": 3, "label": "旅游图"},
        {"id": 4, "label": "点门牌"},
        {"id": 5, "label": "线门牌"},
        {"id": 6, "label": "其他"},
        {"id": 9, "label": "来源无法确定"}
    ];
    $scope.routeAttOptions=[
        {"id":0,"label":"工作中"},
        {"id":1,"label":"上行"},
        {"id":2,"label":"下行"},
        {"id":3,"label":"环状"},
        {"id":4,"label":"内环"},
        {"id":5,"label":"外环"},
        {"id":9,"label":"未定义"}
    ]



    $scope.addRoadName=function(){
        if(!$("#loadPropertyDiv").hasClass("in")) {
            $("#loadPropertyDiv").addClass("in");
        }
        console.log($scope.linkData.pid);
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
})