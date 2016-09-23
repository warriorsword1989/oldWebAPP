/**
 * Created by liuzhaoxia on 2015/12/11.
 */
var selectApp = angular.module("app");
selectApp.controller("rdCrossController", ['$scope', 'dsEdit', 'dsFcc', 'appPath', function($scope, dsEdit, dsFcc, appPath) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var rdcross = layerCtrl.getLayerById('rdCross');
    var eventController = fastmap.uikit.EventController();
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.initializeRdCrossData = function() {
        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.rdCrossForm) {
            $scope.rdCrossForm.$setPristine();
        }
        $scope.nameGroup = [];
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.rdCrossData = objCtrl.data;
        initNameInfo();
        var links = $scope.rdCrossData.links,
            highLightFeatures = [];
        for (var i = 0, len = links.length; i < len; i++) {
            highLightFeatures.push({
                id: links[i]["linkPid"].toString(),
                layerid: 'rdLink',
                type: 'line',
                style: {}
            })
        }
        highLightFeatures.push({
            id: $scope.rdCrossData.pid.toString(),
            layerid: 'rdCross',
            type: 'rdCross',
            style: {
                fillColor: '#ff00ff',
                radius: 7
            }
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
    };
    // 刷新rdCrossData.names
    $scope.refreshNames = function() {
        $scope.rdCrossData.names = [];
        for (var i = 0, len = $scope.nameGroup.length; i < len; i++) {
            for (var j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                $scope.rdCrossData.names.unshift($scope.nameGroup[i][j]);
            }
        }
    };

    function initNameInfo() {
        if ($scope.rdCrossData.names.length > 0) {
            $scope.nameGroup = [];
            /*根据数据中对象某一属性值排序*/
            function compare(propertyName) {
                return function (object1, object2) {
                    var value1 = object1[propertyName];
                    var value2 = object2[propertyName];
                    if (value2 < value1) {
                        return -1;
                    }
                    else if (value2 > value1) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            }
            $scope.rdCrossData.names.sort(compare('nameGroupid'));
            for (var i = 0, len = $scope.rdCrossData.names[0].nameGroupid; i < len; i++) {
                var tempArr = [];
                for (var j = 0, le = $scope.rdCrossData.names.length; j < le; j++) {
                    if ($scope.rdCrossData.names[j].nameGroupid == i + 1) {
                        tempArr.push($scope.rdCrossData.names[j]);
                    }
                }
                $scope.nameGroup.push(tempArr);
            }
            $scope.refreshNames();
        }
    }
    if (objCtrl.data) {
        $scope.initializeRdCrossData();
    }
    $scope.refreshData = function() {
        dsEdit.getByPid(parseInt($scope.rdCrossData.pid), "RDCROSS").then(function(data) {
            if (data) {
                objCtrl.setCurrentObject("RDCROSS", data);
                $scope.initializeRdCrossData();
            }
        });
    };
    /*查看详情*/
    $scope.showCrossNames = function(index, nameInfo, nameGroupid) {
        var crossNamesObj = { //这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            "loadType": "subAttrTplContainer",
            "propertyCtrl": 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            "propertyHtml": '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            "callback": function() {
                var detailInfo = {
                    "loadType": "subAttrTplContainer",
                    "propertyCtrl": appPath.road + 'ctrls/attr_cross_ctrl/namesCtrl',
                    "propertyHtml": appPath.root + appPath.road + 'tpls/attr_cross_tpl/namesTpl.html'
                };
                objCtrl.namesInfos = $scope.nameGroup[nameGroupid - 1];
                $scope.$emit("transitCtrlAndTpl", detailInfo);
            }
        };
        $scope.$emit("transitCtrlAndTpl", crossNamesObj);
    };
    /*增加item*/
    $scope.addItem = function(type) {
        $scope.refreshNames();
        objCtrl.data.names.push(fastmap.dataApi.rdCrossName({
            "nameGroupid": $scope.nameGroup.length + 1,
            "pid": $scope.rdCrossData.pid,
            "name": "路口名"
        }));
        initNameInfo();
        // $scope.tollGateData.passageNum = $scope.tollGateData.passages.length;
    };
    /*移除item*/
    $scope.removeItem = function(index, item) {
        for (var i = 0, len = $scope.nameGroup.length; i < len; i++) {
            if ($scope.nameGroup[i]) {
                for (var j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                    if ($scope.nameGroup[i][j] === item) {
                        if ($scope.nameGroup[i].length == 1) {
                            $scope.nameGroup.splice(i, 1);
                            for (var n = 0, nu = $scope.nameGroup.length; n < nu; n++) {
                                if (n >= i) {
                                    for (var m = 0, num = $scope.nameGroup[n].length; m < num; m++) {
                                        $scope.nameGroup[n][m].nameGroupid--;
                                    }
                                }
                            }
                        } else {
                            $scope.nameGroup[i].splice(index, 1);
                        }
                    }
                }
            }
        }
        $scope.refreshNames();
        // $scope.tollGateData.passageNum = $scope.tollGateData.passages.length;
        $scope.$emit('SWITCHCONTAINERSTATE', {
            'subAttrContainerTpl': false,
            'attrContainerTpl': true
        });
    };
    $scope.$watch($scope.nameGroup, function(newValue, oldValue, scope) {
        $scope.refreshNames();
    });
    // $scope.minuscrossName=function(id){
    //     $scope.rdCrossData.names.splice(id, 1);
    // };
    $scope.changeColor = function(index) {
        $("#crossnameSpan" + index).css("color", "#FFF");
    };
    $scope.backColor = function(index) {
        $("#crossnameSpan" + index).css("color", "darkgray");
    };
    $scope.save = function() {
        $scope.refreshNames();
        objCtrl.save();
        var param = {
            "command": "UPDATE",
            "type": "RDCROSS",
            "dbId": App.Temp.dbId,
            "data": objCtrl.changedProperty
        };
        if (!objCtrl.changedProperty) {
            swal("操作成功", '属性值没有变化！', "success");
            return;
        }
        dsEdit.save(param).then(function(data) {
            var info = [];
            if (data) {
                if (selectCtrl.rowkey) {
                    var stageParam = {
                        "rowkey": selectCtrl.rowkey.rowkey,
                        "stage": 3,
                        "handler": 0
                    };
                    dsFcc.changeDataTipsState(JSON.stringify(stageParam)).then(function(data) {
                        selectCtrl.rowkey.rowkey = undefined;
                    });
                }
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                $scope.refreshData();
            }
        })
    };
    $scope.delete = function() {
        var objId = parseInt($scope.rdCrossData.pid);
        dsEdit.delete(objId, 'RDCROSS', 1).then(function(data) {
            if (data) {
                rdcross.redraw();
                highRenderCtrl._cleanHighLight();
                $scope.$emit('SWITCHCONTAINERSTATE', {
                    'subAttrContainerTpl': false,
                    'attrContainerTpl': false
                });
                $scope.rdCrossData = null;
            }
        })
    };
    $scope.cancel = function() {};
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeRdCrossData);
}]);