angular.module('app').controller('OptionBarCtl', ['$scope', '$ocLazyLoad', '$q', 'dsPoi','dsMeta', function($scope, $ocll, $q, poi, meta) {
    var checkRuleObj = {};
    /*翻页事件*/
    $scope.turnPage = function(type){
        if(type == 'prev'){     //上一页
            $scope.$emit('trunPaging','prev');
        }else{      //  下一页
            $scope.$emit('trunPaging','next');
        }
    }
    var distinguishResult = function (data) {
        /*检查规则*/
        // for (var i = 0, len = $scope.poi.checkResults.length; i < len; i++) {
        //     $scope.poi.checkResults[i].setCheckRule(checkRuleObj[$scope.poi.checkResults[i].errorCode])
        // }
        // if ($scope.poi.lifeCycle != 2) {
        //     /*根据履历作业员id查找真实姓名*/
        //     poi.queryUser($scope.poi.editHistoryData.operator.user.toString()).then(function(userInfo){
        //         $scope.poi.editHistoryData.operator.name = userInfo.realName;
        //     });
        // }else {
        //     $scope.poi.editHistoryData = false;
        // }

        $scope.outputResult = [
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"}),
            new FM.dataApi.IxOutput({type:'RDNODE',pid:100004351,childPid:"",op:"删除"}),
            new FM.dataApi.IxOutput({type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"})
        ];
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
        $scope.tagSelect = tagName;
        switch (tagName) {
            case 'outputResult':
                $ocll.load('scripts/components/poi-new/ctrls/edit-tools/outputResultCtl').then(function () {
                    $scope.tagContentTpl = '../../../scripts/components/poi-new/tpls/edit-tools/outputResultTpl.html';
                });
                break;
            case 'errorCheck':
                $ocll.load('scripts/components/poi-new/ctrls/edit-tools/errorCheckCtl').then(function () {
                    $scope.tagContentTpl = '../../../scripts/components/poi-new/tpls/edit-tools/errorCheckTpl.html';
                });
                break;
            case 'searchResult':
                $ocll.load('scripts/components/poi-new/ctrls/edit-tools/searchResultCtl').then(function () {
                    $scope.tagContentTpl = '../../../scripts/components/poi-new/tpls/edit-tools/searchResultTpl.html';
                });
                break;
            case 'checkResult':
                $ocll.load('scripts/components/poi-new/ctrls/edit-tools/checkResultCtl').then(function () {
                    $scope.tagContentTpl = '../../../scripts/components/poi-new/tpls/edit-tools/checkResultTpl.html';
                });
                break;
            case 'confusionInfo':
                $ocll.load('scripts/components/poi-new/ctrls/edit-tools/confusionResultCtl').then(function () {
                    $scope.tagContentTpl = '../../../scripts/components/poi-new/tpls/edit-tools/confusionResultTpl.html';
                });
                break;
            case 'editHistory':
                $ocll.load('scripts/components/poi-new/ctrls/edit-tools/editHistoryCtl').then(function () {
                    $scope.tagContentTpl = '../../../scripts/components/poi-new/tpls/edit-tools/editHistoryTpl.html';
                });
                break;
            default:
                $ocll.load('scripts/components/poi-new/ctrls/edit-tools/checkResultCtl').then(function () {
                    $scope.tagContentTpl = '../../../scripts/components/poi-new/tpls/edit-tools/checkResultTpl.html';
                });
                break;
        }
    };
    /*清空数据*/
    $scope.emptyTableResult = function(type){
        if(type == 'outputResult'){     //输出结果
            $scope.outputResult = [];
        }else{

        }
    }
    /*刷新检查*/
    $scope.refreshCheckResult = function(){
        $scope.$emit('refreshCheckReusltData',true);
    }
    /*刷新poi对象*/
    function refreshPoiData() {
        $scope.snapshotPoi = $scope.poi.getSnapShot();
        distinguishResult($scope.poi);
        if ($scope.poi.lifeCycle == 1) {
            $scope.pEditable = false;
        } else {
            $scope.pEditable = true;
        }
        $scope.$broadcast('checkResultData', $scope.poi.checkResultData);
        $scope.$broadcast('confusionInfoData', $scope.poi.confusionInfoData);
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
        $scope.tagSelect = 'outputResult';
        $scope.changeTag('outputResult');
        /*if($scope.poi.checkResultData.length > 0){
            $scope.tagSelect = 'checkResult';
            $scope.changeTag('checkResult');
        }else if($scope.poi.confusionInfoData.length > 0){
            $scope.tagSelect = 'confusionInfo';
            $scope.changeTag('confusionInfo');
        }else if($scope.poi.editHistory.length > 0){
            $scope.tagSelect = 'editHistory';
            $scope.changeTag('editHistory');
        }*/
    }
    initShowTag();
}]);