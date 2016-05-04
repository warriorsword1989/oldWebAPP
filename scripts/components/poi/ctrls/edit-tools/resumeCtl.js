angular.module('app',['oc.lazyLoad', 'ui.bootstrap', 'dataService']).controller('resumeCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi', function($scope, $ocll, $rs, $q, poi) {
    $scope.theadInfo = ['序号','作业员','操作时间','操作描述','平台'];
    $scope.checkResult = [
        {id:123,code:'023r2',err:'上传错误',operate:'上传',poi:'23011'},
        {id:123,code:'023r2',err:'上传错误',operate:'上传',poi:'23011'},
        {id:123,code:'023r2',err:'上传错误',operate:'上传',poi:'23011'},
        {id:123,code:'023r2',err:'上传错误',operate:'上传',poi:'23011'},
        {id:123,code:'023r2',err:'上传错误',operate:'上传',poi:'23011'}
    ];
    $scope.checkResult = [];
}]);