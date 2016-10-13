/**
* Created by linglong   on 2016/8/23.
 */
angular.module('app').controller('commonDeep', function($scope,$ocLazyLoad) {
    $scope.maxTimeItemsLength = 3;
    $scope.timeItems = [];
    $scope.currentHandleTimeData = '';
    $scope.currentHandleStatus = '';//编辑和查看两种；

    //加载时间编辑面板;
    $ocLazyLoad.load('scripts/components/poi/ctrls/attr-deep/commonDeepTimeCtrl').then(function() {
        $scope.dayTimePopoverURL = '../../../scripts/components/poi/tpls/attr-deep/commonDeepTimeTpl.html';
    });

});