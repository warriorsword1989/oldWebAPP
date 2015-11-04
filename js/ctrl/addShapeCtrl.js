/**
 * Created by liwanchong on 2015/10/28.
 */
var addShapeApp = angular.module('mapApp', ['oc.lazyLoad']);
addShapeApp.controller("addShapeController", ['$scope', '$ocLazyLoad', function ($scope, $ocLazyLoad) {
        var layerCtrl = fastmap.uikit.LayerController();
        var outPutCtrl = fastmap.uikit.OutPutController();
        var featCodeCtrl = new fastmap.uikit.FeatCodeController();
        var shapectl = fastmap.uikit.ShapeEditorController();
        $scope.relationFlag = true;
        $scope.dotFlag = false;
        $scope.outFlag = false;
        $scope.addShape = function (type) {
            if (type === "restriction") {
                setTimeout(function () {
                    $ocLazyLoad.load('ctrl/addLimitedPropertyCtrl').then(function () {
                            $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";

                        }
                    );
                }, 100)
                $scope.limit = {};
                outPutCtrl.pushOutput({label: "正要新建交限,先选择线"});
                var rdLink = layerCtrl.getLayerById('referenceLine');
                var sTools = new fastmap.uikit.SelectForRestriction({map: map, currentEditLayer: rdLink});
                sTools.enable();

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
                function(event){
                    if(event.keyCode==32){
                        //http://192.168.4.130/FosEngineWeb/pdh/obj/edit?parameter=
                        //// {"command":"createlink","projectId":1,"data":{"geometry":"","eNodePid":0,"sNodePid":0}}

                        if(type == 'link'){
                            var link = shapectl.shapeEditorResult.getFinalGeometry();
                            var coordinate = [];
                            for(var index in link.components){
                                coordinate.push([link.components[index].x, link.components[index].y]);
                            }

                            var param  = {
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
                            Application.functions.saveLinkGeometry(JSON.stringify(param),function(data){
                                var outputcontroller = new fastmap.uikit.OutPutController({});
                                outputcontroller.pushOutput(data.data);
                                layerCtrl.getLayerById('edit').bringToBack()

                                $(layerCtrl.getLayerById('edit').options._div).unbind();
                            });

                        }
                    }

                });
        }
    }]
)
