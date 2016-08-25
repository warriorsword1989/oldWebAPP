/**
 * Created by liuyang on 2016/8/5.
 */
angular.module('app').controller("addSameFeatureCtrl", ['$scope', '$ocLazyLoad', 'dsEdit', 'appPath','$timeout',
    function($scope, $ocLazyLoad, dsEdit, appPath,$timeout) {
        var layerCtrl = fastmap.uikit.LayerController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var rdNode = layerCtrl.getLayerById('rdNode');
        var rwNode = layerCtrl.getLayerById('rwNode');
        var adNode = layerCtrl.getLayerById('adNode');
        var zoneNode = layerCtrl.getLayerById('zoneNode');
        var luNode = layerCtrl.getLayerById('luNode');

        var rdLink = layerCtrl.getLayerById('rdLink');
        var rwLink = layerCtrl.getLayerById('rwLink');
        var adLink = layerCtrl.getLayerById('adLink');
        var zoneLink = layerCtrl.getLayerById('zoneLink');
        var luLink = layerCtrl.getLayerById('luLink');

        //var highRenderCtrl = fastmap.uikit.HighRenderController();
        var eventController = fastmap.uikit.EventController();
        var objCtrl = fastmap.uikit.ObjectEditController();

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

            if (type === 'RDSAMENODE'){
                //$scope.dropdownStatus.isopen = !$scope.dropdownStatus.isopen;//控制下拉菜单显示,如果彻底的取消dropdown的显示,需要注销掉resetToolAndMap方法中的event.stopPropagation();
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
                    if(data.data.length <= 0){
                        return ;
                    }

                    //根据ID去重
                    var removeRepeatArr = []; //去重后的数据
                    var removeRepeatIdArr = [];
                    for(var i = 0 , len = data.data.length; i<len; i++){
                        if(removeRepeatIdArr.indexOf(data.data[i].data.properties.id) < 0 ){
                            removeRepeatIdArr.push(data.data[i].data.properties.id);
                            removeRepeatArr.push(data.data[i]);
                        }
                    }

                    var arr = [];
                    for (var i = 0 , len = removeRepeatArr.length; i<len; i++){
                        var o = {};
                        o.featType = removeRepeatArr[i].data.properties.featType;
                        o.id = data.data[i].data.properties.id;
                        o.checked = false;
                        o.isMain = 0;
                        arr.push(o);
                    }
                    objCtrl.data = arr;
                    var relationShap = {
                        "loadType": "sameRelationShapTplContainer",
                        "propertyCtrl": appPath.road + 'ctrls/attr_same_ctrl/rdMainSameNodeCtrl',
                        "propertyHtml": appPath.root + appPath.road + 'tpls/attr_same_tpl/rdMainSameNodeTpl.html',
                        "callback":function (){
                            $scope.$emit("showSameNodeOrLink",'node');
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", relationShap);

                })
            } else if (type === 'RDSAMELINK'){
                //$scope.dropdownStatus.isopen = !$scope.dropdownStatus.isopen;//控制下拉菜单显示
                $scope.resetOperator("addRelation", type);
                tooltipsCtrl.setCurrentTooltip('请框选同一线要素线！');
                map.currentTool = new fastmap.uikit.SelectForRectang({
                    map: map,
                    shapeEditor: shapeCtrl,
                    LayersList: [rdLink,adLink,zoneLink,luLink] //配置的顺序影响返回框选点的顺序
                });
                map.currentTool.enable();
                eventController.off(eventController.eventTypes.GETRECTDATA);
                eventController.on(eventController.eventTypes.GETRECTDATA, function (data) {

                    if(data.length <= 0){
                        return ;
                    }
                    //根据ID去重
                    var removeRepeatArr = []; //去重后的数据
                    var removeRepeatIdArr = [];
                    for(var i = 0 , len = data.data.length; i<len; i++){
                        if(removeRepeatIdArr.indexOf(data.data[i].data.properties.id) < 0 ){
                            removeRepeatIdArr.push(data.data[i].data.properties.id);
                            removeRepeatArr.push(data.data[i]);
                        }
                    }

                    var arr = [];
                    for (var i = 0 , len = removeRepeatArr.length; i<len; i++){
                        var o = {};
                        o.featType = removeRepeatArr[i].data.properties.featType;
                        o.id = removeRepeatArr[i].data.properties.id;
                        o.checked = false;
                        arr.push(o);
                    }
                    objCtrl.data = arr;

                    var relationShap = {
                        "loadType": "sameRelationShapTplContainer",
                        "propertyCtrl": appPath.road + 'ctrls/attr_same_ctrl/rdMainSameLinkCtrl',
                        "propertyHtml": appPath.root + appPath.road + 'tpls/attr_same_tpl/rdMainSameLinkTpl.html',
                        "callback":function (){
                            $scope.$emit("showSameNodeOrLink","link");
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", relationShap);
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