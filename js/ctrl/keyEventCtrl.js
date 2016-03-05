/**
 * Created by liwanchong on 2015/12/11.
 */
var ketEventApp = angular.module('mapApp', ['oc.lazyLoad']);
ketEventApp.controller('keyEventController', ['$scope', '$ocLazyLoad', function ($scope, $ocLazyLoad) {
    //取消
    var layerCtrl = fastmap.uikit.LayerController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var featCodeCtrl = fastmap.uikit.FeatCodeController();

    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var selectCtrl = fastmap.uikit.SelectController();
    var objEditCtrl = fastmap.uikit.ObjectEditController();
    var checkCtrl = fastmap.uikit.CheckResultController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var restrict = layerCtrl.getLayerById('referenceLine');
    var editLayer = layerCtrl.getLayerById('edit');
    $(document).bind('keydown',
        function (event) {
            if (event.keyCode == 27) {
                map.currentTool.cleanHeight();
                layerCtrl.getLayerById('edit').drawGeometry = null;
                layerCtrl.getLayerById('edit').clear();

                shapeCtrl.stopEditing();
                layerCtrl.getLayerById('edit').bringToBack();

                $(layerCtrl.getLayerById('edit').options._div).unbind();
            }
        });
    $(document).bind('keypress',

        function (event) {
            if (event.keyCode == 32) {
                if (shapeCtrl.editType == 'link') {

                    var link = shapeCtrl.shapeEditorResult.getFinalGeometry();
                    var coordinate = [];
                    for (var index in link.components) {
                        coordinate.push([link.components[index].x, link.components[index].y]);
                    }

                    var paramOfLink = {
                        "command": "createlink",
                        "projectId": 11,
                        "data": {
                            "eNodePid": 0,
                            "sNodePid": 0,
                            "geometry": {"type": "LineString", "coordinates": coordinate}
                        }
                    }
                    //结束编辑状态
                    shapectl.stopEditing();
                    Application.functions.saveLinkGeometry(JSON.stringify(paramOfLink), function (data) {
                        rdLink.redraw();
                        var info = null;
                        if (data.errcode==0) {
                            var sinfo={
                                "op":"修改道路link成功",
                                "type":"",
                                "pid": ""
                            };
                            data.data.log.push(sinfo);
                            info=data.data.log;
                        }else{
                            info=[{
                                "op":data.errcode,
                                "type":data.errmsg,
                                "pid": data.errid
                            }];
                        }
                        outPutCtrl.pushOutput(info);
                        if(outPutCtrl.updateOutPuts!=="") {
                            outPutCtrl.updateOutPuts();
                        }
                        layerCtrl.getLayerById('edit').bringToBack()

                        $(layerCtrl.getLayerById('edit').options._div).unbind();
                    });

                } else if (shapeCtrl.editType === "restriction") {
                    var paramOfRestrict = {
                        "command": "createrestriction",
                        "projectId": 11,
                        "data": $scope.limitRelation
                    }
                    Application.functions.saveLinkGeometry(JSON.stringify(paramOfRestrict), function (data) {

                        var pid = data.data.log[0].pid;
                        checkCtrl.setCheckResult(data);
                        //清空上一次的操作
                        $scope.excitLineArr.length = 0;
                        map.currentTool.cleanHeight();
                        map.currentTool.disable();
                        restrict.redraw();
                        var info = null;
                        if (data.errcode==0) {
                            var sinfo={
                                "op":"修改交限成功",
                                "type":"",
                                "pid": ""
                            };
                            data.data.log.push(sinfo);
                            info=data.data.log;
                        }else{
                            info=[{
                                "op":data.errcode,
                                "type":data.errmsg,
                                "pid": data.errid
                            }];
                        }
                        outPutCtrl.pushOutput(info);
                        if(outPutCtrl.updateOutPuts!=="") {
                            outPutCtrl.updateOutPuts();
                        }
                        Application.functions.getRdObjectById(pid, "RDRESTRICTION", function (data) {
                            objEditCtrl.setCurrentObject(data.data);
                            if(objEditCtrl.updateObject!=="") {
                                objEditCtrl.updateObject();
                            }
                            $scope.type = "";
                            $ocLazyLoad.load('ctrl/objectEditCtrl').then(function () {
                                $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";

                            })
                        })

                    });
                }
            }

        });
}]);