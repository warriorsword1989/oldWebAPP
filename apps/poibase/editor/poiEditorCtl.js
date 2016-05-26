angular.module('app', ['oc.lazyLoad', 'ui.layout', 'dataService']).controller('PoiEditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', 'dsPoi', function($scope, $ocLazyLoad, $rootScope, poiDS) {
    var eventController = fastmap.uikit.EventController();
    var objectCtrl = fastmap.uikit.ObjectEditController();
    var output = fastmap.uikit.OutPutController();

    $scope.show = true;
    $scope.panelFlag = true;
    $scope.suspendFlag = true;
    $scope.selectedTool = 1;
    $scope.dataListType = 1;
    $scope.propertyType = 'base';
    $scope.outputType = 1;
    $scope.parkingFee = {
        1: '包年',
        2: '包月',
        3: '免费'
    };
    poiDS.getPoiList().then(function(data) {
        $scope.poiList = data.data;
    });
    loadMap();
    $scope.changeDataList = function(val) {
        $scope.dataListType = val;
    };
    $scope.changeProperty = function(val) {
        $scope.propertyType = val;
    };
    $scope.changeOutput = function(val) {
        $scope.outputType = val;
    };
    $scope.selectData = function(data) {
        $scope.selectedPoi = data;
        $scope.selectedPoi.contacts = [{
            type: 1,
            code: '010',
            number: '8877669978'
        }, {
            type: 2,
            code: null,
            number: '18877669978'
        }];
        $scope.selectedPoi.checkResults = [{
            errorCode: 'YYMM-1001',
            errorMessage: '这是一个检查结果测试',
            refFeatures: [{
                fid: 123,
                pid: 225,
                name: 'test'
            }, {
                fid: 125,
                pid: 227,
                name: 'test'
            }]
        }, {
            errorCode: 'YYMM-1111',
            errorMessage: '这是一个检查结果测试',
            refFeatures: [{
                fid: 123,
                pid: 225,
                name: 'test'
            }, {
                fid: 125,
                pid: 227,
                name: 'test'
            }]
        }];
        $scope.selectedPoi.editHistory = [{
            operator: '刘莎',
            operateDate: '2016-05-22',
            operateDesc: '修改了【名称】，修改前：张三',
            platform: 'Web'
        }, {
            operator: '刘彩霞',
            operateDate: '2016-04-22',
            operateDesc: '修改了【分类】，修改前：中餐馆',
            platform: 'Android'
        }];
        $scope.selectedPoi.parkingFee = {
            1: true,
            2: true
        };
    };
    $scope.addContact = function() {
        $scope.selectedPoi.contacts.push({
            type: 1,
            code: null,
            number: null
        });
    };
    $scope.deleteContact = function(val) {
        $scope.selectedPoi.contacts.splice(val, 1);
    };
    $scope.doIgnore = function(val) {
        alert(val);
    };
    $scope.showRelatedPoi = function(list) {
        alert(list.length);
    };
    $scope.save = function() {
        console.log($scope.selectedPoi);
    };
    $scope.changeParkingFee = function(data) {
        mutex($scope.selectedPoi.parkingFee, ["3"], data);
    };
    var mutex = function(obj, mutexArray, val) {
        if (obj[val]) {
            for (var k in obj) {
                if (mutexArray.indexOf(val) >= 0) {
                    if (mutexArray.indexOf(k) < 0) {
                        obj[k] = false;
                    }
                } else {
                    if (mutexArray.indexOf(k) >= 0) {
                        obj[k] = false;
                    }
                }
            }
        }
    }
}]);

var map = null;
function loadMap() {
    map = L.map('map', {
        attributionControl: false,
        doubleClickZoom: false,
        zoomControl: false
    }).setView([40.012834, 116.476293], 17);
    var layerCtrl = new fastmap.uikit.LayerController({config: App.layersConfig});
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
