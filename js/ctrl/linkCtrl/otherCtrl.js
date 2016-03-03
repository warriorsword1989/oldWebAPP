/**
 * Created by navinfo on 2015/11/3.
 */

var otherApp = angular.module("mapApp", ['oc.lazyLoad']);
otherApp.controller("otherController", function ($scope, $timeout, $ocLazyLoad) {
    $scope.roadlinkData = $scope.linkData;
    $scope.speedOfConLength = 0;
    $scope.newFromOfWRoadDate = [];

    $scope.speedTypeOption = [
        {"id": 0, "label": "普通"},
        {"id": 1, "label": "指示牌"},
        {"id": 3, "label": "特定条件"}
    ];
    for (var p in $scope.roadlinkData.forms) {
        for (var s in $scope.fromOfWayOption) {
            if ($scope.roadlinkData.forms[p].formOfWay == $scope.fromOfWayOption[s].id) {
                $scope.newFromOfWRoadDate.push($scope.fromOfWayOption[s]);
            }
        }
    }
    for (var typeNum = 0, typeLen = $scope.roadlinkData.speedlimits.length; typeNum < typeLen; typeNum++) {
        if ($scope.roadlinkData.speedlimits[typeNum].speedType === 3) {
            $scope.speedOfConLength++;
        }
    }
    $scope.otherFromOfWay = [];
    //初始化数据
    initOrig($scope.newFromOfWRoadDate, $scope.fromOfWayOption, "fromOfWRoaddiv");
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

    $scope.showPopover = function () {
        $('#fromOfWRoaddiv').popover('show');
    }
    $scope.showOridinarySpeed = function () {
        $scope.$parent.$parent.$parent.$parent.suspendObjURL = "";
        $ocLazyLoad.load('ctrl/linkCtrl/infoOfOridinarySpeedCtrl').then(function () {
            $scope.$parent.$parent.$parent.$parent.suspendObjURL = "js/tepl/linkObjTepl/infoiOfOridinarySpeedTepl.html";
        })
    };
    $scope.showConditionSpeed=function() {
        $scope.$parent.$parent.$parent.$parent.suspendObjURL = "";
        $ocLazyLoad.load('ctrl/linkCtrl/infoOfConditionSpeedCtrl').then(function () {
            $scope.$parent.$parent.$parent.$parent.suspendObjURL = "js/tepl/linkObjTepl/infoOfConditionSpeedTepl.html";
        })
    };
});