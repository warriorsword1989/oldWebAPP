/**
 * Created by liwanchong on 2016/2/29.
 */
var addDirectOfRest = angular.module("myApp", []);
addDirectOfRest.controller("addDirectOfRestController",function($scope,$timeout){
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var layerCtrl = fastmap.uikit.LayerController();
    $scope.closeWin= function () {

    }
    $scope.initializeSelNodeData=function() {
        $scope.rdNodeData=objectEditCtrl.data.data;
        $scope.rdNodepid=
        $scope.fromOfWayOption=[
            {"id":0,"label":"未调查","isCheck":false},
            {"id":1,"label":"无属性","isCheck":false},
            {"id":2,"label":"图廓点","isCheck":false},
            {"id":3,"label":"CRF Info点","isCheck":false},
            {"id":4,"label":"收费站","isCheck":false},
            {"id":5,"label":"Hihgway起点","isCheck":false},
            {"id":6,"label":"Highway终点","isCheck":false},
            {"id":10,"label":"IC","isCheck":false},
            {"id":11,"label":"JCT","isCheck":false},
            {"id":12,"label":"桥","isCheck":false},
            {"id":13,"label":"隧道","isCheck":false},
            {"id":14,"label":"车站","isCheck":false},
            {"id":15,"label":"障碍物","isCheck":false},
            {"id":16,"label":"门牌号码点","isCheck":false},
            {"id":20,"label":"幅宽变化点","isCheck":false},
            {"id":21,"label":"种别变化点","isCheck":false},
            {"id":22,"label":"车道变化点","isCheck":false},
            {"id":23,"label":"分隔带变化点","isCheck":false},
            {"id":30,"label":"铁道道口","isCheck":false},
            {"id":31,"label":"有人看守铁道道口","isCheck":false},
            {"id":32,"label":"无人看守铁道道口","isCheck":false},
            {"id":41,"label":"KDZone与道路交点","isCheck":false}
        ];



        $scope.newFromOfWRoadDate=[];
        for(var p in $scope.rdNodeData.forms){
            for(var s in $scope.fromOfWayOption){
                if($scope.rdNodeData.forms[p].formOfWay==$scope.fromOfWayOption[s].id){
                    $scope.fromOfWayOption[s].isCheck=true;
                }
            }
        }
    }

    objectEditCtrl.selectNodeRefresh=function(){
        $scope.initializeSelNodeData();
    }

    if(objectEditCtrl.data.data) {
        $scope.initializeSelNodeData();
    }

    $scope.getCheck=function(item){
        item.isCheck=true;
        var obj={};
        obj.auxiFlag=0;
        obj.formOfWay=item.id;
        $scope.rdNodeData.forms.push(obj);
        objectEditCtrl.nodeObjRefresh();
    }
    
    $scope.remove= function (item) {
        item.isCheck=false;
        for(var p in $scope.rdNodeData.forms){
            if($scope.rdNodeData.forms[p].formOfWay==item.id){
                $scope.rdNodeData.forms.splice(p,1);
            }
        }
        objectEditCtrl.nodeObjRefresh();
    }

})