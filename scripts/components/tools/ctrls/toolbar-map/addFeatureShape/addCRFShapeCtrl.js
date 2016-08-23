/**
 * Created by liuyang on 2016/8/5.
 */
angular.module('app').controller("addCRFShapeCtrl", ['$scope', '$ocLazyLoad', 'dsEdit', 'appPath', '$timeout',
    function ($scope, $ocLazyLoad, dsEdit, appPath, $timeout) {
        var layerCtrl = fastmap.uikit.LayerController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var rdLink = layerCtrl.getLayerById('rdLink');
        var rdnode = layerCtrl.getLayerById('rdNode');
        var crfData = layerCtrl.getLayerById('crfData');
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        var eventController = fastmap.uikit.EventController();
        /**
         * 两点之间的距离
         * @param pointA
         * @param pointB
         * @returns {number}
         */
        $scope.distance = function (pointA, pointB) {
            var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
            return Math.sqrt(len);
        };

        /**
         * 运算两条线的交点坐标
         * @param a
         * @param b
         * @returns {*}
         */
        $scope.segmentsIntr = function (a, b) { //([{x:_,y:_},{x:_,y:_}],[{x:_,y:_},{x:_,y:_}]) a,b为两条直线
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
        $scope.ArrUnique = function (arr) {
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
            arr.filter(function (v) {
                if (v.length > 0) {
                    return v;
                }
            });
            return arr;
        };
        $scope.changePoint = function (point) {
            return point[0]+':'+point[1];
        };

        /**
         * 添加geometry
         * @param type
         * @param num
         * @param event
         */
        $scope.addCRFShape = function (type) {
            //大于17级才可以选择地图上各种geometry
            if (map.getZoom() < 17) {
                swal("提示", "地图缩放等级必须大于16级才可操作", "info");
                return;
            }
            //重置选择工具
            $scope.resetToolAndMap();
            $scope.$emit("SWITCHCONTAINERSTATE", {
                "attrContainerTpl": false,
                "subAttrContainerTpl": false
            });
            $("#popoverTips").hide();
             if (type === 'CRFINTER') { //CRF交叉点
                $scope.resetOperator("addRelation", type);
                var highLightFeatures = [];
                var interData = {links:[],nodes:[]};//推荐的退出线.
                var pointList = [];
                var crfPids = [];
                highRenderCtrl.highLightFeatures = [];
                highRenderCtrl._cleanHighLight();
                //设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.CRFINTER);
                //地图编辑相关设置;
                tooltipsCtrl.setEditEventType('crfInter');
                tooltipsCtrl.setCurrentTooltip('请框选制作CRF交叉点的道路点！');
                map.currentTool = new fastmap.uikit.SelectForRectang({
                    map: map,
                    shapeEditor: shapeCtrl,
                    LayersList: [rdLink, rdnode ,crfData]
                });
                map.currentTool.enable();

                eventController.off(eventController.eventTypes.GETRECTDATA);
                eventController.on(eventController.eventTypes.GETRECTDATA, function (data) {
                    if (data == []){
                        tooltipsCtrl.setCurrentTooltip('请重新框选制作CRF交叉点的道路点！');
                        return;
                    }
                    //crf中的node和link与常规的node、link的pid是一样的，要排除掉常规中的这些数据
                    for(var i = 0;i<data.data.length;i++){
                        //为排除某端点不在框选范围内的线做数据准备，将所有的点放进去
                        if(data.data[i].data && data.data[i].data.properties.featType != "RDINTER" && data.data[i].data.geometry.type == "Point"){
                            pointList.push($scope.changePoint(data.data[i].data.geometry.coordinates));
                        }
                        if(data.data[i].data && data.data[i].data.properties.featType == "RDINTER"){
                            if(data.data[i].data.properties.nodeId != undefined){
                                crfPids.push(data.data[i].data.properties.nodeId);
                            } else {
                                crfPids.push(data.data[i].data.properties.linkId);
                            }
                            data.data.splice(i,1);
                            i--;
                        }
                    }
                    for (var i = 0; i < data.data.length; i++) {
                        if (data.data[i].data && data.data[i].data.geometry.type == "LineString"  && crfPids.indexOf(data.data[i].data.properties.id) < 0) {
                            if (interData.links.indexOf(parseInt(data.data[i].data.properties.id)) < 0) {
                                if(pointList.indexOf($scope.changePoint(data.data[i].data.geometry.coordinates[0]))>-1 && pointList.indexOf($scope.changePoint(data.data[i].data.geometry.coordinates[data.data[i].data.geometry.coordinates.length-1]))>-1){
                                    interData.links.push(parseInt(data.data[i].data.properties.id));
                                    highLightFeatures.push({
                                        id: data.data[i].data.properties.id.toString(),
                                        layerid: 'rdLink',
                                        type: 'line',
                                        style: {
                                            color: '#D9B300'
                                        }
                                    });
                                }
                            }
                        } else if (data.data[i].data && data.data[i].data.geometry.type == "Point"  && crfPids.indexOf(data.data[i].data.properties.id) < 0) {
                            if (interData.nodes.indexOf(parseInt(data.data[i].data.properties.id)) < 0) {
                                interData.nodes.push(parseInt(data.data[i].data.properties.id));
                                highLightFeatures.push({
                                    id: data.data[i].data.properties.id.toString(),
                                    layerid: 'rdLink',
                                    type: 'node',
                                    style: {
                                        color: '#02F78E'
                                    }
                                });
                            }
                        }
                    }
                    highRenderCtrl.highLightFeatures = highLightFeatures;
                    highRenderCtrl.drawHighlight();
                    tooltipsCtrl.setCurrentTooltip("请追加或取消道路点!");
                    eventController.off(eventController.eventTypes.GETRECTDATA);
                    map.currentTool = {};
                    map.currentTool = new fastmap.uikit.SelectNodeAndPath({
                        map: map,
                        shapeEditor: shapeCtrl,
                        selectLayers: [crfData,rdnode],
                        snapLayers: [rdnode]//将rdnode放前面，优先捕捉
                    });
                    map.currentTool.enable();
                    eventController.off(eventController.eventTypes.GETFEATURE);
                    eventController.on(eventController.eventTypes.GETFEATURE, function (data) {
                        highRenderCtrl._cleanHighLight();
                        if(data.optype == "RDNODE"){
                            if(interData.nodes.indexOf(parseInt(data.id)) < 0){
                                var param1 = {};
                                param1["dbId"] = App.Temp.dbId;
                                param1["type"] = "RDLINK";
                                param1["data"] = {
                                    "nodePid": parseInt(data.id)
                                };
                                dsEdit.getByCondition(param1).then(function (exLinks) {
                                    if (exLinks.errcode === -1) {
                                        return;
                                    }
                                    if (exLinks.data) {
                                        for (var i = 0;i<exLinks.data.length;i++){
                                            if(interData.links.indexOf(exLinks.data[i].pid) > -1){//某一条挂接link在crf里
                                                interData.nodes.push(parseInt(data.id));
                                                highRenderCtrl.highLightFeatures.push({
                                                    id: data.id.toString(),
                                                    layerid: 'rdLink',
                                                    type: 'node',
                                                    style: {
                                                        color: '#02F78E'
                                                    }
                                                });
                                                highRenderCtrl.drawHighlight();
                                            } else {
                                                dsEdit.getByPid(exLinks.data[i].pid,"RDLINK").then(function (linkData) {
                                                    if((interData.nodes.indexOf(linkData.eNodePid) >-1 && linkData.eNodePid!=parseInt(data.id)) || (interData.nodes.indexOf(linkData.sNodePid) >-1  && linkData.sNodePid!=parseInt(data.id))){//线正好是中间部分,把线也加入
                                                        interData.nodes.push(parseInt(data.id));
                                                        highRenderCtrl.highLightFeatures.push({
                                                            id: data.id.toString(),
                                                            layerid: 'rdLink',
                                                            type: 'node',
                                                            style: {
                                                                color: '#02F78E'
                                                            }
                                                        });
                                                        interData.links.push(linkData.pid);
                                                        highRenderCtrl.highLightFeatures.push({
                                                            id: linkData.pid.toString(),
                                                            layerid: 'rdLink',
                                                            type: 'line',
                                                            style: {
                                                                color: '#D9B300'
                                                            }
                                                        });
                                                    }
                                                    highRenderCtrl.drawHighlight();
                                                })
                                            }
                                        }
                                    }

                                });
                            } else {
                                interData.nodes.splice(interData.nodes.indexOf(parseInt(data.id)),1);
                                for(var i = 0;i<highLightFeatures.length;i++){
                                    if(highLightFeatures[i].id == data.id){
                                        highLightFeatures.splice(i,1);
                                        i--;
                                    }
                                }

                                var param = {};
                                param["dbId"] = App.Temp.dbId;
                                param["type"] = "RDLINK";
                                param["data"] = {
                                    "nodePid": parseInt(data.id)
                                };
                                dsEdit.getByCondition(param).then(function (conLinks) {//找出所有的挂接线，删除存在于框选范围内的
                                    highRenderCtrl._cleanHighLight();
                                    if (conLinks.errcode === -1) {
                                        return;
                                    }
                                    if (conLinks.data) {
                                        for (var i = 0 ;i<conLinks.data.length;i++){
                                            if(interData.links.indexOf(conLinks.data[i].pid) > -1){
                                                interData.links.splice(interData.links.indexOf(conLinks.data[i].pid),1);
                                                for(var j = 0;j<highRenderCtrl.highLightFeatures.length;j++){
                                                    if(highRenderCtrl.highLightFeatures[j].id == conLinks.data[i].pid){
                                                        highRenderCtrl.highLightFeatures.splice(j,1);
                                                        j--;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    highRenderCtrl.drawHighlight();
                                });
                            }
                        }

                        highRenderCtrl.highLightFeatures = highLightFeatures;
                        highRenderCtrl.drawHighlight();
                    });
                    shapeCtrl.shapeEditorResult.setFinalGeometry(interData);
                    tooltipsCtrl.setCurrentTooltip("点击空格保存CRF交叉点信息,或者按ESC键取消!");
                });
            } else if (type === 'CRFROAD') { //CRF道路
                 $scope.resetOperator("addRelation", type);
                 var highLightFeatures = [];
                 var interData = {linkPids:[]};//推荐的退出线.
                 var lineList = [];
                 var crfPids = [];
                 highRenderCtrl.highLightFeatures = [];
                 highRenderCtrl._cleanHighLight();
                 //设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                 shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.CRFROAD);
                 //地图编辑相关设置;
                 tooltipsCtrl.setEditEventType('crfRoad');
                 tooltipsCtrl.setCurrentTooltip('请框选制作CRF道路的道路线！');
                 map.currentTool = new fastmap.uikit.SelectForRectang({
                     map: map,
                     shapeEditor: shapeCtrl,
                     LayersList: [rdLink ,crfData]
                 });
                 map.currentTool.enable();

                 eventController.off(eventController.eventTypes.GETRECTDATA);
                 eventController.on(eventController.eventTypes.GETRECTDATA, function (data) {
                     if (data == []){
                         tooltipsCtrl.setCurrentTooltip('请重新框选制作CRF交叉点的道路线！');
                         return;
                     }
                     //crf中的node和link与常规的node、link的pid是一样的，要排除掉常规中的这些数据
                     for(var i = 0;i<data.data.length;i++){
                         //将所有的link放进去
                         if(data.data[i].data && data.data[i].data.properties.featType != "RDINTER" && data.data[i].data.properties.featType != "RDROAD" && data.data[i].data.geometry.type == "LineString"){
                             lineList.push(data.data[i].data.properties.id);
                         }
                         if(data.data[i].data && data.data[i].data.properties.featType == "RDINTER" || data.data[i].data.properties.featType == "RDROAD"){
                             if(data.data[i].data.properties.linkId != undefined){
                                 crfPids.push(data.data[i].data.properties.linkId);
                             }
                             data.data.splice(i,1);
                             i--;
                         }
                     }
                     for (var i = 0; i < data.data.length; i++) {
                         if (data.data[i].data && data.data[i].data.geometry.type == "LineString"  && crfPids.indexOf(data.data[i].data.properties.id) < 0) {
                             if (interData.linkPids.indexOf(parseInt(data.data[i].data.properties.id)) < 0 && crfPids.indexOf(parseInt(data.data[i].data.properties.id))< 0) {
                                 interData.linkPids.push(parseInt(data.data[i].data.properties.id));
                                 highLightFeatures.push({
                                     id: data.data[i].data.properties.id.toString(),
                                     layerid: 'rdLink',
                                     type: 'line',
                                     style: {
                                         color: '#D9B300'
                                     }
                                 });
                             }
                         }
                     }
                     highRenderCtrl.highLightFeatures = highLightFeatures;
                     highRenderCtrl.drawHighlight();
                     tooltipsCtrl.setCurrentTooltip("请追加或取消道路线!");
                     eventController.off(eventController.eventTypes.GETRECTDATA);
                     map.currentTool = {};
                     map.currentTool = new fastmap.uikit.SelectNodeAndPath({
                         map: map,
                         shapeEditor: shapeCtrl,
                         selectLayers: [crfData,rdLink],
                         snapLayers: [rdLink]
                     });
                     map.currentTool.enable();
                     eventController.off(eventController.eventTypes.GETFEATURE);
                     eventController.on(eventController.eventTypes.GETFEATURE, function (data) {
                         highRenderCtrl._cleanHighLight();
                         if(data.optype == "RDLINK"){
                             if(interData.linkPids.indexOf(parseInt(data.id)) < 0){
                                 interData.linkPids.push(parseInt(data.id));
                                 highLightFeatures.push({
                                     id: data.id.toString(),
                                     layerid: 'rdLink',
                                     type: 'line',
                                     style: {
                                         color: '#D9B300'
                                     }
                                 });
                             } else {
                                 interData.linkPids.splice(interData.linkPids.indexOf(parseInt(data.id)),1);
                                 for(var i = 0;i<highLightFeatures.length;i++){
                                     if(highLightFeatures[i].id == data.id){
                                         highLightFeatures.splice(i,1);
                                         i--;
                                     }
                                 }
                             }
                         }
                         highRenderCtrl.highLightFeatures = highLightFeatures;
                         highRenderCtrl.drawHighlight();
                     });
                     shapeCtrl.shapeEditorResult.setFinalGeometry(interData);
                     tooltipsCtrl.setCurrentTooltip("点击空格保存CRF道路信息,或者按ESC键取消!");
                 });
             } else if (type === 'CRFOBJECT') { //CRF道路
                 $scope.resetOperator("addRelation", type);
                 var highLightFeatures = [];
                 var objData = {links:[],inters:[],roads:[],longitude:null,latitude:null};//要创建的对象.
                 var lineList = [];
                 var crfPids = [];
                 highRenderCtrl.highLightFeatures = [];
                 highRenderCtrl._cleanHighLight();
                 //设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                 shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.CRFOBJECT);
                 //地图编辑相关设置;
                 tooltipsCtrl.setEditEventType('crfObject');
                 tooltipsCtrl.setCurrentTooltip('请框选制作CRF对象的要素！');
                 map.currentTool = new fastmap.uikit.SelectForRectang({
                     map: map,
                     shapeEditor: shapeCtrl,
                     LayersList: [rdLink ,crfData]
                 });
                 map.currentTool.enable();

                 eventController.off(eventController.eventTypes.GETRECTDATA);
                 eventController.on(eventController.eventTypes.GETRECTDATA, function (data) {
                     if (data == []){
                         tooltipsCtrl.setCurrentTooltip('请重新框选制作CRF对象的要素！');
                         return;
                     }
                     //crf中的node和link与常规的node、link的pid是一样的，要排除掉常规中的这些数据
                     for(var i = 0;i<data.data.length;i++){
                         //将所有的link放进去
                         if(data.data[i].data && data.data[i].data.properties.featType != "RDINTER" && data.data[i].data.properties.featType != "RDROAD" && data.data[i].data.geometry.type == "LineString"){
                             lineList.push(data.data[i].data.properties.id);
                         }
                         //将crf的pid放进去
                         if(data.data[i].data && data.data[i].data.properties.featType == "RDINTER" || data.data[i].data.properties.featType == "RDROAD"){
                             if(crfPids.indexOf(data.data[i].data.properties.id) < 0){
                                 crfPids.push(data.data[i].data.properties.id);
                             }
                         }
                     }
                     for (var i = 0; i < data.data.length; i++) {
                         if (data.data[i].data && data.data[i].data.geometry.type == "LineString"  && crfPids.indexOf(data.data[i].data.properties.id) < 0) {
                             if (interData.linkPids.indexOf(parseInt(data.data[i].data.properties.id)) < 0 && crfPids.indexOf(parseInt(data.data[i].data.properties.id))< 0) {
                                 interData.linkPids.push(parseInt(data.data[i].data.properties.id));
                                 highLightFeatures.push({
                                     id: data.data[i].data.properties.id.toString(),
                                     layerid: 'rdLink',
                                     type: 'line',
                                     style: {
                                         color: '#D9B300'
                                     }
                                 });
                             }
                         }
                     }
                     highRenderCtrl.highLightFeatures = highLightFeatures;
                     highRenderCtrl.drawHighlight();
                     tooltipsCtrl.setCurrentTooltip("请追加或取消道路线!");
                     eventController.off(eventController.eventTypes.GETRECTDATA);
                     map.currentTool = {};
                     map.currentTool = new fastmap.uikit.SelectNodeAndPath({
                         map: map,
                         shapeEditor: shapeCtrl,
                         selectLayers: [crfData,rdLink],
                         snapLayers: [rdLink]
                     });
                     map.currentTool.enable();
                     eventController.off(eventController.eventTypes.GETFEATURE);
                     eventController.on(eventController.eventTypes.GETFEATURE, function (data) {
                         highRenderCtrl._cleanHighLight();
                         if(data.optype == "RDLINK"){
                             if(interData.linkPids.indexOf(parseInt(data.id)) < 0){
                                 interData.linkPids.push(parseInt(data.id));
                                 highLightFeatures.push({
                                     id: data.id.toString(),
                                     layerid: 'rdLink',
                                     type: 'line',
                                     style: {
                                         color: '#D9B300'
                                     }
                                 });
                             } else {
                                 interData.linkPids.splice(interData.linkPids.indexOf(parseInt(data.id)),1);
                                 for(var i = 0;i<highLightFeatures.length;i++){
                                     if(highLightFeatures[i].id == data.id){
                                         highLightFeatures.splice(i,1);
                                         i--;
                                     }
                                 }
                             }
                         }
                         highRenderCtrl.highLightFeatures = highLightFeatures;
                         highRenderCtrl.drawHighlight();
                     });
                     shapeCtrl.shapeEditorResult.setFinalGeometry(interData);
                     tooltipsCtrl.setCurrentTooltip("点击空格保存CRF道路信息,或者按ESC键取消!");
                 });
             }
        }
    }
]);