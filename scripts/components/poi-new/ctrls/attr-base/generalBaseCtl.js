angular.module('app').controller('generalBaseCtl', ['$scope', '$ocLazyLoad', '$q', 'dsPoi','dsMeta', function($scope, $ocll, $q, poi, meta) {



    /*切换tag按钮*/
    $scope.changeProperty = function (tagName) {
        $scope.propertyType = tagName;
        switch (tagName) {
            case 'base':
                $ocll.load('scripts/components/poi-new/ctrls/edit-tools/checkResultCtl').then(function () {
                    $scope.tagContentTpl = '../../../scripts/components/poi-new/tpls/edit-tools/checkResultTpl.html';
                });
                break;
            case 'deep':
                $ocll.load('scripts/components/poi-new/ctrls/edit-tools/confusionResultCtl').then(function () {
                    $scope.tagContentTpl = '../../../scripts/components/poi-new/tpls/edit-tools/confusionResultTpl.html';
                });
                break;
            case 'relate':
                $ocll.load('scripts/components/poi-new/ctrls/edit-tools/editHistoryCtl').then(function () {
                    $scope.tagContentTpl = '../../../scripts/components/poi-new/tpls/edit-tools/editHistoryTpl.html';
                });
                break;
            case 'file':
                $ocll.load('scripts/components/poi-new/ctrls/edit-tools/fileUploadCtl').then(function() {
                    $scope.fileUploadTpl = '../../../scripts/components/poi-new/tpls/edit-tools/fileUploadTpl.html';
                });
                break;
            default:
                $ocll.load('scripts/components/poi-new/ctrls/edit-tools/checkResultCtl').then(function () {
                    $scope.tagContentTpl = '../../../scripts/components/poi-new/tpls/edit-tools/checkResultTpl.html';
                });
                break;
        }
    };

    /*判断默认显示哪个tab*/
    $scope.propertyType = 'base';

}]);