/**
 * Created by navinfo on 2015/11/3.
 */

var otherApp = angular.module("mapApp", ['oc.lazyLoad']);
otherApp.controller("otherController", function ($scope, $timeout, $ocLazyLoad) {
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    $scope.roadlinkData = $scope.linkData;
    $scope.speedOfConLength = 0;
    $scope.speedTypeOption = [
        {"id": 0, "label": "普通"},
        {"id": 1, "label": "指示牌"},
        {"id": 3, "label": "特定条件"}
    ];
    $scope.fromOfWayOption = [
        {"id": "0", "label": "未调查"},
        {"id": "1", "label": "无属性"},
        {"id": "2", "label": "其他"},
        {"id": "10", "label": "IC"},
        {"id": "11", "label": "JCT"},
        {"id": "12", "label": "SA"},
        {"id": "13", "label": "PA"},
        {"id": "14", "label": "全封闭道路"},
        {"id": "15", "label": "匝道"},
        {"id": "16", "label": "跨线天桥"},
        {"id": "17", "label": "跨线地道"},
        {"id": "18", "label": "私道"},
        {"id": "20", "label": "步行街"},
        {"id": "21", "label": "过街天桥"},
        {"id": "22", "label": "公交专用道"},
        {"id": "23", "label": "自行车道"},
        {"id": "24", "label": "跨线立交桥"},
        {"id": "30", "label": "桥"},
        {"id": "31", "label": "隧道"},
        {"id": "32", "label": "立交桥"},
        {"id": "33", "label": "环岛"},
        {"id": "34", "label": "辅路"},
        {"id": "35", "label": "掉头口"},
        {"id": "36", "label": "POI连接路"},
        {"id": "37", "label": "提右"},
        {"id": "38", "label": "提左"},
        {"id": "39", "label": "主辅路入口"},
        {"id": "43", "label": "窄道路"},
        {"id": "48", "label": "主路"},
        {"id": "49", "label": "侧道"},
        {"id": "50", "label": "交叉点内道路"},
        {"id": "51", "label": "未定义交通区域"},
        {"id": "52", "label": "区域内道路"},
        {"id": "53", "label": "停车场出入口连接路"},
        {"id": "54", "label": "停车场出入口虚拟连接路"},
        {"id": "57", "label": "Highway对象外JCT"},
        {"id": "60", "label": "风景路线"},
        {"id": "80", "label": "停车位引导道路"},
        {"id": "81", "label": "停车位引导道路"},
        {"id": "82", "label": "虚拟提左提右"}
    ];
    $scope.auxiFlagoption=[
        {"id":0,"label":"无"},
        {"id":55,"label":"服务区内道路"},
        {"id":56,"label":"环岛IC链接路"},
        {"id":58,"label":"补助道路"},
        {"id":70,"label":"JCT道路名删除"},
        {"id":71,"label":"线假立交"},
        {"id":72,"label":"功能面关联道路"},
        {"id":73,"label":"环岛直连MD"},
        {"id":76,"label":"7级降8级标志"},
        {"id":77,"label":"交叉点间Link"}
    ];
    $scope.toolinfoOption=[
        {"id":0,"label":"未调查"},
        {"id":1,"label":"收费"},
        {"id":2,"label":"免费"},
        {"id":3,"label":"收费道路的免费区间"}
    ];
    //点击内容显示框时，关闭下拉，保存数据
    $("#fromOfWRoaddiv").click(function () {
        $("#fromOfWRoaddiv").popover('hide');
        $scope.endFromOfWayArray = getEndArray();
        for (var p in $scope.endFromOfWayArray) {
            $scope.otherFromOfWay.push({
                formOfWay: $scope.endFromOfWayArray[p].id,
                linkPid: $scope.roadlinkData.pid
            })
        }
        $scope.roadlinkData.forms = $scope.otherFromOfWay;
    });

    $scope.initOtherData = function(){
        $scope.newFromOfWRoadDate = [];
        if($scope.roadlinkData.forms.length>0){
            $scope.auxiFlag=$scope.roadlinkData.forms[0].auxiFlag;
            $scope.formOfWay=$scope.roadlinkData.forms[0].formOfWay;
        }
        for(var p in $scope.roadlinkData.forms){
            for(var s in $scope.fromOfWayOption){
                if($scope.roadlinkData.forms[p].formOfWay==$scope.fromOfWayOption[s].id){
                    $scope.newFromOfWRoadDate.push($scope.fromOfWayOption[s]);
                }
            }
        }
    }
    $scope.initOtherData();
    if(objectEditCtrl.data.data) {
        $scope.initOtherData();
    }
    objectEditCtrl.updateObject=function() {
        $scope.initOtherData();
    }
    $scope.saveroadtype=function(){
        $scope.rdNodeData.forms.unshift({
            formOfWay: parseInt($("#roadtypename").find("option:selected").val()),
            linkPid:$scope.rdNodeData.pid
        })

        $scope.newFromOfWRoadDate.unshift({
            formOfWay: parseInt($("#roadtypename").find("option:selected").val()),
            name: $("#roadtypename").find("option:selected").text()
        });
        $('#myModal').modal('hide');
    }
    $scope.deleteroadtype=function(){
        $scope.newFromOfWRoadDate.splice(type, 1);
        $scope.roadlinkData.forms.splice(type, 1);
    }
    $scope.saveroadname = function () {
        $scope.roadlinkData.forms.unshift({
            formOfWay: parseInt($("#roadtypename").find("option:selected").val()),
            linkPid: $scope.roadlinkData.pid
        })

        $scope.newFromOfWRoadDate.unshift({
            formOfWay: parseInt($("#roadtypename").find("option:selected").val()),
            name: $("#roadtypename").find("option:selected").text()
        });
        $('#myModal').modal('hide');
    }
    $scope.deleteroadtype = function (type) {
        $scope.newFromOfWRoadDate.splice(type, 1);
        $scope.roadlinkData.forms.splice(type, 1);
    }


    $scope.qkdifGroupId = function () {
        $("#difGroupIdText").val("");
    }

    //显示普通限速
    $scope.showOridinarySpeed = function () {
        if(! $scope.$parent.$parent.$parent.$parent.suspendFlag) {
            $scope.$parent.$parent.$parent.$parent.suspendFlag = true;
        }
        $scope.$parent.$parent.$parent.$parent.suspendObjURL = "";
        $ocLazyLoad.load('ctrl/linkCtrl/infoOfOridinarySpeedCtrl').then(function () {
            $scope.$parent.$parent.$parent.$parent.suspendObjURL = "js/tepl/linkObjTepl/infoiOfOridinarySpeedTepl.html";
        })
    };
    //显示条件限速
    $scope.showConditionSpeed=function() {
        if(! $scope.$parent.$parent.$parent.$parent.suspendFlag) {
            $scope.$parent.$parent.$parent.$parent.suspendFlag = true;
        }
        $scope.$parent.$parent.$parent.$parent.suspendObjURL = "";
        $ocLazyLoad.load('ctrl/linkCtrl/infoOfConditionSpeedCtrl').then(function () {
            $scope.$parent.$parent.$parent.$parent.suspendObjURL = "js/tepl/linkObjTepl/infoOfConditionSpeedTepl.html";
        })
    };
    //修改道路形态
    $scope.addFormOfWay = function() {
        if(! $scope.$parent.$parent.$parent.$parent.suspendFlag) {
            $scope.$parent.$parent.$parent.$parent.suspendFlag = true;
        }
        $scope.$parent.$parent.$parent.$parent.suspendObjURL = "";
        $ocLazyLoad.load('ctrl/linkCtrl/infoOfformOfWayCtrl').then(function () {
            $scope.$parent.$parent.$parent.$parent.suspendObjURL = "js/tepl/linkObjTepl/infoOfformOfWayTepl.html";
        })
    };
});