/**
 * Created by liwanchong on 2016/2/29.
 */
var addDirectOfRest = angular.module("lazymodule", []);
addDirectOfRest.controller("addDirectOfNodeController", function($scope, $timeout) {
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.fromOfWayOption = [
        {
            "id": 0,
            "label": "未调查",
            "isCheck": false,
            "index":0
        },
        {
            "id": 1,
            "label": "无属性",
            "isCheck": false,
            "index":1
        },
        {
            "id": 2,
            "label": "图廓点",
            "isCheck": false,
            "index":2
        },
        {
            "id": 3,
            "label": "CRF Info点",
            "isCheck": false,
            "index":3
        },
        {
            "id": 4,
            "label": "收费站",
            "isCheck": false,
            "index":4
        },
        {
            "id": 5,
            "label": "Hihgway起点",
            "isCheck": false,
            "index":5
        },
        {
            "id": 6,
            "label": "Highway终点",
            "isCheck": false,
            "index":6
        },
        {
            "id": 10,
            "label": "IC",
            "isCheck": false,
            "index":7
        },
        {
            "id": 11,
            "label": "JCT",
            "isCheck": false,
            "index":8
        },
        {
            "id": 12,
            "label": "桥",
            "isCheck": false,
            "index":9
        },
        {
            "id": 13,
            "label": "隧道",
            "isCheck": false,
            "index":10
        },
        {
            "id": 14,
            "label": "车站",
            "isCheck": false,
            "index":11
        },
        {
            "id": 15,
            "label": "障碍物",
            "isCheck": false,
            "index":12
        },
        {
            "id": 16,
            "label": "门牌号码点",
            "isCheck": false,
            "index":13
        },
        {
            "id": 20,
            "label": "幅宽变化点",
            "isCheck": false,
            "index":14
        },
        {
            "id": 21,
            "label": "种别变化点",
            "isCheck": false,
            "index":15
        },
        {
            "id": 22,
            "label": "车道变化点",
            "isCheck": false,
            "index":16
        },
        {
            "id": 23,
            "label": "分隔带变化点",
            "isCheck": false,
            "index":17
        },
        {
            "id": 30,
            "label": "铁道道口",
            "isCheck": false,
            "index":18
        },
        {
            "id": 31,
            "label": "有人看守铁道道口",
            "isCheck": false,
            "index":19
        },
        {
            "id": 32,
            "label": "无人看守铁道道口",
            "isCheck": false,
            "index":20
        },
        {
            "id": 41,
            "label": "KDZone与道路交点",
            "isCheck": false,
            "index":21
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
            var flag = true;
            if (item.id == 0 || item.id == 1 || item.id == 3  ) {
                $scope.formsData.length = 0;
                for (var s in $scope.fromOfWayOption) {
                    if ($scope.fromOfWayOption[s].id != item.id) {
                        $scope.fromOfWayOption[s].isCheck = false;
                    }
                }
            } else if (item.id == 16){
                if(selectCtrl.selectedFeatures.geometry.coordinates.length == 2){ //路上点（门牌号码点）只能挂接两条Link；
                    $scope.formsData.length = 0;
                    for (var s in $scope.fromOfWayOption) {
                        if ($scope.fromOfWayOption[s].id != item.id) {
                            $scope.fromOfWayOption[s].isCheck = false;
                        }
                    }
                } else {
                    swal('提示','门牌号码点只能挂接两条Link！','warning');
                    item.isCheck = false;
                    flag = false;
                }
            } else {
                if(item.id == 11){ // 	Node的“JCT”形态不能与“隧道”、“桥”形态共存；
                    for (var i = $scope.formsData.length-1 ; i >= 0  ; i--) {
                        if ($scope.formsData[i].formOfWay == 12 || $scope.formsData[i].formOfWay == 13) {
                            if($scope.formsData[i].formOfWay == 12){
                                $scope.fromOfWayOption[9].isCheck = false; //桥
                            } else if ($scope.formsData[i].formOfWay == 13){
                                $scope.fromOfWayOption[10].isCheck = false; //隧道
                            }
                            $scope.formsData.splice(i, 1);
                        }
                    }
                } else if (item.id == 12 || item.id == 13) {//Node的“JCT”形态不能与“隧道”、“桥”形态共存；
                    for (var i = $scope.formsData.length-1 ; i >= 0  ; i--) {
                        if ($scope.formsData[i].formOfWay == 11 ) {
                            $scope.fromOfWayOption[8].isCheck = false; //JCT
                            $scope.formsData.splice(i, 1);
                        }
                    }
                } else if (item.id == 2 || item.id == 15){ //图廓点不能和障碍物共存；
                    for (var i = $scope.formsData.length-1 ; i >= 0  ; i--) {
                        if ($scope.formsData[i].formOfWay == 2) {
                            $scope.fromOfWayOption[2].isCheck = false;
                            $scope.formsData.splice(i, 1);
                        } else if ($scope.formsData[i].formOfWay == 15){
                            $scope.fromOfWayOption[12].isCheck = false;
                            $scope.formsData.splice(i, 1);
                        }
                    }
                } else if (item.id == 4){ //收费站
                    if(objectEditCtrl.data.kind == 3){ //点属性为“收费站”时，种别必须是“路上点”；
                        for (var i = $scope.formsData.length-1 ; i >= 0  ; i--) {
                            if ($scope.formsData[i].formOfWay == 0) {
                                $scope.fromOfWayOption[0].isCheck = false;
                                $scope.formsData.splice(i, 1);
                            } else if ($scope.formsData[i].formOfWay == 1){
                                $scope.fromOfWayOption[1].isCheck = false;
                                $scope.formsData.splice(i, 1);
                            }
                        }
                    } else {
                        swal('提示','点属性为“收费站”时，种别必须是“路上点”！','warning');
                        item.isCheck = false;
                        flag = false;
                    }
                }
                if(flag){
                    //“未调查”不能和其它形态共存，“无属性”不能和其它形态共存；CRFInfo不能和其它形态共存；门牌号码点不能和其它形态共存； 0-2-3-16
                    for (var p in $scope.formsData) {
                        if ($scope.formsData[p].formOfWay == 0 || $scope.formsData[p].formOfWay == 1 || $scope.formsData[p].formOfWay == 3 || $scope.formsData[p].formOfWay == 16) {
                            $scope.formsData.splice(p, 1);
                        }
                    }
                    $scope.fromOfWayOption[0].isCheck = false;
                    $scope.fromOfWayOption[1].isCheck = false;
                    $scope.fromOfWayOption[3].isCheck = false;
                    $scope.fromOfWayOption[13].isCheck = false;
                }
            }

            if (flag){
                var newForm = fastmap.dataApi.rdNodeForm({
                    "auxiFlag": 0,
                    "formOfWay": item.id,
                    "nodePid": $scope.dataPid
                });
                $scope.formsData.unshift(newForm);
            }
        } else {
            if($scope.formsData.length == 1){
                item.isCheck = true;
            }
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
    };
    //eventCtrl.off('SHOWSUBTABLEDATA');
    //eventCtrl.on('SHOWSUBTABLEDATA', $scope.initializeSelNodeData);
});