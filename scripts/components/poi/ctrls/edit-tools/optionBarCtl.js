angular.module('app',['oc.lazyLoad', 'ui.bootstrap', 'dataService']).controller('OptionBarCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi', function($scope, $ocll, $rs, $q, poi) {
    var resultAllData = [],
        editHistoryData = [],
        checkResultData = [],
        confusionResultData = [],
        checkRuleObj = {};
    var tags = $scope.tags = {};
    tags.optionBars = [
        {code:'checkResult',label:'检查结果'},
        {code:'confusionResult',label:'冲突检测'},
        {code:'editHistory',label:'作业履历'},
        {code:'fileUpload',label:'文件上传'},
        {code:'remarks',label:'备注'}
    ];
    /*获取检查规则*/
    FM.dataApi.CheckRule.getList(function(data){
        for(var i=0,len=data.length;i<data.length;i++){
            checkRuleObj[data[i].ruleId] = data[i].severity;
        }
        console.log(checkRuleObj)
    })
    var distinguishResult = function(data){
        for(var i,len=data.length;i<len;i++){
            if(data[i].errcode){}
        }
    }
    $scope.$on("loadup", function(event, data) {
        resultAllData = data.checkResults;
        editHistoryData = data.editHistory;
        console.log(checkResultData,editHistoryData)
    });
    /*默认项*/
    tags.selection = tags.optionBars[0];
    /*切换tag按钮*/
    $scope.changeTag = function(){
        switch($scope.tagSelect) {
            case 'checkResult':
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/CheckResultCtl').then(function(){
                    $scope.tagContent = '../../scripts/components/poi/tpls/edit-tools/checkResultTpl.html';

                });
                break;
            case 'confusionResult':
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/ConfusionResultCtl').then(function(){
                    $scope.tagContent = '../../scripts/components/poi/tpls/edit-tools/checkResultTpl.html';
                });
                break;
            case 'editHistory':
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/EditHistoryCtl').then(function(){
                    $scope.tagContent = '../../scripts/components/poi/tpls/edit-tools/editHistoryTpl.html';
                });
                break;
            case 'fileUpload':
                $scope.tagContent = '';
                break;
            case 'remarks':
                $scope.tagContent = '';
                break;
            default:
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/CheckResultCtl').then(function(){
                    $scope.tagContent = '../../scripts/components/poi/tpls/edit-tools/checkResultTpl.html';
                });
                break;
        }
    };
    $scope.changeTag();
}]);