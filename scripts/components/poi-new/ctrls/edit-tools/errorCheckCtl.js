angular.module('app').controller('ErrorCheckCtl', ['$scope', function($scope) {


    $scope.theadInfo = ['检查规则号','错误等级','错误对象','错误信息','检查时间','作业员','检查管理'];
    //状态
    $scope.initTypeOptions = [
        {"id": 0, "label": " 未修改"},
        {"id": 1, "label": " 例外"},
        {"id": 2, "label": " 确认不修改"},
        {"id": 3, "label": " 确认已修改"}
    ];
    $scope.initType = 0;
    $scope.errorCheckData = [new FM.dataApi.IxCheckResult({"id": "ef9be156fb6e58aabefbaa88c130eb04",
            "ruleid": "GLM56004",
            "rank": 1,
            "targets": "[RD_LINK,100005324]",
            "information": "修形中产生自相交，要提示立交或打断",
            "geometry": "(116.48112,40.01554)",
            "create_date": "2016-05-31 13:53:46",
            "worker": "TEST"
        }),
        new FM.dataApi.IxCheckResult({
            "id": "03aa39d0fea15a8e3d5b402869a980d1",
            "ruleid": "SHAPING_CHECK_CROSS_RDLINK_RDLINK",
            "rank": 1,
            "targets": "[RD_LINK,100005324]",
            "information": "两条Link相交，必须做立交或者打断",
            "geometry": "(116.48263,40.01585)",
            "create_date": "2016-05-31 13:53:46",
            "worker": "TEST"
        }),
        new FM.dataApi.IxCheckResult({
            "id": "1ee57e22921da83bf212353956356a2f",
            "ruleid": "GLM56004",
            "rank": 1,
            "targets": "[RD_LINK,100005253]",
            "information": "修形中产生自相交，要提示立交或打断",
            "geometry": "(116.375,40.0031)",
            "create_date": "2016-05-31 08:58:39",
            "worker": "TEST"
        }),
        new FM.dataApi.IxCheckResult({
            "id": "c7430b0f1066e63fec21dafcdd84aa9b",
            "ruleid": "PERMIT_CHECK_NO_REPEAT",
            "rank": 1,
            "targets": "[RD_LINK,100005253]",
            "information": "该位置已有节点，同一坐标不能有两个节点，请创建点点立交",
            "geometry": "(116.37559,40.00283)",
            "create_date": "2016-05-31 08:58:39",
            "worker": "TEST"
        }),
        new FM.dataApi.IxCheckResult({
            "id": "53d600548b704ad1a0d6286a8dde1f4a",
            "ruleid": "SHAPING_CHECK_CROSS_RDLINK_RDLINK",
            "rank": 1,
            "targets": "[RD_LINK,100005253]",
            "information": "两条Link相交，必须做立交或者打断",
            "geometry": "(116.37559,40.00283)",
            "create_date": "2016-05-31 08:58:39",
            "worker": "TEST"
        })
    ];
    //修改状态
    $scope.changeType = function (selectInd, rowid) {
        /*var params = {
            "projectId": Application.projectid,
            "id": rowid,
            "type": selectInd
        };*/
        var params = {
            id:rowid,
            type:selectInd
        }
        $scope.$emit('updateCheckType',params);
        /*Application.functions.updateCheckType(JSON.stringify(params), function (data) {
            if (data.errcode == 0) {
                $scope.$apply();
                $scope.getCheckDateAndCount();
            }
        });*/
    }


    //点击数据在地图上高亮
    $scope.showOnMap = function (targets) {
        var value = targets.replace("[", "");
        var value1 = value.replace("]", "");

        var data = {
            id:value1.split(",")[1],
            type:value1.split(",")[0].replace("_", "")
        };
        //线高亮
        if (data.type == "RDLINK") {
            $scope.$emit('getRdObjectById',data);
        } else if (data.type == "RDRESTRICTION") {//交限高亮
            $scope.$emit('getRdObjectById',data);
        } else {//其他tips高亮
            layerCtrl.pushLayerFront("workPoint");
            Application.functions.getTipsResult(id, function (data) {
                map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);

                var highlightFeatures=[];
                highlightFeatures.push({
                    id:data.rowkey,
                    layerid:'workPoint',
                    type:'workPoint',
                    style:{}
                });
                highRenderCtrl.highLightFeatures = highlightFeatures;
                highRenderCtrl.drawHighlight();
            });
        }
    }


    //监听检查结果并获取
    /*eventController.on(eventController.eventTypes.CHEKCRESULT, function(event){
        $scope.rowCollection=event.errorCheckData;
    });*/
}]);