var app = angular.module('mapApp', ['oc.lazyLoad', 'ui.layout']);
app.controller('generalController', ['$scope', '$ocLazyLoad', function ($scope, $ocLazyLoad) {
    appInit()
    dragF('toolsDiv');
    //dragF('toolsDiv1');
    //dragF("popToolBar");
    //dragF1('popoverTips', 'parentId');
    $scope.dataTipsURL = "";//左上角弹出框的ng-include地址
    $scope.objectEditURL = "";//属性栏的ng-include地址
    $scope.save = "";//保存方法
    $scope.delete = "";//删除方法
    $scope.cancel = "";//取消
    $scope.rdRestrictData = {};//交限对象
    $scope.rowkeyOfDataTips = "";
    $scope.updateLinkData = "";
    $scope.updateDataTips = "";
    $scope.updateRestrictData = "";
    $scope.outFlag = false;//是否可监听
    $scope.toolsFlag = true;
    $scope.classArr = [false, false, false, false,false,false,false,false,false,false,false];//按钮样式的变化
    $scope.changeBtnClass=function(id) {
        for(var claFlag= 0,claLen=$scope.classArr.length;claFlag<claLen;claFlag++) {
            if(claFlag===id) {
                $scope.classArr[claFlag] = !$scope.classArr[claFlag];
            }else{
                $scope.classArr[claFlag] = false;
            }
        }
    };
    var ly = fastmap.uikit.LayerController();
    var shapeCtrl = new fastmap.uikit.ShapeEditorController();

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


    $(document).bind('keydown',
        function (event) {
            if (event.keyCode == 27) {
                shapeCtrl.stopEditing();
                ly.getLayerById('edit').bringToBack()

                $(ly.getLayerById('edit').options._div).unbind();

            }
        });


    $scope.changeLayers = function (layers) {

        if (layers === "taskLayers") {
            $ocLazyLoad.load('ctrl/taskLayersCtrl').then(function () {
                    $scope.layersURL = 'js/tepl/taskLayersTepl.html';
                }
            );
        } else if (layers === "resultLayers") {
            $("#referenceLayerDiv").removeClass("active");
            $("#resultLayerDiv").addClass("active");
            $ocLazyLoad.load('ctrl/filedsResultCtrl').then(function () {
                    $scope.layersURL = 'js/tepl/filedsResultTepl.html';
                }
            );
            $("#resultLayers").css("background-color","#49C2FC");
            $("#referenceLayers").css("background-color","#D4D4D4");
        }
        else if (layers === "referenceLayers") {
            $("#resultLayerDiv").removeClass("active");
            $("#referenceLayerDiv").addClass("active");
            $ocLazyLoad.load('ctrl/referenceLayersCtrl').then(function () {
                    $scope.layersURL = 'js/tepl/referenceLayersTepl.html';
                }
            );
            $("#referenceLayers").css("background-color","#49C2FC");
            $("#resultLayers").css("background-color","#D4D4D4");
        }


    };
    $scope.showTab = function (tab) {
        if (tab === "outPut") {
            $("#errorClear").show();
            $("#immediatelyCheck").hide();
            $ocLazyLoad.load('ctrl/outPutCtrl').then(function () {
                    $scope.outputTab = 'js/tepl/outputTepl.html';
                }
            );
        } else if (tab === "errorCheck") {
            $("#errorClear").hide();
            $("#immediatelyCheck").show();
            $ocLazyLoad.load('ctrl/errorCheckCtrl').then(function () {
                    $scope.errorCheckTab = 'js/tepl/errorCheckTepl.html';
                }
            );
        }

    };
    $scope.empty = function () {
        var output = fastmap.uikit.OutPutController();
        output.clear();
    };
    $scope.showOrHide = function () {
        var modifyToolsDiv = $("#modifyToolsDiv");
        if ($scope.toolsFlag) {

            modifyToolsDiv.animate({width: '400px', opacity: '0.8'}, "slow");
            modifyToolsDiv.css("display", "block");
        } else {

            modifyToolsDiv.animate({width: '0px', opacity: '0.8'}, "slow");
            modifyToolsDiv.css("display", "none");
        }
        $scope.toolsFlag = !$scope.toolsFlag;
    }
}]);
function appInit(){

    map = L.map('map',{ attributionControl: false}).setView([40.012834, 116.476293], 17);
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
    var $drag = $dragDiv.find('button');
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


