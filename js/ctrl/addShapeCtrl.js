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
            if (type === "tips") {
                setTimeout(function () {
                    $ocLazyLoad.load('ctrl/addLimitedPropertyCtrl').then(function () {
                            $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";

                        }
                    );
                }, 100)
                $scope.limit = {};
                outPutCtrl.pushOutput({label: "正要新建交限,先选择线"});
                var rdLink = layerCtrl.getLayerById('referenceLine')

                var sTools = new fastmap.uikit.SelectPath({map: map, currentEditLayer: rdLink});
                sTools.enable();
                rdLink.options.selectType = 'link';
                rdLink.options.editable = true;

                rdLink.on("getId", function (data) {
                    if ($scope.relationFlag) {
                        $scope.limit.enterPid = data.id;
                        outPutCtrl.pushOutput({label: "这是进入线"});
                        //rdLink.options.editable = false;
                        $scope.dotFlag = true;
                        $scope.relationFlag = false;
                        $scope.$parent.$parent.outFlag = true;
                        //if ($scope.dotFlag) {
                        //    rdLink.options.selectType = 'node';
                        //    rdLink.options.editable = true;
                        //    rdLink.on('getId', function (data) {
                        //        $scope.limit.pid = data.id;
                        //        $scope.limit.inLinkPid = data.id;
                        //        outPutCtrl.pushOutput({label: "选择了进入的node"});
                        //        rdLink.off("getId");
                        //        $scope.relationFlag = false;
                        //        rdLink.options.selectType = 'link';
                        //        rdLink.options.editable = true;
                        //        featCodeCtrl.setFeatCode($scope.limit);
                        //        $scope.outFlag = true;
                        //    })
                        //}
                    }

                });
            }
            else if (type === "link") {
                if (shapectl.shapeEditorResult) {
                    var editLyer = layerCtrl.getLayerById('edit');
                    layerCtrl.pushLayerFront('edit');
                }
                shapectl.setEditingType('drawPath');
                shapectl.startEditing();
            }

        }
    }]
)
