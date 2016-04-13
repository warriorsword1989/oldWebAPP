/**
 * Created by liwanchong on 2015/10/28.
 */
var addShapeApp = angular.module('mapApp', ['oc.lazyLoad']);
addShapeApp.controller("addShapeController", ['$scope', '$ocLazyLoad', function ($scope, $ocLazyLoad) {
        var layerCtrl = fastmap.uikit.LayerController();
        var featCodeCtrl = fastmap.uikit.FeatCodeController();
        var editLayer = layerCtrl.getLayerById('edit');
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var selectCtrl = fastmap.uikit.SelectController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var rdLink = layerCtrl.getLayerById('referenceLine');
        var hLayer = layerCtrl.getLayerById('highlightlayer');
        var objCtrl = fastmap.uikit.ObjectEditController();
        var eventController = fastmap.uikit.EventController();
        $scope.limitRelation = {};
        //两点之间的距离
        $scope.distance = function (pointA, pointB) {
            var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
            return Math.sqrt(len);
        };
        $scope.includeAngle = function (pointA, pointB) {
            var angle, dValue = pointA.x - pointB.x,
                PI = Math.PI;

            if (dValue === 0) {
                angle = PI / 2;
            } else {
                angle = Math.atan((pointA.y - pointB.y) / (pointA.x - pointB.x));
            }
            return angle;
        };
        $scope.distinctArr = function (arr) {
            var dObj = {};
            for (var i = 0, len = arr.length; i < len; i++) {
                dObj[arr[i]] = true;
            }
            return Object.keys(dObj);
        };
        $scope.minusArrByNode = function (nodesArr, linksArr, nodes) {
            var nodesObj = {}, linksObj = {};
            for (var i = 0, lenI = nodesArr.length; i < lenI; i++) {
                nodesObj[nodesArr[i]] = true;
            }
            for (var j = 0, lenJ = linksArr.length; j < lenJ; j++) {
                linksObj[linksArr[j]] = true;
            }
            for (var m = 0, lenM = nodes.length; m < lenM; m++) {
                if (nodesObj[nodes[m]["node"]]) {
                    delete nodesObj[nodes[m]["node"]];
                }
                if (linksObj[nodes[m]["link"]]) {
                    delete linksObj[nodes[m]["link"]];
                }
            }
            var obj = {
                link: Object.keys(linksObj),
                node: Object.keys(nodesObj)
            };
            return obj;
        };
        $scope.minusArrByLink = function (linksArr, nodesArr, links) {
            var nodesObj = {}, linksObj = {};
            for (var j = 0, lenJ = linksArr.length; j < lenJ; j++) {
                linksObj[linksArr[j]] = true;
            }
            for (var i = 0, lenI = nodesArr.length; i < lenI; i++) {
                nodesObj[nodesArr[i]] = true;
            }
            for (var m = 0, lenM = links.length; m < lenM; m++) {
                if (links[m]["nodes"]) {
                    if (nodesObj[links[m]["nodes"][0]]) {
                        delete nodesObj[links[m]["nodes"][0]];
                    } else if (nodesObj[links[m]["nodes"][1]]) {
                        delete nodesObj[links[m]["nodes"][1]];
                    }
                } else if (links[m]["links"]) {
                    delete linksObj[links[m]["link"]];
                }
            }
            var obj = {
                link: Object.keys(linksObj),
                node: Object.keys(nodesObj)
            };
            return obj;
        };
        $scope.addArrByNode = function (nodesArr, linksArr, nodes, node) {
            for (var i = 0, lenI = nodes.length; i < lenI; i++) {
                for (var j = 0, lenJ = node.length; j < lenJ; j++) {
                    if (nodes[i]["link"] === node[j]["link"]) {
                        linksArr.push(node[j]["link"]);
                        nodesArr.push(node[j]["node"]);
                    }else{
                        nodesArr.push(node[j]["node"]);
                    }
                }
            }
            nodes = nodes.concat(node);
        };
    $scope.addArrByLink=function(linksArr,nodesArr,links,nodes,link) {
        for(var i= 0,lenI=link.length;i<lenI;i++) {
            linksArr.push(link[i]["link"]);
            nodesArr = nodesArr.concat(link[i]["node"]);
            links.push(link[i]["link"]);
            nodes = nodesArr.concat(link[i]["node"]);
        }
    };
        $scope.containLink = function (linksArr, links) {
            var flag = false, linksObj={};
            for (var i = 0, len = linksArr.length; i < len; i++) {
                linksObj[linksArr[i]] = true;
            }
            for (var j = 0, lenJ = links.length; j < lenJ; j++) {
                if (linksObj[j]["links"]) {
                    flag = true;
                    break;
                }
            }

        };
        $scope.containsNode = function (arr, node) {
            var obj = {}, flag = false;
            for (var i = 0, len = arr.length; i < len; i++) {
                obj[arr[i]] = true;
            }
            for (var j = 0, lenJ = node.length; j < lenJ; j++) {
                if (obj[node[j]["node"]]) {
                    flag = true;
                    break;
                }
            }
            return flag;
        };
        $scope.addShape = function (type, num, event) {

            if (event) {
                event.stopPropagation();
            }
            $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
            $("#popoverTips").hide();
            editLayer.clear();
            editLayer.bringToBack();
            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
            rdLink.clearAllEventListeners()
            if (tooltipsCtrl.getCurrentTooltip()) {
                tooltipsCtrl.onRemoveTooltip();
            }
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
            if (typeof map.currentTool.cleanHeight === "function") {
                map.currentTool.cleanHeight();
            }
            $scope.changeBtnClass(num);
            if (num !== 7) {
                if (!$scope.classArr[num]) {
                    map.currentTool.disable();
                    map._container.style.cursor = '';
                    return;
                }
            }


            if (type === "restriction") {
                shapeCtrl.setEditingType("restriction")
                tooltipsCtrl.setEditEventType('restriction');
                tooltipsCtrl.setCurrentTooltip('正要新建交限,先选择线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createRestrictFlag: true,
                    currentEditLayer: rdLink
                });
                map.currentTool.enable();
                $scope.excitLineArr = [];
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) {
                        $scope.limitRelation.inLinkPid = parseInt(data.id);
                        tooltipsCtrl.setStyleTooltip("color:black;");
                        tooltipsCtrl.setChangeInnerHtml("已经选择进入线,选择进入点!");
                    } else if (data.index === 1) {
                        $scope.limitRelation.nodePid = parseInt(data.id);
                        tooltipsCtrl.setStyleTooltip("color:red;");
                        tooltipsCtrl.setChangeInnerHtml("已经选择进入点,选择退出线!");
                    } else if (data.index > 1) {
                        $scope.excitLineArr.push(parseInt(data.id));
                        $scope.limitRelation.outLinkPids = $scope.excitLineArr;
                        tooltipsCtrl.setChangeInnerHtml("已选退出线,点击空格键保存!");
                    }
                    featCodeCtrl.setFeatCode($scope.limitRelation);
                })

            }
            else if (type === "link") {
                if (shapeCtrl.shapeEditorResult) {
                    shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                    selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }
                shapeCtrl.setEditingType('drawPath');
                shapeCtrl.startEditing();
                map.currentTool = shapeCtrl.getCurrentTool();
                tooltipsCtrl.setEditEventType('drawPath');
                tooltipsCtrl.setCurrentTooltip('开始画线！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("点击最后一个点结束画线!");
                tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存画线,或者按ESC键取消!");
            } else if (type === "speedLimit") {
                var minLen = 100000, pointsOfDis, pointForAngle, angle;
                map.currentTool = shapeCtrl.getCurrentTool();
                map.currentTool.disable();
                if (typeof map.currentTool.cleanHeight === "function") {
                    map.currentTool.cleanHeight();
                }
                if (shapeCtrl.shapeEditorResult) {
                    shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                    selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }
                shapeCtrl.setEditingType('pointVertexAdd');
                shapeCtrl.startEditing();
                map.currentTool = shapeCtrl.getCurrentTool();
                tooltipsCtrl.setEditEventType('pointVertexAdd');
                tooltipsCtrl.setCurrentTooltip('开始增加限速！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("点击增加限速!");
                tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存,或者按ESC键取消!");

                eventController.on(eventController.eventTypes.RESETCOMPLETE, function (e) {
                    var pro = e.property;
                    Application.functions.getRdObjectById(pro.id, "RDLINK", function (data) {
                        if (data.errcode == 0) {
                            selectCtrl.onSelected({
                                geometry: data.data.geometry.coordinates,
                                id: data.data.pid,
                                direct: pro.direct,
                                point: $.extend(true, {}, shapeCtrl.shapeEditorResult.getFinalGeometry())
                            });

                            var linkArr = data.data.geometry.coordinates || data.geometry.coordinates, points = [];
                            if (pro.direct == 1) {
                                tooltipsCtrl.setEditEventType('speedLimit');
                                var point = shapeCtrl.shapeEditorResult.getFinalGeometry();
                                var link = linkArr;
                                for (var i = 0, len = link.length; i < len; i++) {
                                    pointsOfDis = $scope.distance(map.latLngToContainerPoint([point.y, point.x]), map.latLngToContainerPoint([link[i][1], link[i][0]]));
                                    if (pointsOfDis < minLen) {
                                        minLen = pointsOfDis;
                                        pointForAngle = link[i];
                                    }
                                }
                                angle = $scope.includeAngle(map.latLngToContainerPoint([point.y, point.x]), map.latLngToContainerPoint([pointForAngle[1], pointForAngle[0]]));
                                console.log(angle);
                                console.log("angle  " + angle)
                                var marker = {
                                    flag: false,
                                    point: point,
                                    type: "marker",
                                    angle: angle,
                                    orientation: "2",
                                    pointForDirect: point
                                };
                                layerCtrl.pushLayerFront('edit');
                                var sObj = shapeCtrl.shapeEditorResult;
                                editLayer.drawGeometry = marker;
                                editLayer.draw(marker, editLayer);
                                sObj.setOriginalGeometry(marker);
                                sObj.setFinalGeometry(marker);
                                shapeCtrl.setEditingType("transformDirect");
                                shapeCtrl.startEditing();
                                tooltipsCtrl.setCurrentTooltip("选择方向!");
                            } else {
                                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                                tooltipsCtrl.setEditEventType('speedLimit');
                                tooltipsCtrl.setCurrentTooltip('请点击空格,创建限速!');
                                shapeCtrl.setEditingType("transformDirect");
                            }
                        } else {
                        }
                    })
                });
            } else if (type === "rdBranch") {
                shapeCtrl.setEditingType("rdBranch")
                tooltipsCtrl.setEditEventType('rdBranch');
                tooltipsCtrl.setCurrentTooltip('正要新建分歧,先选择线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink
                });
                map.currentTool.enable();
                $scope.excitLineArr = [];
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) {
                        $scope.limitRelation.inLinkPid = parseInt(data.id);
                        tooltipsCtrl.setStyleTooltip("color:black;");
                        tooltipsCtrl.setChangeInnerHtml("已经选择进入线,选择进入点!");
                    } else if (data.index === 1) {
                        $scope.limitRelation.nodePid = parseInt(data.id);
                        tooltipsCtrl.setStyleTooltip("color:red;");
                        tooltipsCtrl.setChangeInnerHtml("已经选择进入点,选择退出线!");
                    } else if (data.index > 1) {
                        $scope.excitLineArr.push(parseInt(data.id));
                        $scope.limitRelation.outLinkPid = $scope.excitLineArr[0];
                        tooltipsCtrl.setChangeInnerHtml("已选退出线,点击空格键保存!");
                    }
                    featCodeCtrl.setFeatCode($scope.limitRelation);
                })

            } else if (type === "rdcross") {
                var linksArr = [], nodesArr = [], nodes = [], links = [],options={};
                shapeCtrl.toolsSeparateOfEditor("linksOfCross", {
                    map: map,
                    layer: rdLink,
                    crossFlag:true,
                    type: "rectangle"
                })
                var highLightLink = new fastmap.uikit.HighLightRender(hLayer);
                map.currentTool = shapeCtrl.getCurrentTool();
                eventController.on(eventController.eventTypes.GETBOXDATA, function (event) {
                    var data = event.data,highlightFeatures=[];
                    if (nodesArr.length === 0) {
                        for (var nodeNum = 0, nodeLen = data["nodes"].length; nodeNum < nodeLen; nodeNum++) {
                            nodesArr.push(data["nodes"][nodeNum]["node"]);
                        }
                        for (var linkNum = 0, linkLen = data["links"].length; linkNum < linkLen; linkNum++) {
                            nodesArr = nodesArr.concat(data["links"][linkNum]["node"]);
                            linksArr.push(data["links"][linkNum]["link"]);
                        }
                        nodes = nodes.concat(data["nodes"]);
                        links = links.concat(data["links"]);

                    } else {
                        if (data['nodes']) {
                            if ($scope.containsNode(nodesArr, data["nodes"])) {
                                var minusObj = $scope.minusArrByNode(nodesArr, linksArr, data['nodes']);
                                linksArr = minusObj["link"];
                                nodesArr = minusObj["node"];
                            } else {
                                $scope.addArrByNode(nodesArr, linksArr, nodes, data["nodes"]);
                            }

                        } else if (data['links']) {
                            if ($scope.containLink(linksArr, data["links"])) {
                                var minusLink = $scope.minusArrByLink(linksArr, nodesArr, data["links"]);
                                linksArr = minusLink["link"];
                                nodesArr = minusLink["node"];
                            } else {
                                $scope.addArrByLink(linksArr, nodesArr, links, nodes, data["links"]);
                            }

                        }
                    }
                    linksArr = $scope.distinctArr(linksArr);
                    nodesArr = $scope.distinctArr(nodesArr);
                    for(var i= 0,lenI=linksArr.length;i<lenI;i++) {

                        highlightFeatures.push({
                            id:linksArr[i].toString(),
                            layerid:'referenceLine',
                            type:'line',
                            style:{}
                        })
                    }
                  for(var j= 0,lenJ=nodesArr.length;j<lenJ;j++) {
                      highlightFeatures.push({
                          id:nodesArr[j].toString(),
                          layerid:'referenceLine',
                          type:'node',
                          style:{}
                      })
                  }
                    highLightLink.highLightFeatures =highlightFeatures;
                    highLightLink.drawHighlight();
                    options = {"nodePids": nodesArr, "linkPids": linksArr};
                    selectCtrl.onSelected(options);
                });


            } else if (type === "laneConnexity") {
                $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": true})
                var obj = {};
                obj["showTransitData"] = []
                obj["showAdditionalData"] = [];
                obj["showNormalData"] = [];
                obj["inLaneInfoArr"] = [];
                objCtrl.setOriginalData(obj);
                var addLaneObj = {
                    "loadType": "attrTplContainer",
                    "propertyCtrl": 'ctrl/toolBar_cru_ctrl/addConnexityCtrl/addLaneconnexityCtrl',
                    "propertyHtml": 'js/tpl/toolBar_cru_tpl/addConnexityTepl/addLaneconnexityTpl.html'
                }
                $scope.$emit("transitCtrlAndTpl", addLaneObj);
            } else if (type === "node") {
                if (shapeCtrl.shapeEditorResult) {
                    shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                    selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }

                shapeCtrl.setEditingType('pointVertexAdd');
                shapeCtrl.startEditing();
                map.currentTool = shapeCtrl.getCurrentTool();
                tooltipsCtrl.setEditEventType('pointVertexAdd');
                tooltipsCtrl.setCurrentTooltip('开始增加节点！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("点击增加节点!");
                tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存,或者按ESC键取消!");
            } else if (type === 'overpass'){
                shapeCtrl.setEditingType("overpass");
                map.currentTool.disable();//禁止当前的参考线图层的事件捕获
                if (typeof map.currentTool.cleanHeight === "function") {
                    map.currentTool.cleanHeight();
                }
                tooltipsCtrl.setEditEventType('overpass');
                tooltipsCtrl.setCurrentTooltip('正要新建立交,请框选立交点位！');
                shapeCtrl.toolsSeparateOfEditor("linksOfOverpass", {
                    map: map,
                    layer: rdLink,
                    type: "rectangle"
                });
                var highLightLink = new fastmap.uikit.HighLightRender(hLayer);
                map.currentTool = shapeCtrl.getCurrentTool();
                eventController.on(eventController.eventTypes.GETBOXDATA, function (event) {
                    var linksArr = [], nodesArr = [], nodes = [], links = [],options={};
                    var data = event.data,highlightFeatures=[];
                    if (nodesArr.length === 0) {
                        for (var nodeNum = 0, nodeLen = data["nodes"].length; nodeNum < nodeLen; nodeNum++) {
                            nodesArr.push(data["nodes"][nodeNum]["node"]);
                        }
                        for (var linkNum = 0, linkLen = data["nodes"].length; linkNum < linkLen; linkNum++) {
                            nodesArr = nodesArr.concat(data["nodes"][linkNum]["link"]);
                            linksArr.push(data["nodes"][linkNum]["link"]);
                        }
                        nodes = nodes.concat(data["nodes"]);
                        links = links.concat(data["links"]);

                    }
                    linksArr = $scope.distinctArr(linksArr);
    // linksArr = ['100002312','100002313','100002314'];
                    nodesArr = $scope.distinctArr(nodesArr);
                    for(var i= 0,lenI=linksArr.length;i<lenI;i++) {
                        highlightFeatures.push({
                            id:linksArr[i].toString(),
                            layerid:'referenceLine',
                            type:'line',
                            style:{
                                color:'yellow'
                            }
                        })
                    }
                    for(var j= 0,lenJ=nodesArr.length;j<lenJ;j++) {
                        highlightFeatures.push({
                            id:nodesArr[j].toString(),
                            layerid:'referenceLine',
                            type:'node',
                            style:{}
                        })
                    }
                    highLightLink.highLightFeatures =highlightFeatures;
                    highLightLink.drawHighlight();
                    options = {"nodePids": nodesArr, "linkPids": linksArr};
                    // console.log(linksArr)
                    selectCtrl.onSelected(options);
                    /*运算两条线的交点坐标*/
                    $scope.segmentsIntr = function(a,b){
                        var area_abc = (a[0].x - b[0].x) * (a[1].y - b[0].y) - (a[0].y - b[0].y) * (a[1].x - b[0].x);
                        var area_abd = (a[0].x - b[1].x) * (a[1].y - b[1].y) - (a[0].y - b[1].y) * (a[1].x - b[1].x);
                        // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);
                        if ( area_abc*area_abd>=0 ) {
                            return false;
                        }

                        var area_cda = (b[0].x - a[0].x) * (b[1].y - a[0].y) - (b[0].y - a[0].y) * (b[1].x - a[0].x);
                        var area_cdb = area_cda + area_abc - area_abd ;
                        if (  area_cda * area_cdb >= 0 ) {
                            return false;
                        }

                        //计算交点坐标
                        var t = area_cda / ( area_abd- area_abc );
                        var dx= t*(a[1].x - a[0].x),
                            dy= t*(a[1].y - a[0].y);
                        return { x: (a[0].x + dx).toFixed(5) , y: (a[0].y + dy).toFixed(5) };//保留小数点后5位
                    }
                    /*去除重复的坐标点，保留一个*/
                    Array.prototype.unique = function(){
                        var res = [];
                        var json = {};
                        for(var i = 0; i < this.length; i++){
                            if(!json[this[i]]){
                                res.push(this[i]);
                                json[this[i]] = 1;
                            }
                        }
                        return res;
                    }
                    var geoArr = [],
                        getGeo = function(){
                        var dtd = $.Deferred(); //在函数内部，新建一个Deferred对象
                        for(var i=0;i<linksArr.length;i++){
                            Application.functions.getRdObjectById(linksArr[i],'RDLINK',function(linkData){
                                if(linkData.errcode == 0){
                                    var coor = linkData.data.geometry.coordinates;
                                    var geoElem = [];
                                    for(var j=0;j<coor.length;j++){
                                        var geoObj = {};
                                        if(j == 0){
                                            geoObj.x = coor[0][0];
                                            geoObj.y = coor[0][1];
                                            geoElem.push(geoObj);
                                        }
                                        if(j == coor.length-1){
                                            geoObj.x = coor[j][0];
                                            geoObj.y = coor[j][1];
                                            geoElem.push(geoObj);
                                        }
                                        if(geoElem.length > 0){
                                        }
                                    }
                                    geoArr.push(geoElem);
                                    dtd.resolve(); // 改变Deferred对象的执行状态
                                }
                            });
                        }
                        return dtd.promise(); // 返回promise对象
                    };
                    /*当坐标数组拆分组合完成后*/
                    $.when(getGeo()).done(function(){
                        // console.log(geoArr)
                        /*geoArr = [
                            [{x:116.47611,y:40.01801},{x:116.47618,y:40.01702}],
                            [{x:116.47525,y:40.01746},{x:116.47719,y:40.01747}],
                            [{x:116.4764,y:40.01786},{x:116.47565,y:40.01723}],
                            [{x:116.47576,y:40.01776},{x:116.47649,y:40.01722}]
                        ];*/
                        /*geoArr = [
                            [{x:116.47819,y:40.01743},{x:116.47856,y:40.01747}],
                            [{x:116.47849,y:40.0176},{x:116.47829,y:40.01729}],
                            [{x:116.47816,y:40.01756},{x:116.47865,y:40.01733}]
                        ];*/
                        var crossGeos = [],
                            loopTime = (geoArr.length*geoArr.length-1)/2;   //循环次数C(n,2)
                        if(geoArr.length > 1){
                            for(var i=0;i<loopTime-1;i++){
                                for(var j=i+1;j<geoArr.length;j++){
                                    if(i!=j){
                                        crossGeos.push($scope.segmentsIntr(geoArr[i],geoArr[j]));
                                    }
                                }
                            }
                            crossGeos = crossGeos.unique();
                        }
                        //判断相交点数
                        // console.log(crossGeos)
                        if(crossGeos.length == 0){
                            tooltipsCtrl.setCurrentTooltip('所选区域无相交点，请重新选择立交点位！');
                        }else if(crossGeos.length > 1){
                            tooltipsCtrl.setCurrentTooltip('不能有多个相交点，请重新选择立交点位！');
                        }else{
                            // console.log(crossGeos)

                        }
                    });
                });
            } else if (type === '3dBranch'){
                var highLightFeatures = [],
                    linkDirect = 0;
                shapeCtrl.setEditingType("rdBranch");
                tooltipsCtrl.setEditEventType('rdBranch');
                tooltipsCtrl.setCurrentTooltip('正要新建3D分歧,先选择线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink
                });
                map.currentTool.enable();
                $scope.excitLineArr = [];
                /*获取退出线*/
                $scope.getOutLink = function(dataId){
                    $scope.excitLineArr.push(parseInt(dataId));
                    $scope.limitRelation.outLinkPid = $scope.excitLineArr[0];
                    tooltipsCtrl.setChangeInnerHtml("已选退出线,点击空格键保存!");
                }
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {

                    if (data.index === 0) {
                        $scope.limitRelation.inLinkPid = parseInt(data.id);
                        tooltipsCtrl.setChangeInnerHtml("已经选择进入线,选择进入点!");
                        Application.functions.getRdObjectById(data.id,'RDLINK',function(linkData){
                            if(linkData.errcode == 0){
                                linkDirect = linkData.data.direct;
                                if(linkDirect == 2 || linkDirect == 3){
                                    $scope.limitRelation.nodePid = parseInt(linkDirect==2 ? linkData.data.eNodePid : linkData.data.sNodePid);
                                    highLightFeatures.push({
                                        id:$scope.limitRelation.nodePid.toString(),
                                        layerid:'referenceLine',
                                        type:'rdnode',
                                        style:{}
                                    });
                                    var highLightRender = new fastmap.uikit.HighLightRender(hLayer);
                                    highLightRender.highLightFeatures = highLightFeatures;
                                    highLightRender.drawHighlight();
                                    map.currentTool.selectedFeatures.push($scope.limitRelation.nodePid.toString());
                                    tooltipsCtrl.setChangeInnerHtml("已经选择进入点,选择退出线!");
                                }
                            }
                        });
                    } else if (data.index === 1) {
                        if(linkDirect == 2 || linkDirect == 3){
                            $scope.getOutLink(data.id);
                            return;
                        }
                        else{
                            $scope.limitRelation.nodePid = parseInt(data.id);
                            tooltipsCtrl.setChangeInnerHtml("已经选择进入点,选择退出线!");
                        }
                    } else if (data.index > 1) {
                        $scope.getOutLink(data.id);
                    }
                    featCodeCtrl.setFeatCode($scope.limitRelation);
                })
            }
        }

    }]
)
