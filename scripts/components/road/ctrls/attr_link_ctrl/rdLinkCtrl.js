/**
 * Created by liwanchong on 2015/10/29.
 */
var myApp = angular.module('app');
angular.module('app').controller('linkObjectController', ['$scope', '$ocLazyLoad', 'dsEdit', 'appPath', '$timeout', function ($scope, $ocLazyLoad, dsEdit, appPath, $timeout) {
    var objectCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var rdLink = layerCtrl.getLayerById('rdLink');
    var rdNode = layerCtrl.getLayerById('rdNode');
    var editLayer = layerCtrl.getLayerById('edit');
    var rdCross = layerCtrl.getLayerById('rdCross');
    var relation = layerCtrl.getLayerById('relationData');
    var rdLinkSpeedLimit = layerCtrl.getLayerById('rdLinkSpeedLimit');
    var outputCtrl = fastmap.uikit.OutPutController({});
    var toolTipsCtrl = fastmap.uikit.ToolTipsController();
    var eventController = fastmap.uikit.EventController();
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.selectedFeatures = objectCtrl.datas;
    $scope.speedAndDirect = shapeCtrl.shapeEditorResult.getFinalGeometry();
    $scope.brigeIndex = 0;
    $scope.modelArray = [false, false, false, false, false, false];
    // 改变模块的背景
    $scope.initializeLinkData = function () {
        for (var layer in layerCtrl.layers) {
            if (layerCtrl.layers[layer].options.requestType === 'RDLINKINTRTIC' && layerCtrl.layers[layer].options.visible) {
                for (var i = 0; i < $scope.modelArray.length; i++) {
                    if (i == 4) {
                        // 初始化鼠标提示
                        // $scope.toolTipText = '';
                        // toolTipsCtrl.setCurrentTooltip($scope.toolTipText);
                        $scope.modelArray[i] = true;
                        map.currentTool.disable();
                    } else {
                        $scope.modelArray[i] = false;
                    }
                }
                $ocLazyLoad.load(appPath.road + 'ctrls/attr_link_ctrl/rticCtrl').then(function () {
                    if (objectCtrl.updateObject) {
                        objectCtrl.updateObject();
                    }
                    $scope.currentURL = appPath.root + appPath.road + 'tpls/attr_link_tpl/rticTpl.html';
                });
                break;
            } else if (layer == layerCtrl.layers.length - 1) {
                for (var i = 0; i < $scope.modelArray.length; i++) {
                    if (i == 0) {
                        $scope.modelArray[i] = true;
                    } else {
                        $scope.modelArray[i] = false;
                    }
                }
                $ocLazyLoad.load(appPath.road + 'ctrls/attr_link_ctrl/basicCtrl').then(function () {
                    if (objectCtrl.updateObject) {
                        objectCtrl.updateObject();
                    }
                    $scope.currentURL = appPath.root + appPath.road + 'tpls/attr_link_tpl/basicTpl.html';

                    if(objectCtrl.datas.length > 0){
                        $ocLazyLoad.load(appPath.road + 'ctrls/attr_link_ctrl/listOfMultiFeaturesCtrl').then(function () {
                            $scope.currentList = appPath.root + appPath.road + 'tpls/attr_link_tpl/listOfMultiFeatures.html';
                        })
                    }

                });
            }
        }
        $scope.dataTipsData = selectCtrl.rowKey;
        objectCtrl.setOriginalData(objectCtrl.data.getIntegrate());
        $scope.linkData = objectCtrl.data;

// //         //測試數據
//         var obj1 = eval({
//
//                 "adasFlag": 0,
//                 "adasMemo": 0,
//                 "appInfo": 1,
//                 "centerDivider": 0,
//                 "developState": 1,
//                 "diciType": 0,
//                 "difGroupid": "",
//                 "digitalLevel": 0,
//                 "direct": 1,
//                 "eNodePid": 73394459,
//                 "editFlag": 1,
//                 "feeFlag": 0,
//                 "feeStd": 0.0,
//                 "forms": [{
//                     "auxiFlag": 0,
//                     "extendedForm": 0,
//                     "formOfWay": 1,
//                     "kgFlag": 0,
//                     "linkPid": 24438064,
//                     "rowId": "3AE1FC32300892F7E050A8C08304EE4C"
//                 }],
//                 "functionClass": 5,
//                 "geometry": {
//                     "type": "LineString",
//                     "coordinates": [[116.97195, 40.40465], [116.9718, 40.40446], [116.97036, 40.40258], [116.96955, 40.4014]]
//                 },
//                 "imiCode": 0,
//                 "intRtics": [],
//                 "isViaduct": 0,
//                 "kind": 7,
//                 "laneClass": 1,
//                 "laneLeft": 0,
//                 "laneNum": 2,
//                 "laneRight": 0,
//                 "laneWidthLeft": 1,
//                 "laneWidthRight": 1,
//                 "leftRegionId": 1028,
//                 "length": 414.483,
//                 "limitTrucks": [],
//                 "limits": [],
//                 "memo": "",
//                 "meshId": 605647,
//                 "multiDigitized": 0,
//                 "names": [  {
//                     "code": 1,
//                     "inputTime": "",
//                     "linkPid": 86889440,
//                     "name": "",
//                     "nameClass": 1,
//                     "nameGroupid": 60078,
//                     "nameType": 0,
//                     "routeAtt": 0,
//                     "rowId": "3AE1F9189FA692F7E050A8C08304EE4C",
//                     "seqNum": 2,
//                     "srcFlag": 9
//                 },
//                     {
//                         "code": 1,
//                         "inputTime": "",
//                         "linkPid": 86889440,
//                         "name": "",
//                         "nameClass": 1,
//                         "nameGroupid": 308935,
//                         "nameType": 0,
//                         "routeAtt": 0,
//                         "rowId": "3AE1F9189FA792F7E050A8C08304EE4C",
//                         "seqNum": 1,
//                         "srcFlag": 9
//                     }],
//                 "onewayMark": 0,
//                 "originLinkPid": 86344721,
//                 "parkingFlag": 0,
//                 "parkingLot": 0,
//                 "paveStatus": 0,
//                 "pid": 24438064,
//                 "rightRegionId": 1028,
//                 "routeAdopt": 2,
//                 "rtics": [],
//                 "sNodePid": 209496,
//                 "sidewalkFlag": 0,
//                 "sidewalks": [],
//                 "specialTraffic": 0,
//                 "speedlimits": [{
//                     "fromLimitSrc": 9,
//                     "fromSpeedLimit": 50,
//                     "linkPid": 24438064,
//                     "rowId": "3AE1FF187F2492F7E050A8C08304EE4C",
//                     "speedClass": 6,
//                     "speedClassWork": 1,
//                     "speedDependent": 0,
//                     "speedType": 0,
//                     "timeDomain": "",
//                     "toLimitSrc": 9,
//                     "toSpeedLimit": 50
//                 }],
//                 "srcFlag": 6,
//                 "streetLight": 0,
//                 "systemId": 0,
//                 "tollInfo": 2,
//                 "truckFlag": 0,
//                 "urban": 0,
//                 "walkFlag": 0,
//                 "walkstairFlag": 0,
//                 "walkstairs": [],
//                 "width": 55,
//                 "zones": []
//
//         });
//
//         var obj2 = eval({
//           "adasFlag": 2,
//           "adasMemo": 2,
//           "appInfo": 2,
//           "centerDivider": 2,
//           "developState": 2,
//           "diciType": 0,
//           "difGroupid": "",
//           "digitalLevel": 0,
//           "direct": 1,
//           "eNodePid": 73394459,
//           "editFlag": 1,
//           "feeFlag": 0,
//           "feeStd": 0.0,
//           "forms": [{
//             "auxiFlag": 0,
//             "extendedForm": 0,
//             "formOfWay": 1,
//             "kgFlag": 0,
//             "linkPid": 24438064,
//             "rowId": "3AE1FC32300892F7E050A8C08304EE4C"
//         }],
//           "functionClass": 5,
//           "geometry": {
//             "type": "LineString",
//               "coordinates": [[116.97195, 40.40465], [116.9718, 40.40446], [116.97036, 40.40258], [116.96955, 40.4014]]
//         },
//         "imiCode": 0,
//           "intRtics": [],
//           "isViaduct": 0,
//           "kind": 8,
//           "laneClass": 1,
//           "laneLeft": 0,
//           "laneNum": 2,
//           "laneRight": 0,
//           "laneWidthLeft": 1,
//           "laneWidthRight": 1,
//           "leftRegionId": 1028,
//           "length": 414.483,
//           "limitTrucks": [],
//           "limits": [],
//           "memo": "",
//           "meshId": 605647,
//           "multiDigitized": 0,
//           "names": [  {
//               "code": 2,
//               "inputTime": "",
//               "linkPid": 86889440,
//               "name": "",
//               "nameClass": 1,
//               "nameGroupid": 60078,
//               "nameType": 0,
//               "routeAtt": 0,
//               "rowId": "3AE1F9189FA692F7E050A8C08304EE4C",
//               "seqNum": 2,
//               "srcFlag": 9
//           },
//               {
//                   "code": 1,
//                   "inputTime": "",
//                   "linkPid": 86889440,
//                   "name": "",
//                   "nameClass": 1,
//                   "nameGroupid": 308935,
//                   "nameType": 0,
//                   "routeAtt": 0,
//                   "rowId": "3AE1F9189FA792F7E050A8C08304EE4C",
//                   "seqNum": 1,
//                   "srcFlag": 9
//               }],
//           "onewayMark": 0,
//           "originLinkPid": 86344721,
//           "parkingFlag": 0,
//           "parkingLot": 0,
//           "paveStatus": 0,
//           "pid": 24438064,
//           "rightRegionId": 1028,
//           "routeAdopt": 2,
//           "rtics": [],
//           "sNodePid": 209496,
//           "sidewalkFlag": 0,
//           "sidewalks": [],
//           "specialTraffic": 0,
//           "speedlimits": [{
//             "fromLimitSrc": 9,
//             "fromSpeedLimit": 50,
//             "linkPid": 24438064,
//             "rowId": "3AE1FF187F2492F7E050A8C08304EE4C",
//             "speedClass": 6,
//             "speedClassWork": 1,
//             "speedDependent": 0,
//             "speedType": 0,
//             "timeDomain": "",
//             "toLimitSrc": 9,
//             "toSpeedLimit": 50
//         }],
//           "srcFlag": 6,
//           "streetLight": 0,
//           "systemId": 0,
//           "tollInfo": 2,
//           "truckFlag": 0,
//           "urban": 0,
//           "walkFlag": 0,
//           "walkstairFlag": 0,
//           "walkstairs": [],
//           "width": 55,
//           "zones": []
//     });
//
//         $scope.linkData = compare.abstract([obj1, obj2]);
//       objectCtrl.data =$scope.linkData
//       //objectCtrl.setCurrentObject('RDLINK',$scope.linkData)
        $scope.currentURL = "";
        //随着地图的变化 高亮的线不变

        if ($scope.dataTipsData && $scope.dataTipsData.f_array && $scope.dataTipsData.f_array.length > 0) {
            var linksArr = [];
            var highLightFeatures = [];
            for (var item in $scope.dataTipsData.f_array) {
                linksArr.push($scope.dataTipsData.f_array[item].id);
                highLightFeatures.push({
                    id: $scope.dataTipsData.f_array[item].id,
                    layerid: 'rdLink',
                    type: 'line',
                    style: {}
                });
            }
            highRenderCtrl.highLightFeatures = highLightFeatures;
            highRenderCtrl.drawHighlight();
        } else {
            highRenderCtrl.highLightFeatures.push({
                id: $scope.linkData.pid.toString(),
                layerid: 'rdLink',
                type: 'line',
                style: {}
            });
            highRenderCtrl.drawHighlight();
        }
        var linkArr = $scope.linkData.geometry.coordinates,
            points = [];
        for (var i = 0, len = linkArr.length; i < len; i++) {
            var pointOfLine = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
            points.push(pointOfLine);
        }
        var pointOfSelect = selectCtrl.selectedFeatures.point;
        var line = fastmap.mapApi.lineString(points);
        selectCtrl.onSelected({
            geometry: line,
            id: $scope.linkData.pid,
            type: 'Link',
            direct: $scope.linkData.direct,
            snode: $scope.linkData.sNodePid,
            enode: $scope.linkData.eNodePid,
            point: pointOfSelect
        });
    };

    // 获取某个模块的信息
    $scope.changeModule = function (url, ind) {
        for (var i = 0; i < $scope.modelArray.length; i++) {
            if (ind == i && ind == 4) {
                for (var layer in layerCtrl.layers) {
                    if (layerCtrl.layers[layer].options.requestType === 'RDLINKINTRTIC') {
                        layerCtrl.layers[layer].options.isUpDirect = false;
                        layerCtrl.layers[layer].options.visible = true;
                        eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                            layerArr: layerCtrl.layers
                        });
                        break;
                    }
                }
                $scope.modelArray[i] = true;
            } else if (ind == i && ind == 2) {
                // for (var layer in layerCtrl.layers) {
                //     if (layerCtrl.layers[layer].options.requestType === "RDLINKSPEEDLIMIT") {
                //         layerCtrl.layers[layer].options.isUpDirect = false;
                //         layerCtrl.layers[layer].options.visible = true;
                //         eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                //             layerArr: layerCtrl.layers
                //         });
                //         break;
                //     }
                // }
                // $scope.$emit("changeScene", {data:"限速场景"});
                eventController.fire(eventController.eventTypes.CHANGESCENE, {
                    data: '限速场景'
                });
                $scope.modelArray[i] = true;
            } else if (ind == i) {
                for (var layer in layerCtrl.layers) {
                    if (layerCtrl.layers[layer].options.requestType === 'RDLINKINTRTIC') {
                        layerCtrl.layers[layer].options.isUpDirect = true;
                        layerCtrl.layers[layer].options.visible = false;
                        eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                            layerArr: layerCtrl.layers
                        });
                        // break;
                    }
                }
                eventController.fire(eventController.eventTypes.CHANGESCENE, {
                    data: '常规场景'
                });
                $scope.modelArray[i] = true;
            } else {
                $scope.modelArray[i] = false;
            }
        }
        $scope.$emit('SWITCHCONTAINERSTATE', {
            subAttrContainerTpl: false
        });
        if (url === 'basicModule') {
            $ocLazyLoad.load('scripts/components/road/ctrls/attr_link_ctrl/basicCtrl').then(function () {
                $scope.currentURL = '../../../scripts/components/road/tpls/attr_link_tpl/basicTpl.html';
            });
        } else if (url === 'paginationModule') {
            $ocLazyLoad.load('scripts/components/road/ctrls/attr_link_ctrl/pedestrianNaviCtrl').then(function () {
                $scope.currentURL = '../../../scripts/components/road/tpls/attr_link_tpl/pedestrianNaviTepl.html';
            });
        } else if (url === 'realtimeModule') {
            $ocLazyLoad.load('scripts/components/road/ctrls/attr_link_ctrl/rticCtrl').then(function () {
                $scope.currentURL = '../../../scripts/components/road/tpls/attr_link_tpl/rticTpl.html';
            });
        } else if (url === 'limitedModule') {
            $ocLazyLoad.load('scripts/components/road/ctrls/attr_link_ctrl/limitedCtrl').then(function () {
                $scope.currentURL = '../../../scripts/components/road/tpls/attr_link_tpl/limitTpl.html';
            });
        } else if (url == 'nameModule') { // 道路名
            $ocLazyLoad.load('scripts/components/road/ctrls/attr_link_ctrl/namesCtrl').then(function () {
                $scope.currentURL = '../../../scripts/components/road/tpls/attr_link_tpl/namesTpl.html';
            });
        } else if (url == 'speedModule') { // 限速
            $ocLazyLoad.load('scripts/components/road/ctrls/attr_link_ctrl/speedCtrl').then(function () {
                $scope.currentURL = '../../../scripts/components/road/tpls/attr_link_tpl/speedTpl.html';
            });
        }
    };
    $scope.angleOfLink = function (pointA, pointB) {
        var PI = Math.PI,
            angle;
        if ((pointA.x - pointB.x) === 0) {
            angle = PI / 2;
        } else {
            angle = Math.atan((pointA.y - pointB.y) / (pointA.x - pointB.x));
        }
        return angle;
    };
    $scope.changeDirect = function (direct) {
        map.currentTool.disable();
        map.currentTool = shapeCtrl.getCurrentTool();
        map.currentTool.disable();
        var containerPoint;
        var endNum = parseInt($scope.linkData.geometry.coordinates.length / 2);
        var point = {
            x: $scope.linkData.geometry.coordinates[0][0],
            y: $scope.linkData.geometry.coordinates[0][1]
        };
        var pointVertex = {
            x: $scope.linkData.geometry.coordinates[endNum][0],
            y: $scope.linkData.geometry.coordinates[endNum][1]
        };
        containerPoint = map.latLngToContainerPoint([point.y, point.x]);
        pointVertex = map.latLngToContainerPoint([pointVertex.y, pointVertex.x]);
        var angle = $scope.angleOfLink(containerPoint, pointVertex);
        var marker = {
            flag: true,
            pid: $scope.linkData.pid,
            point: point,
            type: 'marker',
            angle: angle,
            orientation: direct.toString()
        };
        var editLayer = layerCtrl.getLayerById('edit');
        layerCtrl.pushLayerFront('edit');
        var sObj = shapeCtrl.shapeEditorResult;
        editLayer.drawGeometry = marker;
        editLayer.draw(marker, editLayer);
        sObj.setOriginalGeometry(marker);
        sObj.setFinalGeometry(marker);
        shapeCtrl.setEditingType('transformDirect');
        shapeCtrl.startEditing();
    };
    // 初始化controller调用
    if (objectCtrl.data) {
        $scope.initializeLinkData();
    }
    $scope.save = function () {
        if (!$scope.linkData) {
            return;
        }
        // 车道种类变换位10时，行人便道清空;
        if ($scope.linkData.kind == 10) {
            $scope.linkData.sidewalks = [];
        }
        // 车道幅宽维护;
        if ($scope.linkData.laneNum) {
            if ($scope.linkData.laneNum == 1) {
                $scope.linkData.width = 30;
            } else if ($scope.linkData.laneNum >= 2 && $scope.linkData.laneNum <= 3) {
                $scope.linkData.width = 55;
            } else {
                $scope.linkData.width = 130;
            }
        } else if ($scope.linkData.laneLeft || $scope.linkData.laneRight) {
            var temp = parseInt($scope.linkData.laneLeft) + parseInt($scope.linkData.laneRight);
            if (temp == 1) {
                $scope.linkData.width = 30;
            } else if (temp >= 2 && temp <= 3) {
                $scope.linkData.width = 55;
            } else {
                $scope.linkData.width = 130;
            }
        } else {
            $scope.linkData.width = 0;
        }


        if ($scope.linkData.forms.length == 0) {
            var newForm = fastmap.dataApi.rdLinkForm({
                linkPid: $scope.linkData.pid,
                formOfWay: 1
            });
            $scope.linkData.forms.push(newForm);
        }
        /* 如果普通限制修改时间段信息*/
        if ($scope.linkData.limits) {
            $.each($scope.linkData.limits, function (i, v) {
                $.each($('#popularLimitedDiv').find('.muti-date'), function (m, n) {
                    if (i == m) {
                        v.timeDomain = $(n).attr('date-str');
                        delete v.pid;
                    }
                });
            });
        }
        /* 如果卡车限制修改时间段信息*/
        if ($scope.linkData.limitTrucks) {
            $.each($scope.linkData.limitTrucks, function (i, v) {
                // console.log(v.pid)
                $.each($('#trafficLimited').find('.muti-date'), function (m, n) {
                    if (i == m) {
                        v.timeDomain = $(n).attr('date-str');
                        // delete v.pid;
                    }
                });
            });
        }
        /* 如果道路名新增*/
        if ($scope.linkData.names) {
        	var flag = false;
            $.each($scope.linkData.names, function (i, v) {
            	if (v.nameGroupid == 0) {
            		flag = true;
            	}
                if (v.pid) delete v.pid;
            });
            if (flag) {
            	swal('保存提示', '道路名不合法(合法的道路名应该来源于道路名库)', 'error');
            	return;
            }
        }

        objectCtrl.save();
        if (!objectCtrl.changedProperty) {
            swal('保存提示', '属性值没有变化，不需要保存！', 'info');
            return;
        }
        if (objectCtrl.changedProperty.limits) {
            if (objectCtrl.changedProperty.limits.length > 0) {
                $.each(objectCtrl.changedProperty.limits, function (i, v) {
                    delete v.pid;
                });
            }
        }
        if (objectCtrl.changedProperty.limitTrucks) {
            if (objectCtrl.changedProperty.limitTrucks.length > 0) {
                $.each(objectCtrl.changedProperty.limitTrucks, function (i, v) {
                    delete v.pid;
                });
            }
        }

        if(objectCtrl.datas !=0){
            dsEdit.batchUpdate(objectCtrl.changedProperty.pids,'RDLINK', objectCtrl.changedProperty).then(
              function (data) {
                  if (data) {
                      rdLink.redraw();
                      relation.redraw();

                      relation.redraw();
                      if (objectCtrl.changedProperty.hasOwnProperty('speedlimits')) {
                          rdLinkSpeedLimit.redraw();
                      }
                      if (shapeCtrl.shapeEditorResult.getFinalGeometry() !== null) {
                          if (typeof map.currentTool.cleanHeight === 'function') {
                              map.currentTool.cleanHeight();
                          }
                          // if (toolTipsCtrl.getCurrentTooltip()) {
                          //     toolTipsCtrl.onRemoveTooltip();
                          // }
                          editLayer.drawGeometry = null;
                          editLayer.clear();
                          shapeCtrl.stopEditing();
                          editLayer.bringToBack();
                          $(editLayer.options._div).unbind();
                          objectCtrl.datas = [];

                          $scope.$emit('SWITCHCONTAINERSTATE', { subAttrContainerTpl: false });
                      }

                  }
              }
            )
        }else{
            dsEdit.update($scope.linkData.pid, 'RDLINK', objectCtrl.changedProperty).then(function (data) {
                if (data) {
                    rdLink.redraw();
                    relation.redraw();
                    if (objectCtrl.changedProperty.hasOwnProperty('speedlimits')) {
                        rdLinkSpeedLimit.redraw();
                    }
                    if (shapeCtrl.shapeEditorResult.getFinalGeometry() !== null) {
                        if (typeof map.currentTool.cleanHeight === 'function') {
                            map.currentTool.cleanHeight();
                        }
                        // if (toolTipsCtrl.getCurrentTooltip()) {
                        //     toolTipsCtrl.onRemoveTooltip();
                        // }
                        editLayer.drawGeometry = null;
                        editLayer.clear();
                        shapeCtrl.stopEditing();
                        editLayer.bringToBack();
                        $(editLayer.options._div).unbind();
                    }
                    dsEdit.getByPid($scope.linkData.pid, 'RDLINK').then(function (ret) {
                        if (ret) {
                            objectCtrl.setCurrentObject('RDLINK', ret);
                            objectCtrl.setOriginalData(objectCtrl.data.getIntegrate());
                        }
                    });
                    // objectCtrl.setOriginalData(objectCtrl.data.getIntegrate());
                    $scope.$emit('SWITCHCONTAINERSTATE', { subAttrContainerTpl: false });
                }
            });
        }






    };
    $scope.delete = function () {
        if (!$scope.linkData) {
            return;
        }
        dsEdit.delete($scope.linkData.pid, 'RDLINK', 1).then(function (data) {
            if (data) {
                rdLink.redraw();
                rdNode.redraw();
                rdCross.redraw();
                relation.redraw();
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures.length = 0;
                if (map.floatMenu) {
                    map.removeLayer(map.floatMenu);
                    map.floatMenu = null;
                }
                if (map.currentTool) {
                    map.currentTool.disable();// 禁止当前的参考线图层的事件捕获
                }
                // 清空编辑图层和shapeCtrl
                editLayer.drawGeometry = null;
                shapeCtrl.stopEditing();
                editLayer.bringToBack();
                $(editLayer.options._div).unbind();
                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                editLayer.clear();
                $scope.$emit('SWITCHCONTAINERSTATE', { attrContainerTpl: false, subAttrContainerTpl: false });
                $scope.linkData = null;

                // $scope.$emit("SWITCHCONTAINERSTATE",{
                //     "attrContainerTpl":false,
                //     "subAttrContainerTpl":false
                // });
            }
        });
    };
    $scope.changeLink = function (ind, linkId) {
        $scope.brigeIndex = ind;
        dsEdit.getByPid(linkId, 'RDLINK').then(function (data) {
            if (data) {
                var linkArr = data.geometry.coordinates,
                    points = [];
                for (var i = 0, len = linkArr.length; i < len; i++) {
                    var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                    points.push(point);
                }
                map.panTo({
                    lat: points[0].y,
                    lon: points[0].x
                });
                var line = fastmap.mapApi.lineString(points);
                selectCtrl.onSelected({
                    geometry: line,
                    id: data.pid
                });
                objectCtrl.setCurrentObject('RDLINK', data);
                var linkObj = {
                    loadType: 'attrTplContainer',
                    propertyCtrl: appPath.road + 'ctrls/attr_link_ctrl/rdLinkCtrl',
                    propertyHtml: appPath.root + appPath.road + 'tpls/attr_link_tpl/rdLinkTpl.html'
                };
                $scope.$emit('transitCtrlAndTpl', linkObj);
            }
        });
    };
    $scope.cancel = function () {};
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeLinkData);
}]);
