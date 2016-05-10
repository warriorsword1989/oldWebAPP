angular.module('app',['oc.lazyLoad', 'ui.bootstrap', 'dataService']).controller('EditHistoryCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi', function($scope, $ocll, $rs, $q, poi) {
    $scope.theadInfo = ['序号','作业员','操作时间','操作描述','平台'];
    $scope.$on("editHistoryData", function(event, data) {
        $scope.editHistory = [];
        console.log(data)
        /*重组履历数据*/
        for(var i=0,len=data.mergeContents.length;i<len;i++){
            var hisTemp = {};
            hisTemp.name = data.operator.name;
            hisTemp.mergeDate = data.mergeDate;
            hisTemp.mergeContent = data.mergeContents[i];
            hisTemp.sourceName = data.sourceName;
            $scope.editHistory.push(hisTemp);
        }
    });
}]);