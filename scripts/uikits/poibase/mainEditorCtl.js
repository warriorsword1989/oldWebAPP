angular.module('app', ['oc.lazyLoad', 'ui.bootstrap', 'dataService','localytics.directives','angularFileUpload']).controller('mainEditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi', 'meta', 'uibButtonConfig',function($scope, $ocll, $rs, $q, poi, meta, uibBtnCfg) {
    uibBtnCfg.activeClass = "btn-success";
    $scope.meta = {};

    var metaData = {}; //存放元数据
    metaData.kindFormat = {} , metaData.kindList = [] ,metaData.allChain = {};
    var promises = [];
    promises.push(meta.getKindList().then(function(kindData) {
        //$scope.meta.kindList = [];
        initKindFormat(kindData);
    }));
    promises.push(meta.getAllBrandList().then(function(chainData) {
        metaData.allChain = chainData;
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
        var poiMap = {
            data:$scope.snapshotPoi,
            projectId:2016013086,
            featcode:"poi",
            kindFormat:metaData.kindFormat
        };
        $ocll.load('../../scripts/components/poi/ctrls/attr-base/generalBaseCtl.js').then(function() {
            $scope.baseInfoTpl = '../../scripts/components/poi/tpls/attr-base/generalBaseTpl.html';
            $scope.$on('$includeContentLoaded', function($event) {
                console.log("baseinfo");
                $scope.$broadcast("loadup", {"poi":$scope.poi,"poiIcon":$scope.poiIcon,"kindList":metaData.kindList,'kindFormat':metaData.kindFormat,"allChain":metaData.allChain});
            });
            distinguishResult($scope.poi);
            /*$ocll.load('../scripts/components/poi/ctrls/edit-tools/OptionBarCtl').then(function() {
                $scope.optionBarTpl = '../../scripts/components/poi/tpls/edit-tools/optionBarTpl.html';
                $scope.$on('$includeContentLoaded', function($event) {
                    $scope.$broadcast("loadup", $scope.poi);
                });
            });*/
            $ocll.load('../scripts/components/poi/ctrls/attr-map/poiMapCtl').then(function() {
                $scope.mapTpl = '../../scripts/components/poi/tpls/attr-map/poiMapTpl.html';
                $scope.$on('$includeContentLoaded', function($event) {
                    console.log("map");
                    $scope.$broadcast("loadup_poiMap", poiMap);
                });
            });
        });
    });
    var resultAllData = [],
        editHistoryData = {},
        checkResultData = [],
        confusionInfoData = [],
        checkRuleObj = {};
    var distinguishResult = function(data){
        checkResultData = [];
        confusionInfoData = [];
        /*由于没有数据，这是假数据，有正式数据后放开后面的注释*/
        resultAllData[0] = new FM.dataApi.IxCheckResult({"errorCode": "FM-14Sum-11-09", "errorMsg": "内部POI必须有父", "fields": ["kindCode", "indoor"],'refFeatures':[{"name": "５５５中信银行ＡＴＭ", "level": "B1", "auditStatus": 2, "rowkey": "005956730006697336", "pid": 6697336, "guide": {"latitude": 39.9199, "linkPid": 49143560, "longitude": 116.45111}, "location": {"latitude": 39.9199, "longitude": 116.45113}, "fid": "0010060811LLJ02257", "address": "东大桥路８号院１", "checkResultNum": 2, "lifecycle": 2, "kindCode": "150101", "attachments": [{"url": "/15win/2016013086/20160314/292520160314131656_48465.JPG", "tag": "4", "type": 1}, {"url": "98798", "tag": 0, "type": 4}]}]});
        resultAllData[1] = new FM.dataApi.IxCheckResult({"errorCode": "FM-14Win-01-02", "errorMsg": "重新确认成果中的设施名称是否正确", "fields": ["name"]});
        resultAllData[2] = new FM.dataApi.IxCheckResult({"errorCode": "FM-YW-20-215", "errorMsg": "内部POI必须有父", "fields": ["kindCode", "indoor"]});
        resultAllData[3] = new FM.dataApi.IxCheckResult({"errorCode": "FM-YW-20-216", "errorMsg": "分类冲突，请确认！", "refFeatures": [{"conflictFields": "kindCode", "fid": "0010060815LML01264", "duppoi": {"name": "北京马驹桥园林绿化有限公司", "contacts": "", "level": "B3", "pid": 7689, "postCode": "", "fid": "0010060815LML01264", "address": "", "brands": {"code": ""}, "kindCode": "220100", "location": {"latitude": 39.74941, "longitude": 116.56383}}}]});
        // editHistoryData[0] = new FM.dataApi.IxEditHistory({"mergeDate": "20160112145422","sourceName": "Android","sourceProject": "2015111243","sourceTask": "","validationMethod": 1, "mergeContents": [{"newValue": "{\"attachments\": [{\"url\": \"2015111243/20160112/365520160112145410.jpg\", \"tag\": 3, \"type\": 1}]}", "oldValue": "{\"attachments\": []}"},{ "newValue": "{\"lifecycle\": 2}","oldValue": "{\"lifecycle\": 0}"},{"newValue": "{\"brands\": [{\"code\": \"4012\"}]}","oldValue": "{\"brands\": []}"},{"newValue": "{\"indoor\": {\"open\": 1, \"type\": 3, \"floor\": null}}","oldValue": "{\"indoor\": {\"open\": 1, \"type\": 0, \"floor\": null}}"},{"newValue": "{\"level\": \"B1\"}","oldValue": "{\"level\": \"B3\"}"},{"newValue": "{\"postCode\": \"235566\"}","oldValue": "{\"postCode\": null}"}],"operator": {"role": 0,"user": 3655},"operation": 2});
        // resultAllData = data.checkResults;
        for(var i=0,len=resultAllData.length;i<len;i++){
            if(resultAllData[i].errorCode == 'FM-YW-20-215' || resultAllData[i].errorCode == 'FM-YW-20-216'){
                resultAllData[i].type = checkRuleObj[resultAllData[i].errorCode];
                resultAllData[i].poiType = resultAllData[i].errorCode == 'FM-YW-20-215'?'重复':'冲突';
                confusionInfoData.push(resultAllData[i]);
            }else{
                resultAllData[i].type = checkRuleObj[resultAllData[i].errorCode];
                checkResultData.push(resultAllData[i])
            }
        }
        if(data.lifeCycle != 2){
            /*取最后一条履历*/
            editHistoryData = data.editHistory[data.editHistory.length-1];
            /*根据履历作业员id查找真实姓名*/
            new FM.dataApi.IxEditHistory.getList(editHistoryData.operator.user.toString(),function(userInfo){
                editHistoryData.operator.name = userInfo.realName;
            });
        }else{
            editHistoryData = false;
        }

    }

    /*检查结果忽略请求*/
    $scope.$on('ignoreItem',function(event,data){
        console.log(data)
        var param = {
            fid:$scope.poi.fid,
            project_id:2016013086,
            ckException:{
                errorCode:data.errorCode,
                description:data.errorMsg
            }
        };
        poi.ignoreCheck(param,function(data){
            /*操作成功后刷新poi数据*/
            poi.getPoiDetailByFid("0010060815LML01353").then(function(data) {
                $scope.poi = data;
                $scope.snapshotPoi = data.getSnapShot();
                distinguishResult($scope.poi);
                $scope.$broadcast('checkResultData',checkResultData);
                $scope.$broadcast('confusionInfoData',confusionInfoData);
            })
        });
    });

    /*获取关联poi数据——检查结果*/
    $scope.$on('getRefFtInMap',function(event,data){
        for(var i=0,len=data.length;i<len;i++){
            data[i].kindInfo = metaData.kindFormat[data[i].kindCode];
        }
        $scope.refFt = {
            title:'检查结果',
            refList:data
        };
        $scope.showRelatedPoiInfo = true;
        console.log(data)
    });

    /*显示关联poi详细信息*/
    $scope.showPoiDetailInfo = function(poi,index){
        $ocll.load('../scripts/components/poi/ctrls/edit-tools/poiInfoPopoverCtl').then(function(){
            $scope.poiInfoTpl = '../../scripts/components/poi/tpls/edit-tools/poiInfoPopover.html';
            $scope.$on('$includeContentLoaded', function($event) {
                var poiDetail = {
                    poi:poi,
                    kindName:$scope.refFt.refList[index].kindInfo.kindName
                };
                $scope.$broadcast('poiInfoData',poiDetail);
            });
        });
    };

    /*关闭关联poi数据*/
    $scope.closeRelatedPoiInfo = function(){
        $scope.showRelatedPoiInfo = false;
    };

    /*获取关联poi数据——冲突检测*/
    $scope.$on('getConflictInMap',function(event,data){
        $ocll.load('../scripts/components/poi/ctrls/edit-tools/confusionDataCtl').then(function(){
            $scope.confusionDataTpl = '../../scripts/components/poi/tpls/edit-tools/confusionDataTpl.html';
            $scope.$on('$includeContentLoaded', function($event) {
                $scope.showConflictPoiInfo = true;
                $scope.$broadcast('confusionData',data);
            });
        });
        console.log(data)
    });
    /*切换tag按钮*/
    $scope.changeTag = function(tagName){
        switch(tagName) {
            case 'checkResult':
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/checkResultCtl').then(function(){
                    $scope.tagContentTpl = '../../scripts/components/poi/tpls/edit-tools/checkResultTpl.html';
                    $scope.$on('$includeContentLoaded', function($event) {
                        $scope.$broadcast('checkResultData',checkResultData);
                    });
                });
                break;
            case 'confusionInfo':
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/confusionResultCtl').then(function(){
                    $scope.tagContentTpl = '../../scripts/components/poi/tpls/edit-tools/confusionResultTpl.html';
                    $scope.$on('$includeContentLoaded', function($event) {
                        $scope.$broadcast('confusionInfoData',confusionInfoData);
                    });
                });
                break;
            case 'editHistory':
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/editHistoryCtl').then(function(){
                    $scope.tagContentTpl = '../../scripts/components/poi/tpls/edit-tools/editHistoryTpl.html';
                    $scope.$on('$includeContentLoaded', function($event) {
                        var param = {
                            historyData:editHistoryData,
                            kindFormat:metaData.kindFormat
                        };
                        $scope.$broadcast('editHistoryData',param);
                    });
                });
                break;
            case 'fileUpload':
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/fileUploadCtl').then(function(){
                    $scope.tagContentTpl = '../../scripts/components/poi/tpls/edit-tools/fileUploadTpl.html';
                    $scope.$on('$includeContentLoaded', function($event) {
                        $scope.$broadcast('confusionInfoData',confusionInfoData);
                    });
                });
                break;
            default:
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/checkResultCtl').then(function(){
                    $scope.tagContentTpl = '../../scripts/components/poi/tpls/edit-tools/checkResultTpl.html';
                });
                break;
        }
    };
    /*所有初始化执行方法放在此*/
    $scope.initializeData = function(){
        /*获取检查规则*/
        FM.dataApi.CheckRule.getList(function(data){
            for(var i=0,len=data.length;i<data.length;i++){
                checkRuleObj[data[i].ruleId] = data[i].severity;
            }
        })
        $scope.tagSelect = 'checkResult';
        $scope.changeTag('checkResult');
    }
    $scope.initializeData();
    var initKindFormat = function (kindData){
        for (var i = 0; i < kindData.length; i++) {
            metaData.kindFormat[kindData[i].kindCode] = {
                kindId: kindData[i].id,
                kindName: kindData[i].kindName,
                level: kindData[i].level,
                extend: kindData[i].extend,
                parentFlag: kindData[i].parent,
                chainFlag: kindData[i].chainFlag,
                dispOnLink: kindData[i].dispOnLink,
                mediumId: kindData[i].mediumId
            };
            metaData.kindList.push({
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
        $scope.$broadcast("save", $scope.meta.kindList);
    };

    function realSave(evt, data) {
        // console.log(data);
        $scope.test();
    };

    $scope.$on('emitMainEditorTransParent',function (obj){
        $scope.$broadcast("showParentPoiInMap", $scope.snapshotPoi);
    })
    $scope.$on('emitMainEditorTransChildren',function (obj){
        $scope.$broadcast("showChildrenPoisInMap", $scope.snapshotPoi);
    })
    $scope.loadAdditionInfo = function() {
        $scope.additionInfoTpl = $scope.radioModel;
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
                        $scope.$on('$includeContentLoaded', function($event) {
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
    $scope.$on("saveMe", realSave);
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