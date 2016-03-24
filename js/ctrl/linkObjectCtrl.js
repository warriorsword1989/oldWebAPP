/**
 * Created by liwanchong on 2015/10/29.
 */
var myApp = angular.module("mapApp", ['oc.lazyLoad']);
myApp.controller('linkObjectController', ['$scope', '$ocLazyLoad',function ($scope, $ocLazyLoad) {
    var objectCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var rdLink = layerCtrl.getLayerById("referenceLine");
    var editLayer = layerCtrl.getLayerById('edit');
    var rdCross = layerCtrl.getLayerById("rdcross")
    var outputCtrl = fastmap.uikit.OutPutController({});
    var selectCtrl = new fastmap.uikit.SelectController();
    var toolTipsCtrl = fastmap.uikit.ToolTipsController();
    var eventController = fastmap.uikit.EventController();
    $scope.speedAndDirect=shapeCtrl.shapeEditorResult.getFinalGeometry();
    $scope.brigeIndex=0;
    //改变模块的背景
    $scope.initializeLinkData = function () {
        $("#fm-link-tabControl a").removeClass("selected");
        $("#fm-link-tabControl a:first").addClass("selected");
        $scope.dataTipsData = selectCtrl.rowKey;
        objectCtrl.setOriginalData(objectCtrl.data.getIntegrate());
        $scope.linkData = objectCtrl.data;
        $ocLazyLoad.load('ctrl/linkCtrl/basicCtrl').then(function () {
            $scope.currentURL = "js/tepl/linkObjTepl/basicTepl.html";
        });
        //随着地图的变化 高亮的线不变
        if($scope.dataTipsData && $scope.dataTipsData.f_array && $scope.dataTipsData.f_array.length > 0){
            var linksArr = [];
            for(var item in $scope.dataTipsData.f_array){
                linksArr.push($scope.dataTipsData.f_array[item].id);
            }
            var highLightLink = new fastmap.uikit.HighLightRender(rdLink, {
                map: map,
                highLightFeature: "link",
                initFlag: true,
                linksArr: linksArr
            });
            highLightLayer.pushHighLightLayers(highLightLink);
            highLightLink.drawLinksOfCrossForInit(linksArr,[],[]);
        }else{
            var highLightLink = new fastmap.uikit.HighLightRender(rdLink, {
                map: map,
                highLightFeature: "link",
                initFlag: true,
                linkPid: $scope.linkData.pid.toString()
            });
            highLightLayer.pushHighLightLayers(highLightLink);
            highLightLink.drawOfLinkForInit();
        }
    };
    //初始化controller调用
    if (objectCtrl.data) {
        $scope.initializeLinkData();
    }
    //获取某个模块的信息
    $scope.changeModule = function (url,ind) {

        var a= $("#fm-link-tabControl a");
        $.each(a,function(i,value){
            if(ind==i){
                $(this).addClass("selected");
            }else{
                $(this).removeClass("selected");
            }
        })

        $scope.$parent.$parent.suspendFlag = false;
        $scope.$parent.$parent.suspendObjURL = "";
        if (url === "basicModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/basicCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/basicTepl.html";
            });
        } else if (url === "paginationModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/pedestrianNaviCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/pedestrianNaviTepl.html";
            });
        } else if (url === "realtimeModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/realtimeTrafficCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/realtimeTrafficTepl.html";
            });
        } else if (url === "zoneModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/zonePeopertyCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/zonePeopertyTepl.html";
            });
        } else if (url === "limitedModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/limitedCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/limitedTepl.html";
            });
        } else if (url == "otherModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/otherCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/otherTepl.html";
            });
        }else if (url == "nameModule") {//道路名
            $ocLazyLoad.load('ctrl/linkCtrl/rdNameCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/rdNameTepl.html";
            });
        }else if (url == "speedModule") {//限速
            $ocLazyLoad.load('ctrl/linkCtrl/speedCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/speedTepl.html";
            });
        }
    }
    $scope.angleOfLink=function(pointA,pointB) {
        var PI = Math.PI,angle;
       if(pointA.x-pointB.x===0) {
           angle = PI / 2;
       }else{
           angle = Math.atan((pointA.y - pointB.y) / (pointA.y - pointB.y));
       }
        return angle;

    };
    $scope.changeDirect = function (direct) {
        map.currentTool = shapeCtrl.getCurrentTool();
        map.currentTool.disable();
        var containerPoint;
        var point= {x:$scope.linkData.geometry.coordinates[0][0], y:$scope.linkData.geometry.coordinates[0][1]};
        var pointVertex= {x:$scope.linkData.geometry.coordinates[1][0], y:$scope.linkData.geometry.coordinates[1][1]};
        containerPoint = map.latLngToContainerPoint([point.y, point.x]);
        pointVertex = map.latLngToContainerPoint([pointVertex.y, pointVertex.x]);
        var angle = $scope.angleOfLink(containerPoint, pointVertex);
        var marker = {
            flag:true,
            pid:$scope.linkData.pid,
            point: point,
            type: "marker",
            angle:angle,
            orientation:direct.toString()
        };
        var editLayer = layerCtrl.getLayerById('edit');
        layerCtrl.pushLayerFront('edit');
        var sObj = shapeCtrl.shapeEditorResult;
        editLayer.drawGeometry =  marker;
        editLayer.draw( marker, editLayer);
        sObj.setOriginalGeometry( marker);
        sObj.setFinalGeometry(marker);
        shapeCtrl.setEditingType("transformDirect");
        shapeCtrl.startEditing();
    };
    $scope.save = function () {
        /*如果普通限制修改时间段信息*/
        if($scope.linkData.limits){
            $.each($scope.linkData.limits,function(i,v){
                $.each($("#popularLimitedDiv").find(".muti-date"),function(m,n){
                    if(i == m){
                        v.timeDomain = $(n).attr('date-str');
                        delete v.pid;
                    }
                });
            });
        }
        /*如果卡车限制修改时间段信息*/
        if($scope.linkData.limitTrucks){
            $.each($scope.linkData.limitTrucks,function(i,v){
                        // console.log(v.pid)
                $.each($("#trafficLimited").find(".muti-date"),function(m,n){
                    if(i == m){
                        v.timeDomain = $(n).attr('date-str');
                        // delete v.pid;
                    }
                });
            });
        }
        /*如果道路名新增*/
        if($scope.linkData.names){
            $.each($scope.linkData.names,function(i,v){
                if(v.pid)
                    delete v.pid;
            });
        }
        objectCtrl.save();
        if(objectCtrl.changedProperty.limits){
            if(objectCtrl.changedProperty.limits.length > 0){
                $.each(objectCtrl.changedProperty.limits,function(i,v){
                    delete v.pid;
                });
            }
        }
        if(objectCtrl.changedProperty.limitTrucks){
            if(objectCtrl.changedProperty.limitTrucks.length > 0){
                $.each(objectCtrl.changedProperty.limitTrucks,function(i,v){
                    delete v.pid;
                });
            }
        }
        var param = {
            "command": "UPDATE",
            "type":"RDLINK",
            "projectId": Application.projectid,
            "data": objectCtrl.changedProperty
        };
        Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
            var info = null;
            if (data.errcode==0) {
                rdLink.redraw();
                if(shapeCtrl.shapeEditorResult.getFinalGeometry()!==null) {
                    if (typeof map.currentTool.cleanHeight === "function") {
                        map.currentTool.cleanHeight();
                    }
                    if (toolTipsCtrl.getCurrentTooltip()) {
                        toolTipsCtrl.onRemoveTooltip();
                    }
                    editLayer.drawGeometry = null;
                    editLayer.clear();
                    shapeCtrl.stopEditing();
                    editLayer.bringToBack();
                    $(editLayer.options._div).unbind();
                }
                swal("操作成功",'保存成功！', "success");
                var sInfo={
                    "op":"修改道路link成功",
                    "type":"",
                    "pid": ""
                };
                data.data.log.push(sInfo);
                for(var i=0; i<data.data.log.length-1;i++){
                    data.data.log[i].rowId=$scope.linkData.pid;
                }

                info=data.data.log;

            } else {
                swal("操作失败", data.errmsg, "error");
                info=[{
                    "op":data.errcode,
                    "type":data.errmsg,
                    "pid": data.errid
                }];
            }
            outputCtrl.pushOutput(info);
            if (outputCtrl.updateOutPuts !== "") {
                outputCtrl.updateOutPuts();
            }
        })
    };
    $scope.delete = function () {
        var objId = parseInt($scope.linkData.pid);
        var param = {
            "command": "DELETE",
            "type":"RDLINK",
            "projectId": Application.projectid,
            "objId": objId
        }
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var info = null;
            if (data.errcode==0) {
                var sinfo={
                    "op":"删除道路link成功",
                    "type":"",
                    "pid": ""
                };
                data.data.log.push(sinfo);
                info=data.data.log;
            }else{
                info=[{
                         "op":data.errcode,
                          "type":data.errmsg,
                          "pid": data.errid
                    }];
            }

            //"errmsg":"此link上存在交限关系信息，删除该Link会对应删除此组关系"
            if (data.errmsg != "此link上存在交限关系信息，删除该Link会对应删除此组关系") {
                rdLink.redraw();
                rdCross.redraw();
                outputCtrl.pushOutput(info);
                if (outputCtrl.updateOutPuts !== "") {
                    outputCtrl.updateOutPuts();
                }
                $scope.linkData = null;
                var editorLayer = layerCtrl.getLayerById("edit")
                editorLayer.clear();
                $scope.$parent.$parent.objectEditURL = "";
            } else {
                outputCtrl.pushOutput(info);
                if (outputCtrl.updateOutPuts !== "") {
                    outputCtrl.updateOutPuts();
                }
            }
        })
    }

    $scope.changeLink=function(ind,linkId){
        $scope.brigeIndex=ind;
        Application.functions.getRdObjectById(linkId, "RDLINK", function (data) {
            if (data.errcode === -1) {
                return;
            }
            var linkArr = data.data.geometry.coordinates || data.geometry.coordinates, points = [];
            for (var i = 0, len = linkArr.length; i < len; i++) {
                var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                points.push(point);
            }
            map.panTo({lat: points[0].y, lon: points[0].x});
            var line = fastmap.mapApi.lineString(points);
            selectCtrl.onSelected({geometry: line, id: $scope.dataId});
            objectCtrl.setCurrentObject(data);
            if (objectCtrl.updateObject !== "") {
                objectCtrl.updateObject();
            }
            $ocLazyLoad.load("ctrl/linkObjectCtrl").then(function () {
                $scope.$parent.$parent.objectEditURL = "js/tepl/linkObjTepl/linkObjectTepl.html";
            });
        });
    }
    $scope.cancel=function(){
    }
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeLinkData);
}]);