/**
 * Created by liuyang on 2016/8/9.
 */

var rdcrfObjectApp = angular.module("app");
rdcrfObjectApp.controller("crfObjectCtrl", ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var relationData = layerCtrl.getLayerById('crfData');
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var featCodeCtrl = fastmap.uikit.FeatCodeController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var editLayer = layerCtrl.getLayerById('edit');
    $scope.initializeData = function () {
        $scope.crfObjData = objCtrl.data;
        $scope.objData = {links: [], inters: [], roads: []};//要创建的对象.
        $scope.crfPids = [];
        $scope.selectCRFData = [];
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        selectCtrl.onSelected({
            id: $scope.crfObjData.pid
        });
        for (var i = 0; i < $scope.crfObjData.links.length; i++) {
            $scope.objData.links.push($scope.crfObjData.links[i].linkPid);
            highRenderCtrl.highLightFeatures.push({
                id: $scope.crfObjData.links[i].linkPid.toString(),
                layerid: 'rdLink',
                type: 'line',
                style: {}
            });
        }
        highRenderCtrl.drawHighlight();
        for (var i = 0; i < $scope.crfObjData.roads.length; i++) {
            $scope.crfPids.push($scope.crfObjData.roads[i].roadPid);
            $scope.objData.roads.push($scope.crfObjData.roads[i].roadPid);
            dsEdit.getByPid(parseInt($scope.crfObjData.roads[i].roadPid), "RDROAD").then(function (roadData) {
                var tempData = {
                    pid: roadData.pid,
                    highLightId: []
                };
                var linkArr = roadData.links;
                for (var i = 0, len = linkArr.length; i < len; i++) {
                    tempData.highLightId.push(linkArr[i].linkPid);
                    highRenderCtrl.highLightFeatures.push({
                        id: linkArr[i].linkPid.toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {}
                    });
                }
                highRenderCtrl.drawHighlight();
                $scope.selectCRFData.push(tempData);
            });
        }
        for (var i = 0; i < $scope.crfObjData.inters.length; i++) {
            $scope.crfPids.push($scope.crfObjData.inters[i].interPid);
            $scope.objData.inters.push($scope.crfObjData.inters[i].interPid);
            dsEdit.getByPid($scope.crfObjData.inters[i].interPid, "RDINTER").then(function (interData) {
                var tempData = {
                    pid: interData.pid,
                    highLightId: []
                };
                var linkArr = interData.links, points = interData.nodes;
                for (var i = 0, len = linkArr.length; i < len; i++) {
                    tempData.highLightId.push(linkArr[i].linkPid);
                    highRenderCtrl.highLightFeatures.push({
                        id: linkArr[i].linkPid.toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {}
                    });
                }
                for (var i = 0, len = points.length; i < len; i++) {
                    tempData.highLightId.push(points[i].nodePid);
                    highRenderCtrl.highLightFeatures.push({
                        id: points[i].nodePid.toString(),
                        layerid: 'rdLink',
                        type: 'rdnode',
                        style: {}
                    });
                }
                highRenderCtrl.drawHighlight();
                $scope.selectCRFData.push(tempData);
            })
        }
    };
    if (objCtrl.data) {
        $scope.initializeData();
        setTimeout(function () {
            featCodeCtrl.setFeatCode({
                "selectCRFData": $scope.selectCRFData,
                "objData":$scope.objData,
                "crfPids":$scope.crfPids
            });
        },200);
    }

    $scope.showNames = function (nameItem, index) {
        var showBlackObj = { //这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            "loadType": "subAttrTplContainer",
            "propertyCtrl": 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            "propertyHtml": '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            "callback": function () {
                var showNamesObj = {
                    "loadType": "subAttrTplContainer",
                    "propertyCtrl": 'scripts/components/road/ctrls/attr_rdcrf_ctrl/crfObjectNameCtrl',
                    "propertyHtml": '../../../scripts/components/road/tpls/attr_rdcrf_tpl/crfObjectNameTpl.html',
                    "data": index + "" //必须将数字转成字符串
                };
                $scope.$emit("transitCtrlAndTpl", showNamesObj);
            }
        };
        $scope.$emit("transitCtrlAndTpl", showBlackObj);
    };

    $scope.addRdName = function () {
        var newName = fastmap.dataApi.rdObjectNames({"pid": $scope.crfObjData.pid,"langCode":"CHI","nameId":0});
        $scope.crfObjData.names.unshift(newName)
    };


    $scope.minusName = function (id) {
        $scope.crfObjData.names.splice(id, 1);
        $scope.$emit("SWITCHCONTAINERSTATE", {"subAttrContainerTpl": false});
    };

    $scope.changeColor = function (ind, ord) {
        $("#nameSpan" + ind).css("color", "#FFF");
    };
    $scope.backColor = function (ind, ord) {
        $("#nameSpan" + ind).css("color", "darkgray");
    };
    $scope.save = function () {
        objCtrl.save();
        if (!objCtrl.changedProperty) {
            swal("操作成功", '属性值没有变化！', "success");
            return;
        }
        var param = {
            "command": "UPDATE",
            "type": "RDOBJECT",
            "dbId": App.Temp.dbId,
            "data": objCtrl.changedProperty
        };
        dsEdit.save(param).then(function (data) {
            if (data) {
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                relationData.redraw();
                swal("操作成功", "修改CRF对象成功！", "success");
            }
        })
    };

    $scope.delete = function () {
        var objId = parseInt($scope.crfObjData.pid);
        var param = {
            "command": "DELETE",
            "type": "RDOBJECT",
            "dbId": App.Temp.dbId,
            "objId": objId
        };
        dsEdit.save(param).then(function (data) {
            var info = null;
            if (data) {
                $scope.crfObjData = null;
                relationData.redraw();
                if (map.floatMenu) {
                    map.removeLayer(map.floatMenu);
                    map.floatMenu = null;
                }
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures = [];
                editLayer.clear();
                $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
            }
        })
    };
    $scope.cancel = function () {
    };
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);