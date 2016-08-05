/**
 * Created by liuyang on 2016/8/5.
 */
angular.module('app').controller("addCRFShapeCtrl", ['$scope', '$ocLazyLoad', 'dsEdit', 'appPath','$timeout',
    function($scope, $ocLazyLoad, dsEdit, appPath,$timeout) {
        var layerCtrl = fastmap.uikit.LayerController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var rdLink = layerCtrl.getLayerById('rdLink');
        var rdnode = layerCtrl.getLayerById('rdNode');
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        var eventController = fastmap.uikit.EventController();
        /**
         * 两点之间的距离
         * @param pointA
         * @param pointB
         * @returns {number}
         */
        $scope.distance = function(pointA, pointB) {
            var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
            return Math.sqrt(len);
        };

        /**
         * 运算两条线的交点坐标
         * @param a
         * @param b
         * @returns {*}
         */
        $scope.segmentsIntr = function(a, b) { //([{x:_,y:_},{x:_,y:_}],[{x:_,y:_},{x:_,y:_}]) a,b为两条直线
            var area_abc = (a[0].x - b[0].x) * (a[1].y - b[0].y) - (a[0].y - b[0].y) * (a[1].x - b[0].x);
            var area_abd = (a[0].x - b[1].x) * (a[1].y - b[1].y) - (a[0].y - b[1].y) * (a[1].x - b[1].x);
            // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);
            if (area_abc * area_abd >= 0) {
                return false;
            }
            var area_cda = (b[0].x - a[0].x) * (b[1].y - a[0].y) - (b[0].y - a[0].y) * (b[1].x - a[0].x);
            var area_cdb = area_cda + area_abc - area_abd;
            if (area_cda * area_cdb >= 0) {
                return false;
            }
            //计算交点坐标
            var t = area_cda / (area_abd - area_abc);
            var dx = t * (a[1].x - a[0].x),
                dy = t * (a[1].y - a[0].y);
            return {
                x: (a[0].x + dx).toFixed(5),
                y: (a[0].y + dy).toFixed(5)
            }; //保留小数点后5位
        };
        /**
         * 去除重复的坐标点，保留一个
         * @param arr
         * @returns {*}
         * @constructor
         */
        $scope.ArrUnique = function(arr) {
            for (var i = 0; i < arr.length; i++) {
                for (var j = 0; j < arr.length; j++) {
                    if (i != j) {
                        if (arr[i].x == arr[j].x && arr[i].y == arr[j].y) {
                            arr.splice(j, 1);
                        }
                    }
                }
            }
            /*清除空数组*/
            arr.filter(function(v) {
                if (v.length > 0) {
                    return v;
                }
            });
            return arr;
        };

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
            $scope.resetToolAndMap();
            // $scope.changeBtnClass(num);
            // //连续点击两次按钮
            // if (num !== 7) {
            //     if (!$scope.classArr[num]) {
            //         map.currentTool.disable();
            //         map._container.style.cursor = '';
            //         return;
            //     }
            // }
             if (type === 'RDTEST') { //框选测试
                $scope.resetOperator("addRelation", type);
                tooltipsCtrl.setCurrentTooltip('请框选数据！');
                map.currentTool = new fastmap.uikit.SelectForRectang({
                    map: map,
                    shapeEditor: shapeCtrl,
                    LayersList: [rdLink, rdnode]
                });
                map.currentTool.enable();
                eventController.off(eventController.eventTypes.GETRECTDATA);
                eventController.on(eventController.eventTypes.GETRECTDATA, function (data) {
                    console.log(data.data);
                })
            } else if (type === 'CRFINTER') { //CRF交叉点
                $scope.resetOperator("addRelation", type);
                var highLightFeatures = [];
                var linkPids = [];//推荐的退出线
                var continueLinkPid = null;//退出线或者连续link的另一个端点
                var linkLength = 0;//长度
                var slopeData = {nodePid:null,linkPid:null};
                var exLinkPids = [];//所有的连续link

                highRenderCtrl.highLightFeatures = [];
                highRenderCtrl._cleanHighLight();
                //设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDSLOPE);
                //地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdSlope');
                tooltipsCtrl.setCurrentTooltip('请框选制作CRF交叉点的道路线、点！');
                map.currentTool = new fastmap.uikit.SelectForRectang({
                    map: map,
                    shapeEditor: shapeCtrl,
                    LayersList: [rdLink, rdnode]
                });
                map.currentTool.enable();
                eventController.off(eventController.eventTypes.GETRECTDATA);
                eventController.on(eventController.eventTypes.GETRECTDATA, function (data) {
                    console.log(data.data);
                })
            }
        }
    }
]);