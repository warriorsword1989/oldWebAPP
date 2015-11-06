/**
 * Created by liwanchong on 2015/10/28.
 */
var selectApp = angular.module("mapApp", ['oc.lazyLoad']);
selectApp.controller("selectShapeController", ["$scope", '$ocLazyLoad', function ($scope, $ocLazyLoad) {
    $scope.selectShape = function (type) {
        var selectCtrl = new fastmap.uikit.SelectController();
        var objCtrl = new fastmap.uikit.ObjectEditController();
        var layerCtrl = fastmap.uikit.LayerController();
        $(":button").removeClass("btn btn-default active").addClass("btn btn-default");
        $("#"+type).addClass("btn btn-default active");
        if (type === "link") {
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
            layerCtrl.pushLayerFront('referenceLine');
            var rdLink = layerCtrl.getLayerById('referenceLine');
            if(typeof map.currentTool.cleanHeight==="function") {
                map.currentTool.cleanHeight();
            }
            map.currentTool= new fastmap.uikit.SelectPath({map: map, currentEditLayer: rdLink});
            map.currentTool.enable();
            rdLink.options.selectType = 'link';
            $scope.$parent.$parent.objectEditURL = "";
            rdLink.options.editable = true;
            rdLink.on("getId", function (data) {
                $scope.data = data;
                Application.functions.getRdObjectById(data.id, "RDLINK", function (data) {
                    var linkArr = data.data.geometry.coordinates, points = [];
                    for (var i = 0, len = linkArr.length; i < len; i++) {
                        var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                        points.push(point);
                    }
                    var line = fastmap.mapApi.lineString(points);

                    selectCtrl.onSelected({geometry: line, id: $scope.data.id});
                    objCtrl.setCurrentObject(data);
                    $ocLazyLoad.load('ctrl/linkObjectCtrl').then(function () {

                        $scope.$parent.$parent.objectEditURL = "js/tepl/currentObjectTepl.html";
                        if ($scope.$parent.$parent.updateLinkData !== "") {
                            $scope.$parent.$parent.updateLinkData(data.data);
                        }

                    })


                })

            })


        }

        if (type === "node") {
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
            var rdLink = layerCtrl.getLayerById('referenceLine');
            rdLink.options.selectType = 'node';
            rdLink.options.editable = true;
        }
        if (type === "relation") {
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
            layerCtrl.pushLayerFront('referencePoint');
            var rdLink = layerCtrl.getLayerById('referencePoint');
            if(typeof map.currentTool.cleanHeight==="function") {
                map.currentTool.cleanHeight();
            }
            map.currentTool = new fastmap.uikit.SelectNode({map: map, currentEditLayer: rdLink});
            map.currentTool.enable();
            rdLink.options.selectType = 'relation';
            rdLink.options.editable = true;
            $scope.$parent.$parent.objectEditURL = "";
            rdLink.on("getNodeId", function (data) {
                $scope.data = data;
                $scope.tips = data.tips;
                Application.functions.getRdObjectById(data.id, "RDRESTRICTION", function (data) {
                    objCtrl.setCurrentObject(data.data);
                    $scope.$parent.$parent.rdRestrictData = data.data;
                    $ocLazyLoad.load('ctrl/objectEditCtrl').then(function () {
                        if ($scope.tips === 0) {
                            $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";
                            if ($scope.$parent.$parent.updateLinkData !== "") {
                                $scope.$parent.$parent.updateLinkData(data.data);
                            }
                        } else if ($scope.type === 1) {
                            $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfTruckTepl.html";
                        }

                    })
                })


            })
        }

    };
}])