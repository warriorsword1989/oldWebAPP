/**
 * Created by liwanchong on 2016/3/5.
 */
var formOfWayApp = angular.module("app");
formOfWayApp.controller("addLclinkTypeController",function($scope){
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    $scope.formsData = objCtrl.data.kinds;

    $scope.initializeSelNodeData=function() {
        $scope.lcLinkData=objCtrl.data.getIntegrate();
        $scope.fromOfTypeOption = [
            {"id": 0,  "label": "未分类","isCheck":false},
            {"id": 1,  "label": "海岸线","isCheck":false},
            {"id": 2,  "label": "河川","isCheck":false},
            {"id": 3,  "label": "湖沼地","isCheck":false},
            {"id": 4,  "label": "水库","isCheck":false},
            {"id": 5,  "label": "港湾","isCheck":false},
            {"id": 6,  "label": "运河","isCheck":false},
            {"id": 7,  "label": "单线河","isCheck":false},
            {"id": 8,  "label": "水系假想线","isCheck":false},
            {"id": 11, "label": "公园","isCheck":false},
            {"id": 12, "label": "高尔夫球场","isCheck":false},
            {"id": 13, "label": "滑雪场","isCheck":false},
            {"id": 14, "label": "树林林地","isCheck":false},
            {"id": 15, "label": "草地","isCheck":false},
            {"id": 16, "label": "绿化带","isCheck":false},
            {"id": 17, "label": "岛","isCheck":false},
            {"id": 18, "label": "绿地假想线","isCheck":false}
        ];

        for(var p in $scope.lcLinkData.kinds){
            for(var s in $scope.fromOfTypeOption){
                if($scope.lcLinkData.kinds[p].kind==$scope.fromOfTypeOption[s].id){
                    $scope.fromOfTypeOption[s].isCheck=true;
                }
            }
        }

    }
    //判断除了未分类其他种别是否有选中;
    function isSelectedEexpectFirst(){
        var flag = false;
        for(var i=1;i<$scope.fromOfTypeOption.length;i++){
            if($scope.fromOfTypeOption[i].isCheck){
                flag = true;
                break;
            }
        }
        return flag;
    }

    function setAllFalse(){
        for(var i=1;i<$scope.fromOfTypeOption.length;i++){
            if($scope.fromOfTypeOption[i].isCheck){
                $scope.fromOfTypeOption[i].isCheck = !$scope.fromOfTypeOption[i].isCheck;
            }
        }
    }

    //编辑种类时未分类与其他种别互斥；
    $scope.getCheck=function(item){
        var kinds = objCtrl.data.kinds;
        if(isSelectedEexpectFirst() && item.id!=0){
            if(kinds[kinds.length-1].kind==0){
                kinds.splice(kinds.length-1,1);
                $scope.fromOfTypeOption[0].isCheck = false;
            }
            if(item.isCheck){
                var temp = {
                        linkPid:$scope.lcLinkData.pid,
                        kind:item.id,
                        form:0
                    };
                kinds.unshift(fastmap.dataApi.lcLinkKind(temp));
            }else{
                for(var i = 0 ,len = kinds.length; i < len; i++){
                    if(kinds[i].kind == item.id){
                        kinds.splice(i,1);
                        break;
                    }
                }
            }
        }else{
            //如果其他种别没有选择，默认控制选择为分类
            kinds.splice(0,kinds.length);
            setAllFalse();
            $scope.fromOfTypeOption[0].isCheck = true;
            kinds[0] = fastmap.dataApi.lcLinkKind({
                linkPid:$scope.lcLinkData.pid,
                kind:0,
                form:0
            })
        }
    };


    $scope.initializeSelNodeData();
    eventController.on(eventController.eventTypes.SELECTEDVEHICLECHANGE, $scope.initializeSelNodeData);
})