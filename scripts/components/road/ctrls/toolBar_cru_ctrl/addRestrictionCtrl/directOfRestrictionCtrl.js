/**
 * Created by zhaohang on 2016/5/6.
 */
var addDirectOfRestriction = angular.module('lazymodule', []);
addDirectOfRestriction.controller('addDirectOfRestrictionController', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.showData = objCtrl.originalData;
    $scope.restrictionType = objCtrl.originalData.restrictionType; // 1-卡车交限 0-普通交限
    $scope.laneConnexityData = [
        { id: 1, flag: false },
        { id: 2, flag: false },
        { id: 3, flag: false },
        { id: 4, flag: false },
        { id: 1, flag: true },
        { id: 2, flag: true },
        { id: 3, flag: true },
        { id: 4, flag: true }
    ];
    // 卡车交限
    $scope.truckRestrictionData = [1, 2, 3, 4];
    
    // 增加普通车道方向(单击)
    $scope.addNormalData1 = function (item) {
        if ($scope.restrictionType === 0) {
            var normalObj = {
                id: item.id,
                flag: item.flag
            };
            if ($scope.showData.showAdditionalData.length === 0) {
                $scope.showData.showNormalData.push(normalObj);
                if (item.flag === true) {
                    var id = '[' + item.id + ']';
                    $scope.showData.inLaneInfoArr.push(id);
                } else {
                    $scope.showData.inLaneInfoArr.push(item.id);
                }
            } else {
                var len = $scope.showData.showNormalData.length;
                $scope.showData.showNormalData.splice(len - 1, 0, normalObj);
                if (item.flag === true) {
                    var id = '[' + item.id + ']';
                    $scope.showData.inLaneInfoArr.splice(len - 1, 0, id);
                } else {
                    $scope.showData.inLaneInfoArr.splice(len - 1, 0, item.id);
                }
            }
        } else {
            if ($scope.showData.showAdditionalData.length === 0) {
                $scope.showData.showNormalData.push({
                    id: item
                });
                $scope.showData.inLaneInfoArr.push(item);
            }
        }
    };
});
