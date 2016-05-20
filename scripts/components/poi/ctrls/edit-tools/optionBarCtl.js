angular.module('app').controller('OptionBarCtl', ['$scope', '$ocLazyLoad', '$q', 'dsPoi', 'dsMeta', '$http', function($scope, $ocll, $q, poi, meta, $http) {
    var resultAllData = [],
        editHistoryData = {},
        checkResultData = [],
        confusionInfoData = [],
        checkRuleObj = {};
    var distinguishResult = function (data) {
        checkResultData = [];
        confusionInfoData = [];
        /*由于没有数据，这是假数据，有正式数据后放开后面的注释*/
        resultAllData[0] = new FM.dataApi.IxCheckResult({
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
        resultAllData[1] = new FM.dataApi.IxCheckResult({
            "errorCode": "FM-14Win-01-02",
            "errorMsg": "重新确认成果中的设施名称是否正确",
            "fields": ["name"]
        });
        resultAllData[2] = new FM.dataApi.IxCheckResult({
            "errorCode": "FM-YW-20-215",
            "errorMsg": "内部POI必须有父",
            "fields": ["kindCode", "indoor"]
        });
        resultAllData[3] = new FM.dataApi.IxCheckResult({
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
        // editHistoryData[0] = new FM.dataApi.IxEditHistory({"mergeDate": "20160112145422","sourceName": "Android","sourceProject": "2015111243","sourceTask": "","validationMethod": 1, "mergeContents": [{"newValue": "{\"attachments\": [{\"url\": \"2015111243/20160112/365520160112145410.jpg\", \"tag\": 3, \"type\": 1}]}", "oldValue": "{\"attachments\": []}"},{ "newValue": "{\"lifecycle\": 2}","oldValue": "{\"lifecycle\": 0}"},{"newValue": "{\"brands\": [{\"code\": \"4012\"}]}","oldValue": "{\"brands\": []}"},{"newValue": "{\"indoor\": {\"open\": 1, \"type\": 3, \"floor\": null}}","oldValue": "{\"indoor\": {\"open\": 1, \"type\": 0, \"floor\": null}}"},{"newValue": "{\"level\": \"B1\"}","oldValue": "{\"level\": \"B3\"}"},{"newValue": "{\"postCode\": \"235566\"}","oldValue": "{\"postCode\": null}"}],"operator": {"role": 0,"user": 3655},"operation": 2});
        // resultAllData = data.checkResults;
        for (var i = 0, len = resultAllData.length; i < len; i++) {
            if (resultAllData[i].errorCode == 'FM-YW-20-215' || resultAllData[i].errorCode == 'FM-YW-20-216') {
                resultAllData[i].type = checkRuleObj[resultAllData[i].errorCode];
                resultAllData[i].poiType = resultAllData[i].errorCode == 'FM-YW-20-215' ? '重复' : '冲突';
                confusionInfoData.push(resultAllData[i]);
            } else {
                resultAllData[i].type = checkRuleObj[resultAllData[i].errorCode];
                checkResultData.push(resultAllData[i])
            }
        }
        if (data.lifeCycle != 2) {
            /*取最后一条履历*/
            editHistoryData = data.editHistory[data.editHistory.length - 1];
            /*根据履历作业员id查找真实姓名*/
            poi.queryUser(editHistoryData.operator.user.toString()).then(function(userInfo){
                editHistoryData.operator.name = userInfo.realName;
            });
        } else {
            editHistoryData = false;
        }
    }
    /*获取关联poi数据——检查结果*/
    $scope.$on('getRefFtInMap', function (event, data) {
        $ocll.load('../scripts/components/poi/ctrls/edit-tools/poiInfoPopoverCtl').then(function () {
            $scope.poiInfoTpl = '../../scripts/components/poi/tpls/edit-tools/poiInfoPopover.html';
            $scope.layerName = 'checkResultLayer';
            for (var i = 0, len = data.length; i < len; i++) {
                data[i].kindInfo = $scope.metaData.kindFormat[data[i].kindCode];
            }
            $scope.refFt = {
                title: '检查结果关联POI',
                refList: data
            };
            $scope.$emit('showRelatedPoiInfo',$scope.refFt);
            $scope.$broadcast('showPoisInMap', {
                data: data,
                layerId: "checkResultLayer"
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
    /*接收周边查询点信息*/
    $scope.$on('searchPois', function (event, data) {
        $ocll.load('../scripts/components/poi/ctrls/edit-tools/poiInfoPopoverCtl').then(function () {
            $scope.poiInfoTpl = '../../scripts/components/poi/tpls/edit-tools/poiInfoPopover.html';
            $scope.searchPois = data;
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
                                    } else {  //不可为父
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
                    title: '周边1KM范围内的POI',
                    refList: data.data
                };
                $scope.showRelatedPoiInfo = true;
                $scope.layerName = data.layerId;
            });
        });
    });
    /*关闭关联poi数据*/
    $scope.closeRelatedPoiInfo = function () {
        $scope.showRelatedPoiInfo = false;
        $scope.$broadcast('closePopover', $scope.layerName);
    };
    /*编辑关联poi数据*/
    $scope.$on('editPoiInfo', function (event, data) {
        refreshPoiData(data);
    });
    /*改变poi父子关系*/
    $scope.$on('changeRelateParent', function (event, data) {
        $scope.poi.relateParent = data;
    });
    /*获取关联poi数据——冲突检测*/
    $scope.$on('getConflictInMap', function (event, data) {
        $ocll.load('../scripts/components/poi/ctrls/edit-tools/confusionDataCtl').then(function () {
            $scope.confusionDataTpl = '../../scripts/components/poi/tpls/edit-tools/confusionDataTpl.html';
            $scope.showConflictPoiInfo = true;
            data.refData.duppoi.kindName = $scope.metaData.kindFormat[data.refData.duppoi.kindCode].kindName;
            data.refData.duppoi.brandList = $scope.metaData.allChain[data.refData.duppoi.kindCode];
            $scope.optionData.confusionData = data;
        });
        $scope.showConflictInfo = true;
    });
    /*关闭关联poi数据——冲突检测弹框*/
    $scope.closeConflictInfo = function () {
        $scope.showConflictInfo = false;
    }
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
    /*切换tag按钮*/
    $scope.changeTag = function (tagName) {
        switch (tagName) {
            case 'checkResult':
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/checkResultCtl').then(function () {
                    $scope.tagContentTpl = '../../scripts/components/poi/tpls/edit-tools/checkResultTpl.html';
                    /*$scope.$on('$includeContentLoaded', function($event) {
                        $scope.$broadcast('checkResultData', checkResultData);
                    });*/
                    $scope.optionData.checkResultData = checkResultData;
                });
                break;
            case 'confusionInfo':
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/confusionResultCtl').then(function () {
                    $scope.tagContentTpl = '../../scripts/components/poi/tpls/edit-tools/confusionResultTpl.html';
                    $scope.optionData.confusionInfoData = confusionInfoData;
                });
                break;
            case 'editHistory':
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/editHistoryCtl').then(function () {
                    $scope.tagContentTpl = '../../scripts/components/poi/tpls/edit-tools/editHistoryTpl.html';
                    var param = {
                        historyData: editHistoryData,
                        kindFormat: $scope.metaData.kindFormat
                    };
                    $scope.optionData.editHistoryData = param;
                });
                break;
            case 'fileUpload':
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/fileUploadCtl').then(function () {
                    $scope.tagContentTpl = '../../scripts/components/poi/tpls/edit-tools/fileUploadTpl.html';
                });
                break;
            default:
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/checkResultCtl').then(function () {
                    $scope.tagContentTpl = '../../scripts/components/poi/tpls/edit-tools/checkResultTpl.html';
                    $scope.optionData.checkResultData = checkResultData;
                });
                break;
        }
    };
    /*刷新poi对象*/
    function refreshPoiData(fid) {
        $scope.poi = $scope.poi;
        $scope.snapshotPoi = $scope.poi.getSnapShot();
        distinguishResult($scope.poi);
        if ($scope.poi.lifeCycle == 1) {
            $scope.pEditable = false;
        } else {
            $scope.pEditable = true;
        }
        $scope.$broadcast('checkResultData', checkResultData);
        $scope.$broadcast('confusionInfoData', confusionInfoData);
        /*poi.getPoiDetailByFid(fid).then(function(data) {
            $scope.poi = data;
            $scope.snapshotPoi = data.getSnapShot();
            distinguishResult(data);
            if (data.lifeCycle == 1) {
                $scope.pEditable = false;
            } else {
                $scope.pEditable = true;
            }
            $scope.$broadcast('checkResultData', checkResultData);
            $scope.$broadcast('confusionInfoData', confusionInfoData);
        });*/
    }
    /*所有初始化执行方法放在此*/
    function initializeData() {
        $scope.optionData = {};
        /*获取检查规则*/
        poi.queryRule().then(function (data) {
            for (var i = 0, len = data.length; i < data.length; i++) {
                checkRuleObj[data[i].ruleId] = data[i].severity;
            }
            refreshPoiData('0010060815LML01353');
        });
        $scope.tagSelect = 'checkResult';
        $scope.changeTag('checkResult');
    }
    initializeData();
}]);