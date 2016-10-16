/**
 * Created by liwanchong on 2016/2/29.
 */
var addDirectOfRest = angular.module("lazymodule", []);
addDirectOfRest.controller("addDirectOfNodeController", function($scope, $timeout) {
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    var eventCtrl = fastmap.uikit.EventController();
    $scope.fromOfWayOption = [
        {
            "id": 0,
            "label": "未调查",
            "isCheck": false
        },
        {
            "id": 1,
            "label": "无属性",
            "isCheck": false
        },
        {
            "id": 2,
            "label": "图廓点",
            "isCheck": false
        },
        {
            "id": 3,
            "label": "CRF Info点",
            "isCheck": false
        },
        {
            "id": 4,
            "label": "收费站",
            "isCheck": false
        },
        {
            "id": 5,
            "label": "Hihgway起点",
            "isCheck": false
        },
        {
            "id": 6,
            "label": "Highway终点",
            "isCheck": false
        },
        {
            "id": 10,
            "label": "IC",
            "isCheck": false
        },
        {
            "id": 11,
            "label": "JCT",
            "isCheck": false
        },
        {
            "id": 12,
            "label": "桥",
            "isCheck": false
        },
        {
            "id": 13,
            "label": "隧道",
            "isCheck": false
        },
        {
            "id": 14,
            "label": "车站",
            "isCheck": false
        },
        {
            "id": 15,
            "label": "障碍物",
            "isCheck": false
        },
        {
            "id": 16,
            "label": "门牌号码点",
            "isCheck": false
        },
        {
            "id": 20,
            "label": "幅宽变化点",
            "isCheck": false
        },
        {
            "id": 21,
            "label": "种别变化点",
            "isCheck": false
        },
        {
            "id": 22,
            "label": "车道变化点",
            "isCheck": false
        },
        {
            "id": 23,
            "label": "分隔带变化点",
            "isCheck": false
        },
        {
            "id": 30,
            "label": "铁道道口",
            "isCheck": false
        },
        {
            "id": 31,
            "label": "有人看守铁道道口",
            "isCheck": false
        },
        {
            "id": 32,
            "label": "无人看守铁道道口",
            "isCheck": false
        },
        {
            "id": 41,
            "label": "KDZone与道路交点",
            "isCheck": false
        }
        ];
    $scope.initializeSelNodeData = function() {
        $scope.formsData = objectEditCtrl.data.forms;
        $scope.dataPid = objectEditCtrl.data.pid;
        for (var p in $scope.formsData) {
            for (var s in $scope.fromOfWayOption) {
                if ($scope.formsData[p].formOfWay == $scope.fromOfWayOption[s].id) {
                    $scope.fromOfWayOption[s].isCheck = true;
                }
            }
        }
    }
    $scope.initializeSelNodeData();
    $scope.toggle = function(item) {
        if (item.isCheck) {
            if (item.id == 0 || item.id == 1) {
                $scope.formsData.length = 0;
                for (var s in $scope.fromOfWayOption) {
                    if ($scope.fromOfWayOption[s].id != item.id) {
                        $scope.fromOfWayOption[s].isCheck = false;
                    }
                }
            } else {
                for (var p in $scope.formsData) {
                    if ($scope.formsData[p].formOfWay == 0 || $scope.formsData[p].formOfWay == 1) {
                        $scope.formsData.splice(p, 1);
                    }
                }
                $scope.fromOfWayOption[0].isCheck = false;
                $scope.fromOfWayOption[1].isCheck = false;
            }
            var newForm = fastmap.dataApi.rdNodeForm({
                "auxiFlag": 0,
                "formOfWay": item.id,
                "nodePid": $scope.dataPid
            });
            $scope.formsData.unshift(newForm);
        } else {
            // 最后一个是无属性，不能反选
            if (item.id == 1 && $scope.formsData.length == 1) {
                item.isCheck = true;
            } else {
                for (var p in $scope.formsData) {
                    if ($scope.formsData[p].formOfWay == item.id) {
                        $scope.formsData.splice(p, 1);
                    }
                }
                // 形态全部去掉后，自动加上无属性
                if ($scope.formsData.length == 0) {
                    var newForm = fastmap.dataApi.rdNodeForm({
                        "auxiFlag": 0,
                        "formOfWay": 1,
                        "nodePid": $scope.dataPid
                    });
                    $scope.formsData.unshift(newForm);
                    $scope.fromOfWayOption[1].isCheck = true;
                }
            }
        }
        objectEditCtrl.nodeObjRefresh();
    }
    eventCtrl.off('SHOWSUBTABLEDATA');
    eventCtrl.on('SHOWSUBTABLEDATA', $scope.initializeSelNodeData);
})