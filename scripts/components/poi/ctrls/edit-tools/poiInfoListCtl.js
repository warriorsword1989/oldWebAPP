angular.module('app').controller('PoiInfoListCtl', ['$scope', '$ocLazyLoad', function ($scope, $ocll) {
    /* 关联poi的检查结果*/
    $scope.$on('showPoiListData', function (event, data) {
        $ocll.load('../scripts/components/poi/ctrls/edit-tools/poiInfoPopoverCtl').then(function () {
            $scope.poiInfoTpl = '../../scripts/components/poi/tpls/edit-tools/poiInfoPopover.html';
            $scope.$emit('getLayerName', 'checkResultLayer');
            // $scope.$emit('showRelatedPoiInfo',$scope.refFt);
        });
    });
}]);
