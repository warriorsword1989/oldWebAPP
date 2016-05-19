/**
 * Created by liwanchong on 2016/2/18.
 */
var app = angular.module('mapApp', ['oc.lazyLoad', 'ui.layout']);
app.controller('RoadEditController', ['$scope', '$ocLazyLoad', '$rootScope', function ($scope, $ocLazyLoad, $rootScope) {
    $scope.showLoading = true;
    var eventController = fastmap.uikit.EventController();
    var objectCtrl = fastmap.uikit.ObjectEditController();
    var output = fastmap.uikit.OutPutController();


    $scope.save = function () {
        $scope.subAttrTplContainerSwitch(false);
        eventController.fire(eventController.eventTypes.SAVEPROPERTY)
    };//保存方法
    $scope.delete = function () {
        //删除后清除高亮并赋给默认模版
        swal({
            "title": "操作确认",
            "text": "是否要删除当前要素?",
            "showCancelButton": true,
            "cancelButtonText": "取消",
            "confirmButtonText": "确定"
        }, function () {
            $scope.panelFlag = false;
            $scope.attrTplContainerSwitch(false);
            $scope.subAttrTplContainerSwitch(false);
            $scope.attrTplContainer = '../../scripts/components/road/tpls/blank_tpl/blankTpl.html';
            objectCtrl.setOriginalData(null);
            var highRenderCtrl = fastmap.uikit.HighRenderController();
            highRenderCtrl._cleanHighLight();
            highRenderCtrl.highLightFeatures.length = 0;
            if (map.floatMenu) {
                map.removeLayer(map.floatMenu);
                map.floatMenu = null;
            }
            eventController.fire(eventController.eventTypes.DELETEPROPERTY)
        }, data.errmsg, "error");

    };//删除方法
    $scope.cancel = function () {
        $scope.attrTplContainer = "";
        $scope.attrTplContainerSwitch(false);
        $scope.subAttrTplContainerSwitch(false);
        eventController.fire(eventController.eventTypes.CANCELEVENT)
    };//取消

    //响应选择要素类型变化事件
    eventController.on(eventController.eventTypes.SELECTEDFEATURETYPECHANGE, function () {
        if (eventController.eventTypesMap[eventController.eventTypes.SAVEPROPERTY]) {
            for (var i = 0, len = eventController.eventTypesMap[eventController.eventTypes.SAVEPROPERTY].length; i < len; i++) {
                eventController.off(eventController.eventTypes.SAVEPROPERTY, eventController.eventTypesMap[eventController.eventTypes.SAVEPROPERTY][i]);
            }
        }
        if (eventController.eventTypesMap[eventController.eventTypes.DELETEPROPERTY]) {
            for (var j = 0, lenJ = eventController.eventTypesMap[eventController.eventTypes.DELETEPROPERTY].length; j < lenJ; j++) {
                eventController.off(eventController.eventTypes.DELETEPROPERTY, eventController.eventTypesMap[eventController.eventTypes.DELETEPROPERTY][j]);
            }
        }
        if (eventController.eventTypesMap[eventController.eventTypes.CANCELEVENT]) {
            for (var k = 0, lenK = eventController.eventTypesMap[eventController.eventTypes.SAVEPROPERTY].length; k < lenK; k++) {
                eventController.off(eventController.eventTypes.CANCELEVENT, eventController.eventTypesMap[eventController.eventTypes.CANCELEVENT][k]);
            }
        }

        if (eventController.eventTypesMap[eventController.eventTypes.SELECTEDFEATURECHANGE]) {
            for (var k = 0, lenK = eventController.eventTypesMap[eventController.eventTypes.SELECTEDFEATURECHANGE].length; k < lenK; k++) {
                eventController.off(eventController.eventTypes.SELECTEDFEATURECHANGE, eventController.eventTypesMap[eventController.eventTypes.SELECTEDFEATURECHANGE][k]);
            }
        }

        //如果选择的要素类型发生变化，需要把属性框弹出来
        if (!$scope.panelFlag) {
            $scope.attrTplContainerSwitch(true);
        }

    });
    $scope.panelFlag = false;//panelFlag属性面板状态
    $scope.outErrorArr = [false, true, true, false];//输出框样式控制
    $scope.suspendFlag = false;//次属性框显隐控制
    $scope.outErrorUrlFlag = false;
    $scope.tipsTplContainerFlag = true;//点击tips列表 判断右侧属性栏是否弹出
    $scope.classArr = [false, false, false, false, false, false, false, false, false, false, false, false, false, false,false];//按钮样式的变化
    $scope.changeBtnClass = function (id) {
        for (var claFlag = 0, claLen = $scope.classArr.length; claFlag < claLen; claFlag++) {
            if (claFlag === id) {
                $scope.classArr[claFlag] = !$scope.classArr[claFlag];
            } else {
                $scope.classArr[claFlag] = false;
            }
        }
    };


    $scope.changeSuspendShow = function () {
        if ($('.lanePic')) {
            $.each($('.lanePic'), function (i, v) {
                $(v).removeClass('active');
            });
        }

        $scope.subAttrTplContainerSwitch(false);
    };
    /*隐藏tips图片*/
    $scope.hideFullPic = function () {
        $("#fullScalePic").hide();
    }

    //登录时
    keyEvent($ocLazyLoad, $scope);
    $ocLazyLoad.load('components/road/ctrls/log_show_ctrl/outPutCtrl').then(function () {
        $scope.outputTab = '../../scripts/components/road/tpls/log_show_tpl/outputTpl.html';
        appInit();
        $ocLazyLoad.load('components/road/ctrls/layers_switch_ctrl/filedsResultCtrl').then(function () {
                $scope.layersURL = '../../scripts/components/road/tpls/layers_switch_tpl/fieldsResult.html';
                $ocLazyLoad.load('components/road/ctrls/toolBar_cru_ctrl/modifyToolCtrl').then(function () {
                        $scope.modifyToolURL = '../../scripts/components/road/tpls/toolBar_cru_tpl/modifyToolTpl.html';
                        $scope.layersURL = '../../scripts/components/road/tpls/layers_switch_tpl/fieldsResult.html';
                        $ocLazyLoad.load('components/road/ctrls/toolBar_cru_ctrl/selectShapeCtrl').then(function () {
                                $scope.selectShapeURL = '../../scripts/components/road/tpls/toolBar_cru_tpl/selectShapeTpl.html';
                                $ocLazyLoad.load('components/road/ctrls/toolBar_cru_ctrl/addShapeCtrl').then(function () {
                                    $scope.addShapeURL = '../../scripts/components/road/tpls/toolBar_cru_tpl/addShapeTpl.html';
                                    $ocLazyLoad.load('components/road/ctrls/blank_ctrl/blankCtrl').then(function () {
                                        $scope.attrTplContainer = '../../scripts/components/road/tpls/blank_tpl/blankTpl.html';
                                        $scope.showLoading = false;
                                        $("#blackWell").fadeIn();
                                        $(".output-console").fadeIn();
                                        $('#fm-leftContainer').fadeIn();
                                        $(".fm-panel-layersURL").fadeIn();
                                    });
                                });
                            }
                        );
                    }
                );
            }
        );
    });
    $scope.showTab = function (tab, ind) {
        if (tab === "outPut") {
            $("#liout").addClass("selected");
            $("#lierror").removeClass("selected");
            $("#errorClear").show();
            $("#immediatelyCheck").hide();
            $("#fm-error-checkErrorLi").hide();
            $("#fm-outPut-inspectDiv").show();
            $("#fm-error-wrongDiv").hide();

            $ocLazyLoad.load('components/road/ctrls/log_show_ctrl/outPutCtrl').then(function () {
                    $scope.outputTab = '../../scripts/components/road/tpls/log_show_tpl/outputTpl.html';
                }
            );

        } else if (tab === "errorCheck") {
            $("#lierror").addClass("selected");
            $("#liout").removeClass("selected");
            $("#errorClear").hide();
            $("#immediatelyCheck").show();
            $("#fm-outPut-inspectDiv").hide();
            $("#fm-error-wrongDiv").show();
            $("#fm-error-checkErrorLi").show();
            $ocLazyLoad.load('components/road/ctrls/log_show_ctrl/errorPageCtrl').then(function () {
                $scope.errorCheckPage = '../../scripts/components/road/tpls/log_show_tpl/errorPageTpl.html'
            });
        }
    };

    $scope.isTipsPanel = 1;
//改变左侧栏中的显示内容
    $scope.changeLeftDisplay = function (id) {
        if (id === "tipsPanel") {
            $scope.isTipsPanel = 1;
            $ocLazyLoad.load('components/road/ctrls/layers_switch_ctrl/filedsResultCtrl').then(function () {
                $scope.layersURL = '../../scripts/components/road/tpls/layers_switch_tpl/fieldsResult.html';
            });
        } else if (id === "scenePanel") {
            $scope.isTipsPanel = 2;
            $ocLazyLoad.load('components/road/ctrls/layers_switch_ctrl/sceneLayersCtrl').then(function () {
                $scope.layersURL = '../../scripts/components/road/tpls/layers_switch_tpl/sceneLayers.html';
            });
        } else if (id === "layerPanel") {
            $scope.isTipsPanel = 3;
            $ocLazyLoad.load('components/road/ctrls/layers_switch_ctrl/referenceLayersCtrl').then(function () {
                    $scope.layersURL = '../../scripts/components/road/tpls/layers_switch_tpl/referenceLayers.html';
                }
            );
        }
    };

    $scope.empty = function () {
        output.clear();
        if (output.updateOutPuts !== "") {
            output.updateOutPuts();
        }
    };
    //改变右侧的宽度
    $scope.changeWidthOfPanel = function () {
        $scope.panelFlag = !$scope.panelFlag;
        if ($scope.panelFlag) {
            $scope.outErrorArr[3] = true;
            $scope.outErrorArr[2] = false;
        }
        else {
            $scope.outErrorArr[2] = true;
            $scope.outErrorArr[3] = false;
        }
    };
    $scope.changeOutOrErrorStyle = function () {
        $scope.outErrorArr[0] = !$scope.outErrorArr[0];
        $scope.outErrorArr[1] = !$scope.outErrorArr[0];
        $scope.outErrorUrlFlag = !$scope.outErrorUrlFlag;
    };

    //属性栏开关逻辑控制
    $scope.attrTplContainerSwitch = function (flag) {
        $scope.panelFlag = flag;
        $scope.objectFlag = flag;
        if ($scope.panelFlag) {

            $scope.outErrorArr[3] = true;
            $scope.outErrorArr[2] = false;
        }
        else {
            $scope.attrTplContainer = "";
            $scope.suspendFlag = false;
            $scope.outErrorArr[2] = true;
            $scope.outErrorArr[3] = false;
        }
    }

    //次属性开关逻辑控制
    $scope.subAttrTplContainerSwitch = function (flag) {
        $scope.suspendFlag = flag;
    }

    //output开关逻辑控制
    $scope.outputContainerSwitch = function (flag) {
        $scope.outErrorArr[0] = flag;
        $scope.outErrorArr[1] = !$scope.outErrorArr[0];
    }

    //tips开关逻辑控制
    $scope.tipsTplContainerSwitch = function (flag) {

    }

    $scope.controlProperty = function (event, data) {
        if (data["loadType"] === "subAttrTplContainer") {
            $scope.subAttrTplContainerSwitch(true);
            $scope.subAttrTplContainer = "";
        } else if (data["loadType"] === "attrTplContainer") {
            if (!$scope.panelFlag) {
                $scope.attrTplContainerSwitch(true);
            }
        } else if (data["loadType"] === "tipsTplContainer") {

        } else if (data["loadType"] === "tipsPitureContainer") {
            if ($scope[data["loadType"]]) {
                $scope.$broadcast("TRANSITTIPSPICTURE", {})
                return;
            }
        } else if (data["loadType"] === "tipsVideoContainer") {
            if ($scope[data["loadType"]]) {
                $scope.$broadcast("TRANSITTIPSVIDEO", {})
                return;
            }
        }

        $ocLazyLoad.load(data["propertyCtrl"]).then(function () {
            $scope[data["loadType"]] = data["propertyHtml"];
            if (data["callback"]) {
                data["callback"]();
            }
        })
    };
    $scope.$on("transitCtrlAndTpl", $scope.controlProperty);
    $scope.$on("SWITCHCONTAINERSTATE", function (event, data) {
        if (data.hasOwnProperty("attrContainerTpl")) {
            $scope.attrTplContainerSwitch(data["attrContainerTpl"]);
        } else if (data.hasOwnProperty("subAttrContainerTpl")) {
            $scope.subAttrTplContainerSwitch(data["subAttrContainerTpl"]);
        }
    });
    $scope.adTools=function() {
        $ocLazyLoad.load('components/road/ctrls/toolBar_cru_ctrl/modifyAdToolCtrl').then(function () {
                $scope.modifyToolURL = '../../scripts/components/road/tpls/toolBar_cru_tpl/modifyAdToolTpl.html';
                $ocLazyLoad.load('components/road/ctrls/toolBar_cru_ctrl/selectAdShapeCtrl').then(function () {
                    $scope.selectShapeURL = '../../scripts/components/road/tpls/toolBar_cru_tpl/selectAdShapeTpl.html';
                    $ocLazyLoad.load('components/road/ctrls/toolBar_cru_ctrl/addAdShapeCtrl').then(function () {
                        $scope.addShapeURL = '../../scripts/components/road/tpls/toolBar_cru_tpl/addAdShapeTpl.html';
                    });
                });
            }
        );
    };
    $scope.rdTools = function () {
        $ocLazyLoad.load('components/road/ctrls/toolBar_cru_ctrl/modifyToolCtrl').then(function () {
                $scope.modifyToolURL = '../../scripts/components/road/tpls/toolBar_cru_tpl/modifyToolTpl.html';
                $ocLazyLoad.load('components/road/ctrls/toolBar_cru_ctrl/selectShapeCtrl').then(function () {
                    $scope.selectShapeURL = '../../scripts/components/road/tpls/toolBar_cru_tpl/selectShapeTpl.html';
                    $ocLazyLoad.load('components/road/ctrls/toolBar_cru_ctrl/addShapeCtrl').then(function () {
                        $scope.addShapeURL = '../../scripts/components/road/tpls/toolBar_cru_tpl/addShapeTpl.html';
                    });
                });
            }
        );
    };
    $scope.switchTools = function (data, event) {
        switch (event.type) {
            case "rdTools":
                $scope.rdTools();
                break;
            case "adTools":
                $scope.adTools();
                break;
        }
    };
    $scope.$on("SWITCHTOOLS", $scope.switchTools)


}]);

var map = null;
function appInit() {
    map = L.map('map', {
        attributionControl: false,
        doubleClickZoom: false,
        zoomControl: false
    }).setView([40.012834, 116.476293], 17);
    var layerCtrl = new fastmap.uikit.LayerController({config: Application.layersConfig});
    var selectCtrl = new fastmap.uikit.SelectController();
    var outPutCtrl = new fastmap.uikit.OutPutController();
    var objCtrl = new fastmap.uikit.ObjectEditController({});
    var shapeCtrl = new fastmap.uikit.ShapeEditorController();
    var featCode = new fastmap.uikit.FeatCodeController();
    var tooltipsCtrl = new fastmap.uikit.ToolTipsController();
    var highLayerCtrl = new fastmap.uikit.HighRenderController();
    var eventCtrl = new fastmap.uikit.EventController();
    var speedLimit = layerCtrl.getLayerById("speedlimit")
    tooltipsCtrl.setMap(map, 'tooltip');
    shapeCtrl.setMap(map);
    layerCtrl.eventController.on(eventCtrl.eventTypes.LAYERONSHOW, function (event) {
        if (event.flag == true) {
            map.addLayer(event.layer);
        } else {
            map.removeLayer(event.layer);
        }
    })
    for (var layer in layerCtrl.getVisibleLayers()) {
        map.addLayer(layerCtrl.getVisibleLayers()[layer]);
    }



}




