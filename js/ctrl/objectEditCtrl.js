/**
 * Created by liwanchong on 2015/10/24.
 */
var objectEditApp = angular.module("lazymodule", []);
objectEditApp.controller("normalController", function ($scope) {
    var objectEditCtrl = new fastmap.uikit.ObjectEditController();
    //$scope.$parent.$parent.rdRestrictData = objectEditCtrl.data;
    $scope.rdLinkData = $scope.$parent.$parent.rdRestrictData;
    console.log("test" + $scope.rdLinkData);
    $scope.showTips = function (id) {
        alert(id);
    };
    $scope.rdSubRestrictData = objectEditCtrl.data.details[0];
    $scope.selectTip = function (item) {
        $scope.rdSubRestrictData = item;
    };
    $scope.addTips = function () {
        if ($scope.tipsId === null || $scope.tipsId === undefined) {
            alert("请先选择tips");
            return;
        }
        var tipsObj = $scope.rdRestrictData.info;
        for (var i = 0, len = tipsObj.length; i < len; i++) {
            if (tipsObj[i].flag === $scope.tipsId) {
                alert("重复");
                return;
            }
        }
        $scope.rdRestrictData.info.push({flag: $scope.tipsId});

    }
    //增加时间段
    $scope.addTime=function(){
        $scope.rdRestrictData.time.unshift({startTime: "", endTime: ""});
    }
    //删除时间段
    $scope.minusTime=function(id) {
        $scope.rdRestrictData.time.splice(id, 1);
    };
    $scope.$parent.$parent.save=function() {
        console.log("变化后的数据" + $scope.$parent.rdLinkData);
        objectEditCtrl.onSaved($scope.data, $scope.data);
    };
});
