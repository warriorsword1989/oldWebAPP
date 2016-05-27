angular.module('app').controller('generalBaseCtl', ['$scope', '$ocLazyLoad', '$q', 'dsPoi','dsMeta', function($scope, $ocll, $q, poi, meta) {

    /*切换tag按钮*/
    $scope.changeProperty = function (tagName) {
        $scope.propertyType = tagName;
        switch (tagName) {
            case 'base':
                $ocll.load('scripts/components/poi-new/ctrls/attr-base/baseInfoCtl').then(function () {
                    $scope.baseInfoTpl = '../../../scripts/components/poi-new/tpls/attr-base/baseInfoTpl.html';
                });
                break;
            case 'deep':
                $ocll.load('scripts/components/poi-new/ctrls/attr-deep/deepInfoCtl').then(function () {
                    $scope.deepInfoTpl = '../../../scripts/components/poi-new/tpls/attr-deep/deepInfoTpl.html';
                });
                break;
            case 'relate':
                $ocll.load('scripts/components/poi-new/ctrls/attr-base/relationInfoCtl').then(function () {
                    $scope.relationInfoTpl = '../../../scripts/components/poi-new/tpls/attr-base/relationInfoTpl.html';
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

    /*默认显示baseInfo的tab页*/
    function initShowTag(){
        $scope.propertyType = "base";
        $scope.changeProperty('base');
    }

    initShowTag();

}]);