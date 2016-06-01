angular.module('app').controller('relationInfoCtl', ['$scope', function($scope) {


    /*临时写死的数据*/
    $scope.relateParent = {
        "parentRowkey":"005956440000013000",
        "parentFid":"0010060815LML01339",
        "name":"北京创然铝塑工业有限公司"
    }
    $scope.relateChildren = [{
        "chindrenFid":"0010060815LML01527",
        "name":"品牌冲突测试"
    },{
        "chindrenFid":"0010071122LK107169",
        "name":"测试名称冲突测试测试"
    },{
        "chindrenFid":"0010071122LK106169",
        "name":"太和收费站"
    }]


    $scope.showChildrenPoisInMap = function (obj){
        $scope.$emit('emitChildren', obj);
    }
    $scope.showParentPoiInMap = function(obj) {
        $scope.$emit('emitParent', obj);
    };

}]);