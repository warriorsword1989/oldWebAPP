/**
 * Created by liwanchong on 2015/10/28.
 */
var addShapeApp = angular.module('mapApp', ['oc.lazyLoad']);
addShapeApp.controller("addShapeController", ['$scope', '$ocLazyLoad', function ($scope, $ocLazyLoad) {
        var layerCtrl = fastmap.uikit.LayerController();
        var outPutCtrl = fastmap.uikit.OutPutController();
        var featCodeCtrl = new fastmap.uikit.FeatCodeController();
        var shapectl = fastmap.uikit.ShapeEditorController();
        var objEditCtrl = fastmap.uikit.ObjectEditController();
        var checkCtrl = fastmap.uikit.CheckResultController();
        $scope.limitRelation = {};
        $scope.addShape = function (type) {
            if (type === "restriction") {
                $scope.limit = {};
                outPutCtrl.pushOutput({label: "正要新建交限,先选择线"});
                var rdLink = layerCtrl.getLayerById('referenceLine');
                var sTools = new fastmap.uikit.SelectForRestriction({map: map, currentEditLayer: rdLink});
                sTools.enable();
                $scope.excitLineArr = [];
                rdLink.on("getId", function (data) {
                    if (data.index === 0) {
                        $scope.limitRelation.inLinkPid = parseInt(data.id);
                        outPutCtrl.pushOutput({label: "已经选择进入线,选择进入点"});
                    } else if (data.index === 1) {
                        $scope.limitRelation.nodePid = parseInt(data.id);
                        outPutCtrl.pushOutput({label: "已经选择进入点,选择退出线"});
                        //setTimeout(function () {
                        //    $ocLazyLoad.load('ctrl/addLimitedPropertyCtrl').then(function () {
                        //            $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";
                        //
                        //        }
                        //    );
                        //}, 100)
                    } else {
                        $scope.excitLineArr.push(parseInt(data.id));
                        $scope.limitRelation.outLinkPids = $scope.excitLineArr;
                        outPutCtrl.pushOutput({label: "已选退出线"});
                    }
                    featCodeCtrl.setFeatCode($scope.limitRelation);
                })

            }
            else if (type === "link") {
                if (shapectl.shapeEditorResult) {
                    var editLyer = layerCtrl.getLayerById('edit');
                    layerCtrl.pushLayerFront('edit');
                }
                shapectl.setEditingType('drawPath');
                shapectl.startEditing();
            }

            $(document).bind('keypress',
                function (event) {
                    if (event.keyCode == 32) {
                        if (type == 'link') {
                            var link = shapectl.shapeEditorResult.getFinalGeometry();
                            var coordinate = [];
                            for (var index in link.components) {
                                coordinate.push([link.components[index].x, link.components[index].y]);
                            }

                            var param = {
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
                            Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                                var outputcontroller = new fastmap.uikit.OutPutController({});
                                outputcontroller.pushOutput(data.data);
                                layerCtrl.getLayerById('edit').bringToBack()

                                $(layerCtrl.getLayerById('edit').options._div).unbind();
                            });

                        }
                        else if (type === "restriction") {
                            var param = {
                                "command": "createrestriction",
                                "projectId": 1,
                                "data": $scope.limitRelation
                            }
                            Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {

                                var pid = data.data.log[0].pid;
                                checkCtrl.setCheckResult(data);
                                outPutCtrl.pushOutput(data.data.log[0]);
                                Application.functions.getRdObjectById(pid, "RDRESTRICTION", function (data) {
                                    objEditCtrl.setCurrentObject(data.data);
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
        }
    }]
)
