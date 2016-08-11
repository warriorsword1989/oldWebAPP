/**
 * Created by liuyang on 2016/8/5.
 */
angular.module('app').controller("addSameFeatureCtrl", ['$scope', '$ocLazyLoad', 'dsEdit', 'appPath','$timeout',
    function($scope, $ocLazyLoad, dsEdit, appPath,$timeout) {
        var layerCtrl = fastmap.uikit.LayerController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var rdNode = layerCtrl.getLayerById('rdNode');
        var adNode = layerCtrl.getLayerById('adNode');
        var zoneNode = layerCtrl.getLayerById('zoneNode');
        var luNode = layerCtrl.getLayerById('luNode');
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        var eventController = fastmap.uikit.EventController();

        /**
         * 添加geometry
         * @param type
         * @param num
         * @param event
         */
        $scope.addShape = function(type) {
            //大于17级才可以选择地图上各种geometry
            if (map.getZoom() < 17) {
                swal("提示","地图缩放等级必须大于16级才可操作","info");
                return;
            }
            //重置选择工具
            $scope.resetToolAndMap(); //方法在toolbarCtr.js中定义
            $scope.$emit("SWITCHCONTAINERSTATE", {
                "attrContainerTpl": false,
                "subAttrContainerTpl": false
            });
            $("#popoverTips").hide();
            if (type === 'RDTEST') { //框选测试
                $scope.resetOperator("addRelation", type);
                tooltipsCtrl.setCurrentTooltip('请框选数据！');
                map.currentTool = new fastmap.uikit.SelectForRectang({
                    map: map,
                    shapeEditor: shapeCtrl,
                    LayersList: [rdLink, rdNode]
                });
                map.currentTool.enable();
                eventController.off(eventController.eventTypes.GETRECTDATA);
                eventController.on(eventController.eventTypes.GETRECTDATA, function (data) {
                    console.log(data.data);
                })
            } else if (type === 'RDSAMENODE'){
                $scope.dropdownStatus.isopen = !$scope.dropdownStatus.isopen;//控制下拉菜单显示,如果彻底的取消dropdown的显示,需要注销掉resetToolAndMap方法中的event.stopPropagation();
                $scope.resetOperator("addRelation", type);
                tooltipsCtrl.setCurrentTooltip('请框选同一点要素点！');
                map.currentTool = new fastmap.uikit.SelectForRectang({
                    map: map,
                    shapeEditor: shapeCtrl,
                    LayersList: [rdNode,adNode,zoneNode,luNode] //配置的顺序影响返回框选点的顺序
                });
                map.currentTool.enable();
                eventController.off(eventController.eventTypes.GETRECTDATA);
                eventController.on(eventController.eventTypes.GETRECTDATA, function (data) {
                    console.log(data.data);

                    if(data.data.length <= 0){
                        return ;
                    }
                    var arr = [];
                    for (var i = 0 , len = data.data.length; i<len; i++){
                        var o = {};
                        o.featType = data.data[i].data.properties.featType;
                        o.id = data.data[i].data.properties.id;
                        o.checked = false;
                        arr.push(o);
                    }

                    $scope.$emit("showSameNodeOrLink",arr);
                })
            } else if (type === 'RDSAMELINK'){
                $scope.dropdownStatus.isopen = !$scope.dropdownStatus.isopen;//控制下拉菜单显示
                $scope.resetOperator("addRelation", type);
                tooltipsCtrl.setCurrentTooltip('请框选同一线要素线！');
                map.currentTool = new fastmap.uikit.SelectForRectang({
                    map: map,
                    shapeEditor: shapeCtrl,
                    LayersList: [rdNode,adNode,zoneNode,luNode]
                });
                map.currentTool.enable();
                eventController.off(eventController.eventTypes.GETRECTDATA);
                eventController.on(eventController.eventTypes.GETRECTDATA, function (data) {
                    console.log(data.data);


                    $scope.sameNodeOrLink = true;
                })
            }
        }
        // //将数arr数组按照order的顺序排序
        // var sortPriority = function (order,arr){
        //     console.info("----",arr);
        //     var result = [];
        //     for(var i = 0 ,len = order.length;i < len; i++){
        //         for(var j = 0 ,arrLen = arr.length;j < arrLen; j++){
        //             if(order[i] == arr[j].featType ){
        //                 result.push(arr[j]);
        //             }
        //         }
        //     }
        //     console.info(result);
        //     return result;
        // }
    }
]);