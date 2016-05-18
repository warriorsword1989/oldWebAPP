angular.module('app').controller('PoiInfoPopoverCtl', ['$scope', function($scope) {
    initData();
    function initData(){
        $scope.poiInfo = $scope.poiDetail;
        isLocked();
        $scope.platform = App.Config.appType;
    }
    /*判断操作员和poi编辑人是否一致*/
    function isLocked(){
        if($scope.poi.handler == getCookieUserId()){
            $scope.isLocked = false;
        }else{
            $scope.isLocked = true;
        }
    }
    /*查询cookie中操作员id*/
    function getCookieUserId(){
        var userId = "";
        var arr = document.cookie.split('; ');
        for(var i=0;i<arr.length;i++){
            if(arr[i].indexOf('FM_USER_ID') > -1){
                userId = arr[i].split('=')[1];
                break;
            }
        }
        return userId;
    }
    /*锁定数据*/
    $scope.doLockRelatedPoi = function(fid){
        var param = {
            fid: fid,
            projectId: 2016013086,
            featcode: "poi",
            access_token:App.Config.accessToken
        };
        $scope.$emit('lockSingleData',param);
    }
    /*编辑数据*/
    $scope.doEditRelatedPoi = function(fid){
        $scope.$emit('editPoiInfo',fid);
    }
    /*解除父*/
    $scope.removeRelateParent = function(){
        $scope.$emit('changeRelateParent',null);
    }
    /*作为父*/
    $scope.asRelateParent = function(poi){
        var param = {
            parentRowkey:poi.rowKey,
            parentFid:poi.fid
        };
        $scope.$emit('changeRelateParent',param);
    }
}]);