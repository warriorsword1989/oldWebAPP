var app = angular.module('mapApp', ['oc.lazyLoad', 'ui.layout']);
app.controller('generalController', ['$scope', '$ocLazyLoad', function ($scope, $ocLazyLoad) {
    appInit()
    dragF('toolsDiv');
    dragF('toolsDiv1');
    dragF("popToolBar");
    dragF1('popoverTips', 'parentId');
    $scope.dataTipsURL = "";//左上角弹出框的ng-include地址
    $scope.objectEditURL = "";//属性栏的ng-include地址
    $scope.save = "";//保存方法
    $scope.delete = "";//删除方法
    $scope.cancel = "";//取消
    $scope.rdRestrictData ={};//交限对象
    $scope.dataTipsTest = {};
    $scope.updateLinkData = "";
    $scope.outFlag = false;//是否可监听

    $scope.$on("dataTipsToParent", function (event, data) {
        $scope.$broadcast("dataTipsToChild", data);
    });
    //登录时

    $ocLazyLoad.load('ctrl/errorCheckCtrl').then(function () {
        $scope.errorCheckTab = 'js/tepl/errorCheckTepl.html';
        $ocLazyLoad.load('ctrl/filedsResultCtrl').then(function () {
                $scope.layersURL = 'js/tepl/filedsResultTepl.html';
                $ocLazyLoad.load('ctrl/modifyToolCtrl').then(function () {
                        $scope.modifyToolURL = 'js/tepl/modifyToolTepl.html';
                        $scope.layersURL = 'js/tepl/filedsResultTepl.html';
                        $ocLazyLoad.load('ctrl/selectShapeCtrl').then(function () {
                                $scope.selectShapeURL = 'js/tepl/selectShapeTepl.html';
                                $ocLazyLoad.load('ctrl/addShapeCtrl').then(function () {
                                        $scope.addShapeURL = 'js/tepl/addShapeTepl.html';

                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    });






    $scope.changeLayers = function (layers) {

        if (layers === "taskLayers") {
            $ocLazyLoad.load('ctrl/taskLayersCtrl').then(function () {
                    $scope.layersURL = 'js/tepl/taskLayersTepl.html';
                }
            );
        } else if (layers === "resultLayers") {
            $ocLazyLoad.load('ctrl/filedsResultCtrl').then(function () {
                    $scope.layersURL = 'js/tepl/filedsResultTepl.html';
                }
            );
        }
        else if (layers === "referenceLayers") {
            $ocLazyLoad.load('ctrl/referenceLayersCtrl').then(function () {
                    $scope.layersURL = 'js/tepl/referenceLayersTepl.html';
                }
            );
        }


    };
    $scope.showTab = function (tab) {
        if (tab === "outPut") {

            $ocLazyLoad.load('ctrl/outPutCtrl').then(function () {
                    $scope.outputTab = 'js/tepl/outputTepl.html';
                }
            );
        } else if (tab === "errorCheck") {
            $ocLazyLoad.load('ctrl/errorCheckCtrl').then(function () {
                    $scope.errorCheckTab = 'js/tepl/errorCheckTepl.html';
                }
            );
        }

    };
}])
var map = null;
function appInit(){

    map = L.map('map',{ attributionControl: false}).setView([39.96112764136087, 116.27493047173148], 17);
    var layerCtrl = new fastmap.uikit.LayerController({config:Application.layersConfig});
    //layerCtrl.getLayerById('work').options.zIndex = 9
    //layerCtrl.getLayerById('work').addTo(map);
    layerCtrl.on('layerOnShow',function(event){
        if(event.flag == true){
            map.addLayer(event.layer);
        }else{
            map.removeLayer(event.layer);
        }
    })
    for(var layer in layerCtrl.getVisibleLayers()){
        map.addLayer(layerCtrl.getVisibleLayers()[layer]);
    }



}

var map = null;
function dragF(id) {
    var $dragDiv = $('#' + id),
        $parentDiv = $('#map');
    var $drag = $dragDiv.find('div');
    $drag.on({
        mousedown: function (e) {
            e.preventDefault();

            var t = $dragDiv.offset(),
                o = e.pageX - t.left,
                i = e.pageY - t.top;
            var df = e.target.id;
            if (df !== "map") {
                $dragDiv.on("mousemove.drag", function (e) {
                    map.dragging.disable();
                    e.stopPropagation();
                    var sunTop = e.pageY - i,
                        sunLeft = e.pageX - o;
                    if (sunTop > $parentDiv.offset().top && sunTop + $dragDiv.height() < $parentDiv.offset().top + $parentDiv.height() && sunLeft > $parentDiv.offset().left && sunLeft + $dragDiv.width() < $parentDiv.offset().left + $parentDiv.width()) {
                        $dragDiv.offset({
                            top: e.pageY - i,
                            left: e.pageX - o
                        })

                    }

                })
            }

        },
        mouseup: function () {
            map.dragging.enable();
            $dragDiv.unbind("mousemove.drag");
        }
    });
}
function dragF1(id,pId) {
    var $dragDiv = $('#' + id),
        $parentDiv = $('#'+pId);
    var $drag = $dragDiv.find('div');
    $drag.on({
        mousedown: function (e) {
            e.preventDefault();

            var t = $dragDiv.offset(),
                o = e.pageX - t.left,
                i = e.pageY - t.top;
            var df = e.target.id;
            if (df !== "pId") {
                $dragDiv.on("mousemove.drag", function (e) {
                    map.dragging.disable();
                    e.stopPropagation();
                    var sunTop = e.pageY - i,
                        sunLeft = e.pageX - o;
                    if (sunTop > $parentDiv.offset().top && sunTop + $dragDiv.height() < $parentDiv.offset().top + $parentDiv.height() && sunLeft > $parentDiv.offset().left && sunLeft + $dragDiv.width() < $parentDiv.offset().left + $parentDiv.width()) {
                        $dragDiv.offset({
                            top: e.pageY - i,
                            left: e.pageX - o
                        })

                    }

                })
            }

        },
        mouseup: function () {
            map.dragging.enable();
            $dragDiv.unbind("mousemove.drag");
        }
    });
}


