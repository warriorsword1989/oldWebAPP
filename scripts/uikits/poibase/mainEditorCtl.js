angular.module('app', ['oc.lazyLoad', 'ui.bootstrap', 'dataService', 'localytics.directives', 'angularFileUpload', 'angular-drag', 'fastmap.uikit']).controller('mainEditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'dsPoi', 'dsMeta', 'uibButtonConfig', '$http', '$timeout', function ($scope, $ocll, $rs, $q, poi, meta, uibBtnCfg, $http, $timeout) {
    uibBtnCfg.activeClass = "btn-success";
    $scope.isShowImages = true; //页面初始化需要设置成true。否则showbox控件计算高度有误
    $scope.deleteFlag = true;
    $scope.mapColumn = 12;
    $scope.meta = {};
    $scope.metaData = {}; //存放元数据
    $scope.metaData.kindFormat = {}, $scope.metaData.kindList = [], $scope.metaData.allChain = {};
    var allImages = [] , operSeasonImages = [];
    var operSeason = "";
    var promises = [];
    promises.push(meta.getKindList().then(function(kindData) {
        //$scope.meta.kindList = [];
        initKindFormat(kindData);
    }));
    promises.push(meta.getAllBrandList().then(function(chainData) {
        $scope.metaData.allChain = chainData;
    }));
    promises.push(poi.getPoiDetailByFid("0010060815LML01353").then(function(data) {
        $scope.poi = data;
        $scope.poi.checkResults[0] = new FM.dataApi.IxCheckResult({
            "errorCode": "FM-14Sum-11-09",
            "errorMsg": "内部POI必须有父",
            "fields": ["kindCode", "indoor"],
            'refFeatures': [{
                "name": "５５５中信银行ＡＴＭ",
                "level": "B1",
                "auditStatus": 2,
                "rowkey": "005956730006697336",
                "pid": 6697336,
                "guide": {
                    "latitude": 39.9199,
                    "linkPid": 49143560,
                    "longitude": 116.45111
                },
                "location": {
                    "latitude": 39.9199,
                    "longitude": 116.45113
                },
                "fid": "0010060811LLJ02257",
                "address": "东大桥路８号院１",
                "checkResultNum": 2,
                "lifecycle": 2,
                "kindCode": "150101",
                "attachments": [{
                    "url": "/15win/2016013086/20160314/292520160314131656_48465.JPG",
                    "tag": "4",
                    "type": 1
                }, {
                    "url": "98798",
                    "tag": 0,
                    "type": 4
                }]
            }]
        });
        $scope.poi.checkResults[1] = new FM.dataApi.IxCheckResult({
            "errorCode": "FM-14Win-01-02",
            "errorMsg": "重新确认成果中的设施名称是否正确",
            "fields": ["name"]
        });
        $scope.poi.checkResults[2] = new FM.dataApi.IxCheckResult({
            "errorCode": "FM-YW-20-215",
            "errorMsg": "内部POI必须有父",
            "fields": ["kindCode", "indoor"]
        });
        $scope.poi.checkResults[3] = new FM.dataApi.IxCheckResult({
            "errorCode": "FM-YW-20-216",
            "errorMsg": "分类冲突，请确认！",
            "refFeatures": [{
                "conflictFields": "kindCode",
                "fid": "0010060815LML01264",
                "duppoi": {
                    "name": "北京马驹桥园林绿化有限公司",
                    "contacts": "",
                    "level": "B3",
                    "pid": 7689,
                    "postCode": "",
                    "fid": "0010060815LML01264",
                    "address": "",
                    "brands": {
                        "code": ""
                    },
                    "kindCode": "220100",
                    "location": {
                        "latitude": 39.74941,
                        "longitude": 116.56383
                    }
                }
            }]
        });
        $scope.snapshotPoi = data.getSnapShot();
    }));
    //查询3DIcon
    promises.push(meta.getCiParaIcon("0010060815LML01353").then(function(data) {
        $scope.poiIcon = data;
    }));
    //查询当前作业季
    promises.push(poi.getOperSeason("2016013086").then(function(data) {
        //$scope.operSeason = data;
        operSeason = "15win";
    }));
    promises.push(poi.getPoiList().then(function(data) {
        $scope.poiList = data;
    }));
    $q.all(promises).then(function() {
        initImages();
        getParentPoiName();
        $scope.poiMap = {   
            data: $scope.snapshotPoi,
            projectId: 2016013086,
            featcode: "poi",
            kindFormat: $scope.metaData.kindFormat
        };
        $ocll.load('../../scripts/components/poi/ctrls/attr-base/generalBaseCtl.js').then(function() {
            $scope.baseInfoTpl = '../../scripts/components/poi/tpls/attr-base/generalBaseTpl.html';
            // distinguishResult($scope.poi);
            $ocll.load('../scripts/components/poi/ctrls/edit-tools/optionBarCtl').then(function() {
                $scope.optionBarTpl = '../../scripts/components/poi/tpls/edit-tools/optionBarTpl.html';
            });
            $ocll.load('../scripts/components/poi/ctrls/attr-map/poiMapCtl').then(function() {
                $scope.mapTpl = '../../scripts/components/poi/tpls/attr-map/poiMapTpl.html';
                $scope.$on('$includeContentLoaded', function ($event) {
                });
            });
        });

        

    });

    $scope.tagKeyValue = FM.dataApi.Constant.IMAGE_TAG;
    var getParentPoiName = function (){
        if ($scope.poi.relateParent) {
            poi.getPoiSnapshot($scope.poi.relateParent.parentFid).then(function (parentPoi){
                $scope.poi.relateParentName = parentPoi.name;
            });
        }
    };

    /*$scope.$watch("poi.attachmentsImage", function (newValue, oldValue) {
        if (newValue) {
            if (newValue.length == 0) {
                $scope.mapColumn = 12;
                $scope.isShowImages = false;
                $scope.isShowArrow = false;
            } else {
                $scope.mapColumn = 6;
                $scope.isShowImages = true;
                $scope.arrowStyle = "arrow_left"; //用于控制缩放图片
                $scope.isShowArrow = true; //用于控制是否显示缩放图片的按钮
            }
        }
    });*/

    $scope.imageFilterChange = function (evn){
        var value = evn.target.value;
        if (value == 1){
            //$scope.imageArray = operSeasonImages;
            $scope.poi.attachmentsImage = operSeasonImages;
        } else {
            //$scope.imageArray = allImages;
            $scope.poi.attachmentsImage = allImages;
        }
    };
    $scope.imageTagChange = function (){        
        $scope.selectedImg.tag = $scope.imgTag.tagSelected;
    }
    $scope.beforeDeleteImg = function (item) {
        return true; //通过return false可以阻止继续执行,默认return true;
    };

    $scope.afterDeleteImg = function (item) {
    };

    $scope.imgTag = { tagSelected:0 }; //使用showbox指令时特殊处理
    $scope.selectImg = function (index, item) {
        $scope.imgTag.tagSelected = item.tag;
        $scope.selectedImg = item;
    };
    

    var initImages = function () {
        var attachments = $scope.poi.attachmentsImage;
        for (var i = 0, len = attachments.length; i < len; i++) {
            if (attachments[i].url.indexOf(operSeason) > -1) {
                operSeasonImages.push(attachments[i]);
            }
            allImages.push(attachments[i]);
        }
        //控制是否显示图片
        if (attachments.length > 0) {
            $scope.mapColumn = 6;
            $scope.isShowImages = true;
            $scope.arrowStyle = "arrow_left"; //用于控制缩放图片
            $scope.isShowArrow = true; //用于控制是否显示缩放图片的按钮
        } else {
            $scope.mapColumn = 12;
            $scope.isShowImages = false;
            $scope.isShowArrow = false;
        }
    };
    $scope.doLeftRight = function () {
        if ($scope.mapColumn == 6) {
            $scope.mapColumn = 12;
            $scope.isShowImages = false;
            $scope.arrowStyle = "arrow_right";
        } else {
            $scope.mapColumn = 6;
            $scope.isShowImages = true;
            $scope.arrowStyle = "arrow_left";
        }
    };

    /*显示同位点poi详细信息*/
    $scope.showSelectedSamePoiInfo = function(poi, index) {
        $scope.$broadcast('highlightChildInMap', $scope.refFt.refList[index].fid);
    };
    /*获取关联poi数据——检查结果*/
    $scope.$on('getRefFtInMap', function (event, data) {
        $ocll.load('../scripts/components/poi/ctrls/edit-tools/poiInfoPopoverCtl').then(function () {
            $scope.poiInfoTpl = '../../scripts/components/poi/tpls/edit-tools/poiInfoPopover.html';
            $scope.$emit('getLayerName','checkResultLayer');
            for (var i = 0, len = data.length; i < len; i++) {
                data[i].kindInfo = $scope.metaData.kindFormat[data[i].kindCode];
            }
            $scope.refFt = {
                title: '检查结果关联POI',
                refList: data
            };
            $scope.$emit('showRelatedPoiInfo',$scope.refFt);
        });
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
        $ocll.load('../scripts/components/poi/ctrls/edit-tools/poiInfoPopoverCtl').then(function () {
            $scope.poiInfoTpl = '../../scripts/components/poi/tpls/edit-tools/poiInfoPopover.html';
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
    });
    /*接收周边查询点信息*/
    $scope.$on('searchPois', function (event, data) {
        loadPoiInfoPopover(data,'周边1KM范围内的POI');
    });
    /*接收同位点信息*/
    $scope.$on('samePois', function (event, data) {
        $ocll.load('../scripts/components/poi/ctrls/edit-tools/poiInfoPopoverCtl').then(function () {
            $scope.poiInfoTpl = '../../scripts/components/poi/tpls/edit-tools/poiInfoPopover.html';
            // $scope.samePois = data;
            $scope.refFt = {
                title: '同位点POI',
                refList: data.data
            };
            $scope.showRelatedPoiInfo = true;
            $scope.layerName = data.layerId;
        });
    });
    /*获取检查规则*/
    meta.queryRule().then(function (data) {
        $scope.checkRuleList = data;
    });
    /*显示关联poi面板*/
    $scope.$on('showRelatedPoiInfo',function(event,data){
        $scope.refFt = data;
        $scope.$broadcast('showPoisInMap', {
            data: data.refList,
            layerId: "checkResultLayer"
        });
        $scope.showRelatedPoiInfo = true;
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
        $ocll.load('../scripts/components/poi/ctrls/edit-tools/confusionDataCtl').then(function () {
            $scope.confusionDataTpl = '../../scripts/components/poi/tpls/edit-tools/confusionDataTpl.html';
            $scope.showConflictPoiInfo = true;
            data.refData.duppoi.kindName = $scope.metaData.kindFormat[data.refData.duppoi.kindCode].kindName;
            data.refData.duppoi.brandList = $scope.metaData.allChain[data.refData.duppoi.kindCode];
            $scope.optionData.confusionData = data;
            $scope.showConflictInfo = true;
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
    var initKindFormat = function (kindData) {
        for (var i = 0; i < kindData.length; i++) {
            $scope.metaData.kindFormat[kindData[i].kindCode] = {
                kindId: kindData[i].id,
                kindName: kindData[i].kindName,
                level: kindData[i].level,
                extend: kindData[i].extend,
                parentFlag: kindData[i].parent,
                chainFlag: kindData[i].chainFlag,
                dispOnLink: kindData[i].dispOnLink,
                mediumId: kindData[i].mediumId
            };
            $scope.metaData.kindList.push({
                value: kindData[i].kindCode,
                text: kindData[i].kindName,
                mediumId: kindData[i].mediumId
            });
            //$scope.meta.kindList.push(kindData[i]);
        }
    };
    $scope.nextPoi = function() {
        ds.getPoiDetailByFid("0010060815LML01353").then(function(data) {
            $scope.poi = data;
            $scope.$broadcast("loadup", $scope.poi);
        });
    };
    $scope.doSave = function() {
        console.info("poi", $scope.poi);
        console.info("save", $scope.poi.getIntegrate());
        //$scope.saveButClass = "disabled";
        // poi.savePoi($scope.poi).then(function (data) {
        //     var temp = data;
        //     $scope.saveButClass = "";
        // });
    };

    //接收从generalBase传过来的命令，查询并显示在地图上
    $scope.$on('emitParent',function (obj){
        poi.getPoiSnapshot($scope.poi.relateParent.parentFid).then(function (parentPoi){
            var data = {};
            data.data = parentPoi;
            data.layerId = "parentPoiLayer";
            $scope.$broadcast("showPoisInMap", data);
        });
    });

    $scope.$on('emitChildren',function (obj) {
        var cond = {
            "relateParent.parentFid": $scope.poi.fid
        };
        var param = {
            projectId: "2016013086",
            condition: cond,
            type: "snapshot",
            phase: "4",
            featcode: 'poi',
            pagesize: 0
        };
        poi.getPoiInfo(param).then(function (data) {
            $scope.poi = data;
            $scope.snapshotPoi = data.getSnapShot();
        })
    });
    $scope.loadAdditionInfo = function() {
        $scope.additionInfoTpl = $scope.radioModel;
    };
    $scope.testQuery = function() {
        poi.getPoiByFid("0010060815LML01353").then(function(data) {
            $scope.test = data;
        });
    };
    // $scope.$on("kindChange", function(event, data) {
    //     console.log($scope.poi.fid);
    //     $scope.poi.parkings = {
    //         tollStd: "1|2|3",
    //         buildingType: 4,
    //     };
    //     if (data.extend > 0) {
    //         $ocll.load("components/poi/ctrls/attr-deep/generalParkingsCtl").then(function() {
    //             $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/generalParkingsTpl.html";
    //             // $scope.$on("$includeContentLoaded", function() {
    //             //     $scope.$broadcast("loadup", $scope.poi);
    //             // });
    //         });
    //     } else {
    //         $scope.deepInfoTpl = '';
    //     }
    // });
    $scope.$on("kindChange", function(event, data) {
        switch (data.extend) {
            case 1: //停车场
                $ocll.load("components/poi/ctrls/attr-deep/parkingCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/parkingTpl.html";
                });
                break;
            case 2: //加油站
                $ocll.load("components/poi/ctrls/attr-deep/oilStationCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/oilStationTpl.html";
                });
                break;
            case 3: //充电站
                $ocll.load("components/poi/ctrls/attr-deep/chargingStationCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/chargingStationTpl.html";
                });
                break;
            case 4: //宾馆酒店
                $ocll.load("components/poi/ctrls/attr-deep/hotelCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/hotelTpl.html";
                });
                break;
            case 5: //运动场馆
                $ocll.load("components/poi/ctrls/attr-deep/sportsVenuesCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/sportsVenuesTpl.html";
                });
                break;
            case 6: //餐馆
                $ocll.load("components/poi/ctrls/attr-deep/foodTypeCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/foodTypeTpl.html";
                });
                break;
            case 7: //加气站
                $ocll.load("components/poi/ctrls/attr-deep/gasStationCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/chargingPoleTpl.html";
                });
                break;
            case 8: //旅游景点
                $ocll.load("components/poi/ctrls/attr-deep/chargingPoleCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/chargingPoleTpl.html";
                });
                break;
            case 9:
                $ocll.load("components/poi/ctrls/attr-deep/chargingPoleCtl").then(function() {
                    // $ocll.load("components/poi/drtvs/directives/select2_drtv").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/chargingPoleTpl.html";
                    $scope.$on('$includeContentLoaded', function ($event) {
                        $scope.$broadcast("loaded", data);
                    });
                    // });
                });
                break;
            default:
                $scope.deepInfoTpl = "";
                break;
        }
    });
}]).directive("myResize", ["$timeout", function($timeout) {
    function _resize(elem) {
        
        var vh = 0;
        if (window.innerHeight) {
            vh = window.innerHeight;
        } else if (document.documentElement.clientHeight) {
            vh = document.documentElement.clientHeight;
        } else {
            vh = document.getElementsByTagName("body")[0].clientHeight;
        }
        var h = vh - elem.offsetTop - 56;
        if (h > 0) {
            if (h < elem.scrollHeight) {
                elem.style.height = h + "px";
            } else if (h >= elem.scrollHeight) {
                elem.style.height = elem.scrollHeight + "px";
            }
        }
    }
    return {
        restrict: 'A',
        scope: true,
        controller: function($scope, $element) {
            $scope.$on("$includeContentLoaded", function() {
                // 稍微延迟一下下，为htm片段加载生成高度信息提供时间
                $timeout(function() {
                    $element.triggerHandler("resize");
                }, 1);
            });
        },
        link: function(scope, element) {
            element.on("resize", function() {
                _resize(element[0]);
            });
        }
    };
}]);