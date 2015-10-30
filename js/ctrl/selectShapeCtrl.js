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
            var rdLink;
            for (var layer in layerCtrl.layers) {
                if (layerCtrl.layers[layer].options['id'] === 'referenceLine') {
                    rdLink = layerCtrl.layers[layer];
                    break;
                }
            }
            $scope.$parent.$parent.objectEditURL = "";
            rdLink.editable = true;
            rdLink.on("getLinkId",function(data) {
                Application.functions.getRdLinkById(data.id, "RDLINK", function (data) {
                    var linkArr = data.data.geometry.coordinates, points = [];
                    for (var i = 0, len = linkArr.length; i < len; i++) {
                        var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                        points.push(point);
                    }
                    var line = fastmap.mapApi.lineString(points);
                    var editLayer = new fastmap.mapApi.EditLayer();
                    map.addLayer(editLayer);
                    editLayer.drawGeometry = line;
                    editLayer.draw(line, editLayer);
                    selectCtrl.onSelected(line);
                    objCtrl.setCurrentObject(data);
                    $ocLazyLoad.load('ctrl/linkObjectCtrl').then(function () {
                        $scope.$parent.$parent.objectEditURL = "js/tepl/currentObjectTepl.html";
                    })
                })

            })



        }
    };
}])