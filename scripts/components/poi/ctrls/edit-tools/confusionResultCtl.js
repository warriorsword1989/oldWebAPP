angular.module('app',['oc.lazyLoad', 'ui.bootstrap', 'dataService']).controller('ConfusionResultCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi', function($scope, $ocll, $rs, $q, poi) {
    $scope.theadInfo = ['序号','规则编码','错误描述','操作','关联POI'];
    $scope.checkResult = [
        {id:123,code:'023r2',err:'上传错误',operate:'上传',poi:'23011'},
        {id:123,code:'023r2',err:'上传错误',operate:'上传',poi:'23011'},
        {id:123,code:'023r2',err:'上传错误',operate:'上传',poi:'23011'},
        {id:123,code:'023r2',err:'上传错误',operate:'上传',poi:'23011'},
        {id:123,code:'023r2',err:'上传错误',operate:'上传',poi:'23011'}
    ];
    $scope.checkResult = [];
}]);