angular.module('app', ['oc.lazyLoad', 'ui.layout', 'dataService','ui.bootstrap']).controller('PoiEditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', 'dsPoi', '$uibModal', function($scope, $ocLazyLoad, $rootScope, poiDS, $uibModal) {
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
    /*----------------------linglong----------------------*/
    $scope.toolModal = false;
    $scope.showProcess = false;
    $scope.processValue = 0;
    //显示对应工具面板的方法;
    $scope.showToolbox = function(param){
        //数据初始化;
        $scope.processValue = 0;
        //
        $scope.one = $scope.two = $scope.three = false;
        $scope.toolModal = false;
        if(param==='search'){
            $scope.one = true;
            $scope.toolModal = true;
            $scope.htmltext = '搜索';
            $scope.tplUrl = 'test/search.html';
        }else if(param==='auto'){
            $scope.two = true;
            $scope.toolModal = true;
            $scope.htmltext = '自动';
            $scope.tplUrl = 'test/auto.html';
        }else{
            $scope.three= true;
            $scope.toolModal = true;
            $scope.htmltext = '批处理';
            $scope.tplUrl = 'test/batch.html';
        }
    }
    //处理执行任务;
    $scope.handleMethod = function(type){
        $scope.processValue = 0;
        $scope.showProcess = true;
        var temptimer = setInterval(function(){
            $scope.$apply(function(){
                if($scope.processValue==100){
                    clearInterval(temptimer);
                    $scope.handleobj = 'undefined';
                }
                $scope.processValue+=10;
            })
        },500)
        if(type=='search'){
            $scope.handleobj = 'search';
        }else if(type=='auto'){
            $scope.handleobj = 'auto';
        }else if(type=='batch'){
            $scope.handleobj = 'batch';
        }
    }
    $scope.closeToolwindow = function(){
        $scope.toolModal = false;
    }
    /*----------------------linglong----------------------*/
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