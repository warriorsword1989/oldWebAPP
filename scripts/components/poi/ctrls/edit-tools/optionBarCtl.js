angular.module('app').controller('OptionBarCtl', ['$scope', '$ocLazyLoad', '$q', 'dsPoi', 'dsMeta', '$http', function($scope, $ocll, $q, poi, meta, $http) {
    var resultAllData = [],
        resultIgnoreData = [],
        checkRuleObj = {};
    var distinguishResult = function (data) {
        resultAllData = $scope.poi.checkResults;
        resultIgnoreData = $scope.poi.ckException;
        $scope.optionData = {
            confusionInfoData:[],
            checkResultData:[],
            editHistoryData:[]
        };
        for (var i = 0, len = resultAllData.length; i < len; i++) {
            if (resultAllData[i].errorCode == 'FM-YW-20-215' || resultAllData[i].errorCode == 'FM-YW-20-216') {
                resultAllData[i].type = checkRuleObj[resultAllData[i].errorCode];
                resultAllData[i].poiType = resultAllData[i].errorCode == 'FM-YW-20-215' ? '重复' : '冲突';
                $scope.optionData.confusionInfoData.push(resultAllData[i]);
            } else {
                resultAllData[i].type = checkRuleObj[resultAllData[i].errorCode];
                $scope.optionData.checkResultData.push(resultAllData[i])
            }
        }
        /*ekException*/
        for (var i = 0, len = resultIgnoreData.length; i < len; i++) {
            resultIgnoreData[i].type = 2;
            resultIgnoreData[i].refFeatures = [];
            if (resultIgnoreData[i].errorCode == 'FM-YW-20-215' || resultIgnoreData[i].errorCode == 'FM-YW-20-216') {
                resultIgnoreData[i].poiType = resultIgnoreData[i].errorCode == 'FM-YW-20-215' ? '重复' : '冲突';
                $scope.optionData.confusionInfoData.push(resultIgnoreData[i]);
            } else {
                $scope.optionData.checkResultData.push(resultIgnoreData[i])
            }
        }
        if ($scope.poi.lifeCycle != 2) {
            $scope.historyData = $scope.poi.editHistory[$scope.poi.editHistory.length - 1];
            /*根据履历作业员id查找真实姓名*/
            poi.queryUser($scope.historyData.operator.user.toString()).then(function(userInfo){
                $scope.historyData.operator.name = userInfo.realName;
            });
        }else {
            $scope.historyData = false;
        }
    }
    /*编辑关联poi数据*/
    $scope.$on('editPoiInfo', function (event, data) {
        refreshPoiData(data);
    });
    /*改变poi父子关系*/
    $scope.$on('changeRelateParent', function (event, data) {
        $scope.poi.relateParent = data;
    });
    /*切换tag按钮*/
    $scope.changeTag = function (tagName) {
        switch (tagName) {
            case 'checkResult':
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/checkResultCtl').then(function () {
                    $scope.tagContentTpl = '../../scripts/components/poi/tpls/edit-tools/checkResultTpl.html';
                });
                break;
            case 'confusionInfo':
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/confusionResultCtl').then(function () {
                    $scope.tagContentTpl = '../../scripts/components/poi/tpls/edit-tools/confusionResultTpl.html';
                });
                break;
            case 'editHistory':
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/editHistoryCtl').then(function () {
                    $scope.tagContentTpl = '../../scripts/components/poi/tpls/edit-tools/editHistoryTpl.html';
                    $scope.optionData.editHistoryData = {
                        historyData: $scope.historyData,
                        kindFormat: $scope.metaData.kindFormat
                    };
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
                });
                break;
        }
    };
    /*刷新poi对象*/
    function refreshPoiData() {
        $scope.snapshotPoi = $scope.poi.getSnapShot();
        distinguishResult($scope.poi);
        if ($scope.poi.lifeCycle == 1) {
            $scope.pEditable = false;
        } else {
            $scope.pEditable = true;
        }
        $scope.$broadcast('checkResultData', $scope.optionData.checkResultData);
        $scope.$broadcast('confusionInfoData', $scope.optionData.confusionInfoData);
    }

    /*所有初始化执行方法放在此*/
    function initializeData() {
        for (var i = 0, len = $scope.checkRuleList.length; i < len; i++) {
            checkRuleObj[$scope.checkRuleList[i].ruleId] = $scope.checkRuleList[i].severity;
        }
        refreshPoiData();
    }
    initializeData();

    /*当poi刷新broadcast此方法*/
    $scope.$on('initOptionData',function(event,data){
       initializeData();
    });
    /*判断默认显示哪个tab*/
    function initShowTag(){
        if($scope.optionData.checkResultData.length > 0){
            $scope.tagSelect = 'checkResult';
            $scope.changeTag('checkResult');
        }else if($scope.optionData.confusionInfoData.length > 0){
            $scope.tagSelect = 'confusionInfo';
            $scope.changeTag('confusionInfo');
        }else if($scope.optionData.editHistoryData.length > 0){
            $scope.tagSelect = 'editHistory';
            $scope.changeTag('editHistory');
        }else{
            $scope.tagSelect = 'fileUpload';
            $scope.changeTag('fileUpload');
        }
    }
    initShowTag();
}]);