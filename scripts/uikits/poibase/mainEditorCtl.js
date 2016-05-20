angular.module('app', ['oc.lazyLoad', 'ui.bootstrap', 'dataService', 'localytics.directives', 'angularFileUpload', 'angular-drag']).controller('mainEditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'dsPoi', 'dsMeta', 'uibButtonConfig', '$http', '$timeout', function ($scope, $ocll, $rs, $q, poi, meta, uibBtnCfg, $http, $timeout) {
    uibBtnCfg.activeClass = "btn-success";
    //$scope.isShowImages = false;
    $scope.mapColumn = 12;
    $scope.meta = {};
    $scope.metaData = {}; //存放元数据
    $scope.metaData.kindFormat = {}, $scope.metaData.kindList = [], $scope.metaData.allChain = {};
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
        $scope.snapshotPoi = data.getSnapShot();
    }));
    //查询3DIcon
    promises.push(meta.getCiParaIcon("0010060815LML01353").then(function(data) {
        $scope.poiIcon = data;
    }));
    promises.push(poi.getPoiList().then(function(data) {
        $scope.poiList = data;
    }));
    $q.all(promises).then(function() {
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
            $ocll.load('../scripts/components/poi/ctrls/edit-tools/OptionBarCtl').then(function() {
                $scope.optionBarTpl = '../../scripts/components/poi/tpls/edit-tools/optionBarTpl.html';
                console.log($scope.poi)
            });
            $ocll.load('../scripts/components/poi/ctrls/attr-map/poiMapCtl').then(function() {
                $scope.mapTpl = '../../scripts/components/poi/tpls/attr-map/poiMapTpl.html';
                $scope.$on('$includeContentLoaded', function ($event) {
                });
            });
        });
        $ocll.load('../../scripts/components/poi/ctrls/attr-base/imageCtl.js').then(function () {
            $scope.imageTpl = '../../scripts/components/poi/tpls/attr-base/imageTpl.html';
            /*$scope.$on('$includeContentLoaded', function($event,url ) {
                if(url == '../../scripts/components/poi/tpls/attr-base/imageTpl.html'){
                    console.log("imageTpl.html-------------");
                    $timeout(function (){
                        $scope.$broadcast('loadImages',{"imgArray":imgs,"flag":1});
                    },100);
                }
            });*/
            // var imgs = initImages();
            // $scope.imagesArray =  imgs;
            // $scope.deleteFlag = 1;
        });
    });

    var getParentPoiName = function (){
        if ($scope.poi.relateParent) {
            poi.getPoiSnapshot($scope.poi.relateParent.parentFid).then(function (parentPoi){
                $scope.poi.relateParentName = parentPoi.name;
            });
        }
    };

    var initImages = function () {
        var attachments = $scope.poi.attachments;
        var imageArr = [];
        for (var i = 0, len = attachments.length; i < len; i++) {
            if (attachments[i].type == 1) {
                if (attachments[i].url.indexOf(App.Config.resourceUrl) == -1) {
                    attachments[i].url = App.Config.resourceUrl + '/photo' + attachments[i].url
                }
                imageArr.push(attachments[i]);
            }
        }
        //控制是否显示图片
        if (imageArr.length > 0) {
            $scope.mapColumn = 6;
            $scope.isShowImages = true;
            $scope.arrowStyle = "arrow_left"; //用于控制缩放图片
            $scope.isShowArrow = true; //用于控制是否显示缩放图片的按钮
        } else {
            $scope.mapColumn = 12;
            $scope.isShowImages = false;
            $scope.isShowArrow = false;
        }
        return imageArr;
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
    /*显示关联poi详细信息*/
    $scope.showPoiDetailInfo = function(poi, index) {
        $scope.poiDetail = {
            poi: poi,
            kindName: $scope.refFt.refList[index].kindInfo.kindName
        };
        console.log($scope.refFt.refList[index], $scope.refFt.refList[index].fid);
        $scope.$broadcast('highlightChildInMap', $scope.refFt.refList[index].fid);
    };
    /*接收框选点信息*/
    $scope.$on('drawPois', function (event, data) {
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
                    title: '框选区域内关联POI',
                    refList: data.data
                };
                $scope.showRelatedPoiInfo = true;
                $scope.layerName = data.layerId;
                // $scope.$broadcast('showPoisInMap',{data:$scope.refFt.refList,layerId:"parentPoiLayer"});
            });
        });
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
    /*显示关联poi面板*/
    $scope.$on('showRelatedPoiInfo',function(event,data){
        $scope.refFt = data;
        $scope.showRelatedPoiInfo = true;
        $scope.$broadcast('showPoisInMap', {
            data: data.refList,
            layerId: "checkResultLayer"
        });
    });
    /*检查结果忽略请求*/
    $scope.$on('ignoreItem', function (event, data) {
        poi.ignoreCheck(data,$scope.poi.fid).then(function () {
            /*操作成功后刷新poi数据*/
            // refreshPoiData('0010060815LML01353');
        })
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
    }
    /*获取关联poi数据——冲突检测*/
    $scope.$on('getConflictInMap', function (event, data) {
        $scope.optionData = {};
        console.log($scope.metaData.allChain)
        $ocll.load('../scripts/components/poi/ctrls/edit-tools/confusionDataCtl').then(function () {
            $scope.confusionDataTpl = '../../scripts/components/poi/tpls/edit-tools/confusionDataTpl.html';
            $scope.showConflictPoiInfo = true;
            data.refData.duppoi.kindName = $scope.metaData.kindFormat[data.refData.duppoi.kindCode].kindName;
            data.refData.duppoi.brandList = $scope.metaData.allChain[data.refData.duppoi.kindCode];
            $scope.optionData.confusionData = data;
            // $scope.$emit('showConflictInMap',true);
            $scope.showConflictInfo = true;
        });
    });
    /*显示冲突检测面板*/
    $scope.$on('showConflictInMap',function(event,data){
        console.log(data)
        $scope.showConflictInfo = data;
    });
    /*接收新上传的图片数据*/
    $scope.$on('getImgItems', function (event, data) {
        for (var i = 0; i < data.length; i++) {
            $scope.poi.attachments.push(data[i]);
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
        $scope.saveButClass = "disabled";
        poi.savePoi($scope.poi).then(function (data) {
            var temp = data;
            $scope.saveButClass = "";
        });
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