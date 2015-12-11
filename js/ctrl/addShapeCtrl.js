/**
 * Created by liwanchong on 2015/10/28.
 */
var addShapeApp = angular.module('mapApp', ['oc.lazyLoad']);
addShapeApp.controller("addShapeController", ['$scope', '$ocLazyLoad', function ($scope, $ocLazyLoad) {
        var layerCtrl = fastmap.uikit.LayerController();
        var outPutCtrl = fastmap.uikit.OutPutController();
        var featCodeCtrl = new fastmap.uikit.FeatCodeController();

        var shapectl = fastmap.uikit.ShapeEditorController();
        var selectCtrl = new fastmap.uikit.SelectController();
        var objEditCtrl = fastmap.uikit.ObjectEditController();
        var checkCtrl = fastmap.uikit.CheckResultController();
        var tooltipsCtrl=fastmap.uikit.ToolTipsController();
        $scope.limitRelation = {};
        $scope.type = "";
        $scope.addShapeClaArr = $scope.$parent.$parent.classArr;
        $scope.addShape = function (type,num) {
            tooltipsCtrl.setMap(map);
            if (type === "restriction") {
                map.currentTool.disable();//禁止当前的参考线图层的事件捕获
                if (typeof map.currentTool.cleanHeight === "function") {
                    map.currentTool.cleanHeight();
                }
                $scope.type = "restriction";
                $scope.$parent.$parent.changeBtnClass(num);
                $scope.limit = {};
               // outPutCtrl.pushOutput({label: "正要新建交限,先选择线"});
                shapectl.stopEditing();
                if(tooltipsCtrl.getCurrentTooltip()){
                    tooltipsCtrl.onRemoveTooltip();
                }
                tooltipsCtrl.setEditEventType('restriction');
                tooltipsCtrl.setCurrentTooltip('正要新建交限,先选择线！');
                var rdLink = layerCtrl.getLayerById('referenceLine');
                map.currentTool = new fastmap.uikit.SelectForRestriction({map: map, currentEditLayer: rdLink});
                map.currentTool.enable();
                $scope.excitLineArr = [];
                rdLink.on("getId", function (data) {
                    if (data.index === 0) {
                        $scope.limitRelation.inLinkPid = parseInt(data.id);
                        //outPutCtrl.pushOutput({label: "已经选择进入线,选择进入点"});
                        tooltipsCtrl.setStyleTooltip("color:black;");
                        tooltipsCtrl.setChangeInnerHtml("已经选择进入线,选择进入点!");
                    } else if (data.index === 1) {
                        $scope.limitRelation.nodePid = parseInt(data.id);
                        //outPutCtrl.pushOutput({label: "已经选择进入点,选择退出线"});
                        tooltipsCtrl.setStyleTooltip("color:red;");
                        tooltipsCtrl.setChangeInnerHtml("已经选择进入点,选择退出线!");
                    } else if (data.index > 1) {
                        $scope.excitLineArr.push(parseInt(data.id));
                        $scope.limitRelation.outLinkPids = $scope.excitLineArr;
                        //tooltipsCtrl.setRestrictionIndex(2);
                        //outPutCtrl.pushOutput({label: "已选退出线"});
                        tooltipsCtrl.setChangeInnerHtml("已选退出线,点击空格键保存!");
                    }
                    featCodeCtrl.setFeatCode($scope.limitRelation);
                })

            }else if(type==="speedLimit"){
                $ocLazyLoad.load('ctrl/speedLimitCtrl').then(function () {
                    $scope.$parent.$parent.objectEditURL = "js/tepl/speedLimitTepl.html";
                });
            }
            else if (type === "link") {
                $scope.type = "link";
                map.currentTool.disable();//禁止当前的参考线图层的事件捕获
                if (typeof map.currentTool.cleanHeight === "function") {
                    map.currentTool.cleanHeight();
                }
                $scope.$parent.$parent.changeBtnClass(num);
                if (shapectl.shapeEditorResult) {
                    shapectl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                    selectCtrl.selectByGeometry(shapectl.shapeEditorResult.getFinalGeometry());
                    var editLyer = layerCtrl.getLayerById('edit');
                    layerCtrl.pushLayerFront('edit');
                }
                //因为线没有stopEditing，innerHTML是选择线的话就清空提示
                if(tooltipsCtrl.getCurrentTooltip()){
                    tooltipsCtrl.onRemoveTooltip();
                }
                shapectl.setEditingType('drawPath');
                shapectl.startEditing();
                tooltipsCtrl.setEditEventType('drawPath');
                tooltipsCtrl.setCurrentTooltip('开始画线！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("双击地图结束画线!");
                tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存画线,或者按ESC键取消!");

            }
        }
        $(document).bind('keypress',
            function (event) {
                //ESC 键取消

                if (event.keyCode == 32) {
                    if ($scope.type == 'link') {

                        var link = shapectl.shapeEditorResult.getFinalGeometry();
                        var coordinate = [];
                        for (var index in link.components) {
                            coordinate.push([link.components[index].x, link.components[index].y]);
                        }

                        var paramOfLink = {
                            "command": "createlink",
                            "projectId": 1,
                            "data": {
                                "eNodePid": 0,
                                "sNodePid": 0,
                                "geometry": {"type": "LineString", "coordinates": coordinate}
                            }
                        }
                        //结束编辑状态
                        shapectl.stopEditing();
                        tooltipsCtrl.onRemoveTooltip();
                        Application.functions.saveLinkGeometry(JSON.stringify(paramOfLink), function (data) {
                            var outputcontroller = new fastmap.uikit.OutPutController({});
                            var rdLink = layerCtrl.getLayerById('referenceLine');
                            rdLink.redraw();
                            var info=[];
                            $.each(data.data.log,function(i,item){
                                //info.push("编号:"+item.pid+"; 类型："+item.type+"; 操作："+item.op);
                                info.push(item.op+item.type+"(pid:"+item.pid+")");
                            });
                            outputcontroller.pushOutput(info);
                            layerCtrl.getLayerById('edit').bringToBack()

                            $(layerCtrl.getLayerById('edit').options._div).unbind();
                            $scope.type = "";
                        });

                    } else if ($scope.type === "restriction") {
                        tooltipsCtrl.onRemoveTooltip();
                        var paramOfRestrict = {
                            "command": "createrestriction",
                            "projectId": 1,
                            "data": $scope.limitRelation
                        }
                        Application.functions.saveLinkGeometry(JSON.stringify(paramOfRestrict), function (data) {

                            var pid = data.data.log[0].pid;
                            checkCtrl.setCheckResult(data);
                            //清空上一次的操作
                            $scope.excitLineArr.length = 0;
                            map.currentTool.cleanHeight();
                            map.currentTool.disable();
                            var restrict = layerCtrl.getLayerById('referencePoint');
                            restrict.redraw();
                            var info=[];
                            if(data.data){
                                $.each(data.data.log,function(i,item){
                                    if(item.pid){
                                        info.push(item.op+item.type+"(pid:"+item.pid+")");
                                    }else{
                                        info.push(item.op+item.type+"(rowId:"+item.rowId+")");
                                    }
                                });
                            }else{
                                info.push(data.errmsg + data.errid);
                            }
                            //outPutCtrl.pushOutput(data.data.log[0]);
                            outPutCtrl.pushOutput(info);
                            if(outputcontroller.updateOutPuts!=="") {
                                outputcontroller.updateOutPuts();
                            }
                            Application.functions.getRdObjectById(pid, "RDRESTRICTION", function (data) {
                                objEditCtrl.setCurrentObject(data.data);
                                $scope.type = "";
                                $scope.$parent.$parent.rdRestrictData = data.data;
                                $ocLazyLoad.load('ctrl/objectEditCtrl').then(function () {
                                    $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";
                                    if ($scope.$parent.$parent.updateLinkData !== "") {
                                        $scope.$parent.$parent.updateLinkData(data.data);
                                    }

                                })
                            })

                        });
                    }
                }

            });
    }]
)
