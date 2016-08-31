/**
 * Created by liwanchong on 2016/3/5.
 */
var formOfWayApp = angular.module("app");
formOfWayApp.controller("addDirectOfRestController",function($scope){
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    $scope.formsData = objCtrl.data.kinds;

    $scope.initializeSelNodeData=function() {
        $scope.lcLinkData=objCtrl.data.getIntegrate();
        $scope.fromOfTypeOption = [
            {"id": "0", "label": "未分类","isCheck":false},
            {"id": "1", "label": "海岸线","isCheck":false},
            {"id": "2", "label": "河川","isCheck":false},
            {"id": "3", "label": "湖沼地","isCheck":false},
            {"id": "4", "label": "水库","isCheck":false},
            {"id": "5", "label": "港湾","isCheck":false},
            {"id": "6", "label": "运河","isCheck":false},
            {"id": "7", "label": "单线河","isCheck":false},
            {"id": "8", "label": "水系假象线","isCheck":false},
            {"id": "11", "label": "公园","isCheck":false},
            {"id": "12", "label": "高尔夫球场","isCheck":false},
            {"id": "13", "label": "滑雪场","isCheck":false},
            {"id": "14", "label": "树林林地","isCheck":false},
            {"id": "15", "label": "草地","isCheck":false},
            {"id": "16", "label": "绿化带","isCheck":false},
            {"id": "17", "label": "岛","isCheck":false},
            {"id": "18", "label": "绿地假象线","isCheck":false},
        ];
        $scope.newLcLinkKindsData=[];
        for(var p in $scope.lcLinkData.kinds){
            for(var s in $scope.fromOfTypeOption){
                if($scope.lcLinkData.kinds[p].kind==$scope.fromOfTypeOption[s].id){
                    $scope.fromOfTypeOption[s].isCheck=true;
                    $scope.newLcLinkKindsData.push($scope.fromOfTypeOption[s].id);
                }
            }
        }
    }

    //编辑种类时；
    $scope.getCheck=function(item){
        var tempobj = {};
        var tempNum = $scope.newLcLinkKindsData.indexOf(item.id)
        tempobj.linkPid = $scope.lcLinkData.pid;
        tempobj.rowId = $scope.lcLinkData.kinds[0].rowId;
        tempobj.kind = item.id;
        tempobj.form = 0;
        if(item.isCheck && tempNum==-1){
            objCtrl.data.kinds.push(fastmap.dataApi.lcLinkKind(tempobj))
        }else{
            objCtrl.data.kinds.splice(tempNum,1)
        }
    }


    $scope.initializeSelNodeData()
    eventController.on(eventController.eventTypes.SELECTEDVEHICLECHANGE, $scope.initializeSelNodeData);
})