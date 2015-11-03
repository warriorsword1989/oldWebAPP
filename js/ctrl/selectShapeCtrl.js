/**
 * Created by liwanchong on 2015/10/28.
 */
var selectApp = angular.module("mapApp", ['oc.lazyLoad']);
selectApp.controller("selectShapeController", ["$scope", '$ocLazyLoad', function ($scope, $ocLazyLoad) {

    $scope.selectShape = function (type) {
        var selectCtrl = new fastmap.uikit.SelectController();
        var objCtrl = new fastmap.uikit.ObjectEditController();
        var layerCtrl = fastmap.uikit.LayerController();
        if (type === "link") {
            var rdLink = layerCtrl.getLayerById('referenceLine');
            var sTools = new fastmap.uikit.SelectPath({map:map, currentEditLayer:rdLink});
            sTools.enable();
            rdLink.options.selectType = 'link';
            $scope.$parent.$parent.objectEditURL = "";
            rdLink.options.editable = true;
            rdLink.on("getId",function(data) {
                $scope.data = data;
                Application.functions.getRdObjectById(data.id, "RDLINK", function (data) {
                    var linkArr = data.data.geometry.coordinates, points = [];
                    for (var i = 0, len = linkArr.length; i < len; i++) {
                        var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                        points.push(point);
                    }
                    var line = fastmap.mapApi.lineString(points);

                    selectCtrl.onSelected({geometry:line,id:$scope.data.id});
                    objCtrl.setCurrentObject(data);
                    $ocLazyLoad.load('ctrl/linkObjectCtrl').then(function () {
                        $scope.$parent.$parent.objectEditURL = "js/tepl/currentObjectTepl.html";
                    })
                })

            })



        }

        if (type === "node") {

            var rdLink = layerCtrl.getLayerById('referenceLine');
            rdLink.options.selectType = 'node';
            rdLink.options.editable = true;
        }
        if (type === "relation") {

            var rdLink = layerCtrl.getLayerById('referencePoint');
            rdLink.options.selectType = 'relation';
            rdLink.options.editable = true;
            $scope.$parent.$parent.objectEditURL = "";
            rdLink.on("getId",function(data) {
                $scope.data = data;

                Application.functions.getRdObjectById(data.id, "RDRESTRICTION", function (data) {
                        objCtrl.setCurrentObject(data.data);
                    $ocLazyLoad.load('ctrl/objectEditCtrl').then(function () {
                        $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";
                    })
                })


            })
        }

    };
}])