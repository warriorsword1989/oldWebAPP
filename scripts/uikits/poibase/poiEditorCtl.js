angular.module('app', ['oc.lazyLoad', 'ui.layout', 'dataService']).controller('PoiEditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', 'poi', function($scope, $ocLazyLoad, $rootScope, poiDS) {
    $scope.show = true;
    $scope.panelFlag = true;
    $scope.suspendFlag = true;
    $scope.selectedTool = 1;
    $scope.dataListType = 1;
    $scope.propertyType = 'base';
    $scope.outputType = 1;
    poiDS.getPoiList().then(function(data) {
        $scope.poiList = data;
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
}]);

function loadMap() {
    //初始化地图
    pMap = L.map('map', {
        attributionControl: false,
        zoomControl: false
    }).setView([40.012834, 116.476293], 17);
    //加载各个图层
    var layer = new L.TileLayer('http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0', {
        subdomains: ["rt0", "rt1", "rt2", "rt3"],
        tms: true,
        maxZoom: 18,
        id: 'qqLayer',
    });
    pMap.addLayer(layer);
}