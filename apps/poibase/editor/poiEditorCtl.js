angular.module('app', ['oc.lazyLoad', 'ui.layout', 'dataService', 'angularFileUpload', 'angular-drag']).controller('PoiEditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', 'dsPoi','dsMeta', '$q', function($scope, $ocLazyLoad, $rootScope, poiDS, meta ,$q) {
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
    /*显示同位点poi详细信息*/
    $scope.showSelectedSamePoiInfo = function(poi, index) {
        $scope.$broadcast('highlightChildInMap', $scope.refFt.refList[index].fid);
    };
    /*获取关联poi数据——检查结果*/
    $scope.$on('getRefFtInMap', function (event, data) {
        for (var i = 0, len = data.length; i < len; i++) {
            data[i].kindInfo = $scope.metaData.kindFormat[data[i].kindCode];
        }
        $scope.refFt = {
            title: '检查结果关联POI',
            refList: data
        };
        $scope.$broadcast('showPoisInMap', {
            data: data,
            layerId: "checkResultLayer"
        });
        $scope.showRelatedPoiInfo = true;
        $scope.$broadcast('showPoiListData',data);
    });
    /*隐藏关联POI界面*/
    $scope.infoStyle = {
        'display':'block'
    };
    /*显示关联poi详细信息*/
    $scope.showPoiDetailInfo = function(poi, index) {
        $scope.poiDetail = {
            poi: poi,
            kindName: $scope.refFt.refList[index].kindInfo.kindName
        };
        $scope.$broadcast('highlightChildInMap', $scope.refFt.refList[index].fid);
    };
    /*显示地图上poi数组*/
    function loadPoiInfoPopover(data,title){
        $ocLazyLoad.load('scripts/components/poi-new/ctrls/edit-tools/poiInfoPopoverCtl').then(function () {
            $scope.poiInfoTpl = '../../../scripts/components/poi-new/tpls/edit-tools/poiInfoPopover.html';
            $scope.drawPois = data;
            var _fid = $scope.poi.fid;
            var fidList;
            meta.getParentFidList().then(function (list) {
                fidList = list;
                for (var i = 0, len = data.data.length; i < len; i++) {
                    data.data[i].kindInfo = $scope.metaData.kindFormat[data.data[i].kindCode];
                    if (_fid && _fid == data.data[i].fid) {
                        data.data[i].ifParent = 1;
                        data.data[i].labelRemark = {
                            labelClass: 'primary',
                            text: '当前父'
                        }
                    } else {
                        switch (data.data[i].kindInfo.parentFlag) {
                            case 0:
                                if (!data.data[i].ifParent) {
                                    if (fidList.indexOf(data.data[i].fid) >= 0 && data.data[i].lifecycle != 1) { //可为父
                                        data.data[i].ifParent = 2;
                                        data.data[i].labelRemark = {
                                            labelClass: "success",
                                            text: "可为父"
                                        }
                                    } else { //不可为父
                                        data.data[i].ifParent = 3;
                                        data.data[i].labelRemark = {
                                            labelClass: 'default',
                                            text: '不可为父'
                                        }
                                    }
                                }
                                break;
                            case 1:
                                data.data[i].ifParent = 2;
                                data.data[i].labelRemark = {
                                    labelClass: 'success',
                                    text: '可为父'
                                }
                                break;
                            case 2:
                                if ($scope.poi.indoor.type == 3) {
                                    data.data[i].ifParent = 2;
                                    data.data[i].labelRemark = {
                                        labelClass: "warning",
                                        text: "可为父"
                                    };
                                } else {
                                    data.data[i].ifParent = 3;
                                    data.data[i].labelRemark = {
                                        labelClass: "default",
                                        text: "不可为父"
                                    };
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }
                $scope.refFt = {
                    title: title,
                    refList: data.data
                };
                $scope.showRelatedPoiInfo = true;
                $scope.layerName = data.layerId;
                // $scope.$broadcast('showPoisInMap',{data:$scope.refFt.refList,layerId:"parentPoiLayer"});
            });
        });
    }
    /*接收框选点信息*/
    $scope.$on('drawPois', function (event, data) {
        loadPoiInfoPopover(data,'框选区域内关联POI');
        $scope.$broadcast('showPoiListData',data);
    });
    /*接收周边查询点信息*/
    $scope.$on('searchPois', function (event, data) {
        loadPoiInfoPopover(data,'周边1KM范围内的POI');
        $scope.$broadcast('showPoiListData',data);
    });
    /*接收同位点信息*/
    $scope.$on('samePois', function (event, data) {
        $ocLazyLoad.load('scripts/components/poi-new/ctrls/edit-tools/poiInfoPopoverCtl').then(function () {
            $scope.poiInfoTpl = '../../../scripts/components/poi-new/tpls/edit-tools/poiInfoPopover.html';
            // $scope.samePois = data;
            $scope.refFt = {
                title: '同位点POI',
                refList: data.data
            };
            $scope.showRelatedPoiInfo = true;
            $scope.layerName = data.layerId;
        });
    });
    /*检查结果忽略请求*/
    $scope.$on('ignoreItem', function (event, data) {
        poi.ignoreCheck(data,$scope.poi.fid).then(function () {
            $scope.poi.ckException.push({
                errorCode:data.errorCode,
                description:data.errorMsg
            });
            for (var i = 0; i < $scope.poi.checkResults.length; i++) {
                if ($scope.poi.checkResults[i].errorCode == data.errorCode && $scope.poi.checkResults[i].errorMsg == data.errorMsg) {
                    $scope.poi.checkResults.splice(i, 1);
                    break;
                }
            }
            if ($scope.poi.checkResultNum > 0) {
                $scope.poi.checkResultNum = $scope.poi.checkResultNum - 1;
            }
            /*操作成功后刷新poi数据*/
            $scope.$broadcast('initOptionData',data);
        });
    });
    /*查找FIDlist*/
    meta.getParentFidList().then(function (list) {
        $scope.fidList = list;
    });
    /*接收layerName*/
    $scope.$on('getLayerName',function(event,data){
        $scope.layerName = data;
    });
    /*关闭关联poi数据*/
    $scope.closeRelatedPoiInfo = function () {
        $scope.showRelatedPoiInfo = false;
        $scope.$broadcast('closePopover', $scope.layerName);
    };
    /*锁定检查结果数据*/
    $scope.$on('lockSingleData', function (event, data) {
        poi.lockSingleData(data).then(function (res) {
            refreshPoiData('0010060815LML01353');
        });
    });
    /*关闭关联poi数据——冲突检测弹框*/
    $scope.closeConflictInfo = function () {
        $scope.showConflictInfo = false;
    };
    /*获取关联poi数据——冲突检测*/
    $scope.$on('getConflictInMap', function (event, data) {
        $scope.optionData = {};
        $ocLazyLoad.load('scripts/components/poi-new/ctrls/edit-tools/confusionDataCtl').then(function () {
            $scope.confusionDataTpl = '../../../scripts/components/poi-new/tpls/edit-tools/confusionDataTpl.html';
            $scope.showConflictPoiInfo = true;
            data.refData.duppoi.kindName = $scope.metaData.kindFormat[data.refData.duppoi.kindCode].kindName;
            data.refData.duppoi.brandList = $scope.metaData.allChain[data.refData.duppoi.kindCode];
            $scope.optionData.confusionData = data;
            $scope.showConflictInfo = true;
        });
        /*地图上高亮*/
        $scope.$broadcast('showPoisInMap', {
            data: data.refData,
            layerId: "checkResultLayer"
        });
    });
    /*显示冲突检测面板*/
    $scope.$on('showConflictInMap',function(event,data){
        $scope.showConflictInfo = data;
    });
    /*接收新上传的图片数据*/
    $scope.$on('getImgItems', function (event, data) {
        for (var i = 0; i < data.length; i++) {
            $scope.poi.attachmentsImage.push(data[i]);
        }
        $scope.$broadcast('loadImages', {
            "imgArray": initImages(),
            "flag": 1
        });
    });
    var promises = [];
    /*获取检查规则*/
    promises.push(meta.queryRule().then(function (data) {
        $scope.checkRuleList = data;
    }));
    /*临时数据*/
    promises.push(poiDS.getPoiDetailByFid("0010060815LML01353").then(function(data) {
        $scope.poi = data;
    }));
    $q.all(promises).then(function(){
        initOcll();
    });
    /*初始化tpl加载*/
    function initOcll(){
        $ocLazyLoad.load('scripts/components/poi-new/ctrls/edit-tools/fileUploadCtl').then(function() {
            $scope.fileUploadTpl = '../../../scripts/components/poi-new/tpls/edit-tools/fileUploadTpl.html';
        });
        $ocLazyLoad.load('scripts/components/poi-new/ctrls/edit-tools/optionBarCtl').then(function() {
            $scope.consoleDeskTpl = '../../../scripts/components/poi-new/tpls/edit-tools/optionBarTpl.html';
        });
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