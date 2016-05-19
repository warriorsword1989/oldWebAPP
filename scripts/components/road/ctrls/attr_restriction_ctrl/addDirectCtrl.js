/**
 * Created by liwanchong on 2016/2/29.
 */
var addDirectOfRest = angular.module("mapApp");
addDirectOfRest.controller("addDirectOfRestController", function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.addDirectData = objCtrl.data;
    //初始化交限
    $scope.addLimitedData = [
        {"id": 1, "flag": false},
        {"id": 2, "flag": false},
        {"id": 3, "flag": false},
        {"id": 4, "flag": false},
        {"id": 1, "flag": true},
        {"id": 2, "flag": true},
        {"id": 3, "flag": true},
        {"id": 4, "flag": true}

    ];
    $scope.removeImgActive = function () {
        $.each($('.trafficPic'), function (i, v) {
            $(v).find('img').removeClass('active');
        });
    }
    //选择弹出框中的交限
    $scope.selectTip = function (item, e) {
        /*选中高亮*/
        $scope.removeImgActive();
        $(e.target).addClass('active');
        var flag;
        $scope.tipsId = item.id;
        if (item.flag) {
            flag = 2;

        } else {
            flag = 1;
        }
        var newDirectObj = fastmap.dataApi.rdRestrictionDetail({"restricInfo": item.id, "flag": flag,"conditions":[]})
        $scope.newLimited = newDirectObj;
    };
    //添加交限
    $scope.addTips = function () {
        if ($scope.modifyItem !== undefined) {
            var arr = $scope.addDirectData.details
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i].pid === $scope.modifyItem.pid) {
                    $scope.addDirectData.details[i].restricInfo = $scope.tipsId;
                    $scope.modifyItem = undefined;
                    break;
                }
            }
        } else {
            if ($scope.tipsId === null || $scope.tipsId === undefined) {
                alert("请先选择tips");
                return;
            }
            $scope.addDirectData.details.unshift($scope.newLimited);
            if ($scope.newLimited.type === 1) {
                $scope.addDirectData.restrictInfo += "," + $scope.newLimited.restricInfo;
            } else {
                var newDirect = ",[" + $scope.newLimited.restricInfo + "]";
                $scope.addDirectData.restrictInfo += newDirect;

            }

            $scope.removeImgActive();
            $scope.newLimited = '';
            $timeout(function () {
                $(".show-tips:first").trigger('click');
            })
        }
    }
})