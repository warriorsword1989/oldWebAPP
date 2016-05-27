angular.module('app').controller('ConfusionDataCtl', ['$scope', function($scope) {
    function initData(){
        $scope.confusionData = $scope.optionData.confusionData;
        $scope.dupPoi = $scope.optionData.confusionData.refData.duppoi;
        /*查找冲突字段*/
        var conflictFields = $scope.optionData.confusionData.refData.conflictFields.split('|');
        $scope.conflict = {
            fid:false,
            pid:false,
            name:false,
            address:false,
            contacts:false,
            postCode:false,
            kindCode:false,
            brandCode:false,
            level:false
        };
        for(var i=0;i<conflictFields.length;i++){
            $scope.conflict[conflictFields[i]] = true;
        }
        /*查找品牌名称*/
        var brandList = $scope.dupPoi.brandList;
        for (var i=0;i<brandList.length;i++){
            if($scope.optionData.confusionData.refData.duppoi.brands.code == brandList[i].chainCode){
                $scope.dupPoi.chainName = brandList[i].chainName;
            }
        }
    };
    /*初始化数据*/
    initData();
}]);