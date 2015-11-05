/**
 * Created by liwanchong on 2015/10/24.
 */
var objectEditApp = angular.module("lazymodule", []);
objectEditApp.controller("normalController", function ($scope) {
    var objectEditCtrl = new fastmap.uikit.ObjectEditController();
    objectEditCtrl.setOriginalData( $.extend(true,{},objectEditCtrl.data));
    $scope.rdLinkData = $scope.$parent.$parent.rdRestrictData;
    $scope.showTips = function (id) {
        alert(id);
    };
    //初始化交限
    $scope.addLimitedData = [
        {"id":1},
        {"id":2},
        {"id":3},
        {"id":4},
        {"id":5},
        {"id":6},
        {"id":7},
        {"id":8},
        {"id":9},
        {"id":11},
        {"id":22},
        {"id":33},
        {"id":44},
        {"id":55},
        {"id":66},
        {"id":77},
        {"id":88},
        {"id":99}

    ];
    $scope.vehicleOptions = [
        {"id": 0, "label": "客车(小汽车)"},
        {"id": 1, "label": "配送卡车"},
        {"id": 2, "label": "运输卡车"},
        {"id": 3, "label": "步行车"},
        {"id": 4, "label": "自行车"},
        {"id": 5, "label": "摩托车"},
        {"id": 6, "label": "机动脚踏两用车"},
        {"id": 7, "label": "急救车"},
        {"id": 8, "label": "出租车"},
        {"id": 9, "label": "公交车"},
        {"id": 10, "label": "工程车"},
        {"id": 11, "label": "本地车辆"},
        {"id": 12, "label": "自用车辆"},
        {"id": 13, "label": "多人乘坐车辆"},
        {"id": 14, "label": "军车"},
        {"id": 15, "label": "有拖车的车"},
        {"id": 16, "label": "私营公共汽车"},
        {"id": 17, "label": "农用车"},
        {"id": 18, "label": "载有易爆品的车辆"},
        {"id": 19, "label": "载有水污染品的车辆"},
        {"id": 20, "label": "载有其他污染品的车辆"},
        {"id": 21, "label": "电车"},
        {"id": 22, "label": "轻轨"},
        {"id": 23, "label": "校车"},
        {"id": 24, "label": "四轮驱动车"},
        {"id": 25, "label": "装有防雪链的车"},
        {"id": 26, "label": "邮政车"},
        {"id": 27, "label": "槽罐车"},
        {"id": 28, "label": "残疾人车"},
        {"id": 29, "label": "预留"},
        {"id": 30, "label": "预留"},
        {"id": 31, "label": "标志位,禁止/允许(0/1)"}
    ];
    if( objectEditCtrl.data.details.length!==0) {
        $scope.rdSubRestrictData = objectEditCtrl.data.details[0];
    }

    $scope.selectTip = function (item) {
        $scope.tipsId = item.id;
        var obj={};
            obj.flag = item.id;
            obj.outLinkPid =""; //$scope.rdLink.outPid;
            obj.pid = "";//featCodeCtrl.newObj.pid;
            obj.relationshipType = 1;
            obj.restricInfo = 1;
            obj.restricPid =""// featCodeCtrl.newObj.pid;
            obj.type = 1;
            obj.conditons = [];
           $scope.newLimited = obj;
    };
    $scope.addTips = function () {
        if ($scope.tipsId === null || $scope.tipsId === undefined) {
            alert("请先选择tips");
            return;
        }
        var tipsObj = $scope.rdRestrictData.details;
        //for (var i = 0, len = tipsObj.length; i < len; i++) {
        //    if (tipsObj[i].flag === $scope.tipsId) {
        //        alert("重复");
        //        return;
        //    }
        //}
        $scope.rdRestrictData.details.push( $scope.newLimited );

    }
    //增加时间段
    $scope.addTime=function(){
        $scope.rdRestrictData.time.unshift({startTime: "", endTime: ""});
    }
    //删除时间段
    $scope.minusTime=function(id) {
        $scope.rdRestrictData.time.splice(id, 1);
    };
    $scope.$parent.$parent.save=function() {
        objectEditCtrl.setCurrentObject($scope.rdLinkData);
        objectEditCtrl.save();
        console.log(objectEditCtrl.changedProperty);
    };
    $scope.$parent.$parent.delete=function(){
        //objectEditCtrl.setCurrentObject($scope.rdLinkData);
        //objectEditCtrl.remove();
        //http://192.168.4.130/FosEngineWeb/pdh/obj/edit?parameter=
        // {"command":"updaterestriction","projectId":1,"data":{"pid":2131,"objStatus":"DELETE"}}
        var pid=parseInt($scope.$parent.$parent.rdRestrictData.pid);
        var param  = {
            "command": "updaterestriction",
            "projectId": 1,
            "data": {
                "pid":pid,
                "objStatus":"DELETE"
            }
        }
        //结束编辑状态
        console.log("I am removing obj"+pid);
        Application.functions.saveProperty(JSON.stringify(param),function(data){
            var outputcontroller = new fastmap.uikit.OutPutController({});
            outputcontroller.pushOutput(data.data);

            console.log("交限 "+id+" has been removed");
        })


    }
});
