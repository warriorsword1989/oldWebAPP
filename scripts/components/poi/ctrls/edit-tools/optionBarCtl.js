angular.module('app',['oc.lazyLoad', 'ui.bootstrap', 'dataService']).controller('optionBarCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi', function($scope, $ocll, $rs, $q, poi) {
    var tags = $scope.tags = {};
    tags.optionBars = [
        {code:'checkResult',label:'检查结果'},
        {code:'confusionResult',label:'冲突检测'},
        {code:'editHistory',label:'作业履历'},
        {code:'fileUpload',label:'文件上传'},
        {code:'remarks',label:'备注'}
    ];
    /*默认项*/
    tags.selection = tags.optionBars[0];
    /*切换tag按钮*/
    $scope.changeTag = function(){
        switch(tags.selection.code) {
            case 'checkResult':
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/checkResultCtl').then(function(){
                    $scope.tagContent = '../../scripts/components/poi/tpls/edit-tools/checkResultTpl.html';
                });
                break;
            case 'confusionResult':
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/confusionResultCtl').then(function(){
                    $scope.tagContent = '../../scripts/components/poi/tpls/edit-tools/checkResultTpl.html';
                });
                break;
            case 'editHistory':
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/editHistoryCtl').then(function(){
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
                $ocll.load('../scripts/components/poi/ctrls/edit-tools/checkResultCtl').then(function(){
                    $scope.tagContent = '../../scripts/components/poi/tpls/edit-tools/checkResultTpl.html';
                });
                break;
        }
    };
    $scope.changeTag();
}]);