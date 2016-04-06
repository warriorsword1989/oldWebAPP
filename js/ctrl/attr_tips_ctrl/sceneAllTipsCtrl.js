/**
 * Created by liuzhaoxia on 2016/1/5.
 */
var dataTipsApp = angular.module("lazymodule", []);
dataTipsApp.controller("sceneAllTipsController", function ($scope, $timeout, $ocLazyLoad) {
    var selectCtrl = fastmap.uikit.SelectController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var restrictLayer = layerCtrl.getLayerById("restriction");
    var workPoint = layerCtrl.getLayerById("workPoint");

    var gpsLine = layerCtrl.getLayerById("gpsLine");

    $scope.eventController = fastmap.uikit.EventController();

    //清除地图上的高亮的feature
    if (highLightLayer.highLightLayersArr.length !== 0) {
        highLightLayer.removeHighLightLayers();
    }
    $scope.outIdS = [];

    //初始化DataTips相关数据
    $scope.initializeDataTips = function (data) {
        $scope.photoTipsData = [];
        $scope.photos = [];
        $scope.dataTipsData = data;//selectCtrl.rowKey;
        $scope.rowkey = $scope.dataTipsData.rowkey;
        $scope.allTipsType = $scope.dataTipsData.s_sourceType;
        var highLightDataTips = new fastmap.uikit.HighLightRender(workPoint, {
            map: map,
            highLightFeature: "dataTips",
            dataTips: $scope.dataTipsData.rowkey,
            initFlag:true
        });
        //显示状态
        if ($scope.dataTipsData) {
            switch ($scope.dataTipsData.t_lifecycle) {
                case 1:
                    $scope.showContent = "外业删除";
                    break;
                case 2:
                    $scope.showContent = "外业修改";
                    $scope.labelInfo = false;
                    $scope.labelSuc = true;
                    break;
                case 3:
                    $scope.showContent = "外业新增";
                    $scope.labelInfo = true;
                    $scope.labelSuc = false;
                    break;
                case 0:
                    $scope.showContent = "默认值";
                    break;
            }
        }
        switch ($scope.allTipsType) {
            case "1101":
                $scope.speedDirectTypeOptions = [
                    {"id": 0, "label": "0  未调查"},
                    {"id": 2, "label": "2 顺方向"},
                    {"id": 3, "label": "3 逆方向"}
                ];
                for (var i in $scope.speedDirectTypeOptions) {
                    if ($scope.speedDirectTypeOptions[i].id == $scope.dataTipsData.rdDir) {
                        $scope.rdDir = $scope.speedDirectTypeOptions[i].label;
                    }
                }
                $scope.limitSrcOption = [
                    {"id": 0, "label": "0  无"},
                    {"id": 1, "label": "1 现场标牌"},
                    {"id": 2, "label": "2 城区标识"},
                    {"id": 3, "label": "3 高速标识"},
                    {"id": 4, "label": "4 车道限速"},
                    {"id": 5, "label": "5 方向限速"},
                    {"id": 6, "label": "6 机动车限速"},
                    {"id": 7, "label": "7 匝道未调查"},
                    {"id": 8, "label": "8 缓速行驶"},
                    {"id": 9, "label": "9 未调查"}
                ];
                for (var i in $scope.limitSrcOption) {
                    if ($scope.limitSrcOption[i].id == $scope.dataTipsData.src) {
                        $scope.limitSrc = $scope.limitSrcOption[i].label;
                    }
                }
                break;
            case "1201":
                $scope.returnKindType = function (code) {
                    switch (code) {
                        case 0:
                            return '作业中';
                        case 1:
                            return "高速道路";
                        case 2:
                            return "城市高速";
                        case 3:
                            return "国道";
                        case 4:
                            return "省道";
                        case 5:
                            return "预留";
                        case 6:
                            return "县道";
                        case 7:
                            return "乡镇村道路";
                        case 8:
                            return "其他道路";
                        case 9:
                            return "非引导道路";
                        case 10:
                            return "步行道路";
                        case 11:
                            return "人渡";
                        case 13:
                            return "轮渡";
                        case 15:
                            return "10级路（障碍物）";
                    }
                };
                $scope.kindType = $scope.returnKindType($scope.dataTipsData.kind);

                break;
            case "1203"://道路方向
                if ($scope.dataTipsData.dr == 1) {
                    $scope.drs = "双方向";
                } else {
                    $scope.drs = "单方向";
                }
                $scope.fData = $scope.dataTipsData.f;
                break;
            case "1301"://车信
                $scope.oarrayData = $scope.dataTipsData.o_array;
                for (var i in $scope.oarrayData) {
                    for (var j in $scope.oarrayData[i].d_array) {
                        for (var m in $scope.oarrayData[i].d_array[j].out) {
                            $scope.outIdS.push({id: $scope.oarrayData[i].d_array[j].out[m].id});
                        }
                    }
                }
                break;
            case "1302":
                //高亮
                $scope.restrictOutLinks = [];
                var detailsOfHigh = $scope.dataTipsData.o_array, linksObj = {};
                linksObj["inLink"] = $scope.dataTipsData.in.id;
                for (var hiNum = 0, hiLen = detailsOfHigh.length; hiNum < hiLen; hiNum++) {
                    var outLinksOfHigh = detailsOfHigh[hiNum].out;
                    if (outLinksOfHigh !== undefined) {
                        for (var outNum = 0, outLen = outLinksOfHigh.length; outNum < outLen; outNum++) {

                            linksObj["outLink" + outNum] = outLinksOfHigh[outNum].id;
                            $scope.restrictOutLinks.push(outLinksOfHigh[outNum].id);
                        }
                    }

                }
                var highLightLinks = new fastmap.uikit.HighLightRender(rdLink, {
                    map: map,
                    highLightFeature: "links",
                    linksObj: linksObj
                })
                highLightLinks.drawOfLinksForInit();
                highLightLayer.pushHighLightLayers(highLightLinks);
                break;
            case "1407":
                /*进入*/
                $scope.sceneEnty = $scope.dataTipsData.in.id;
                /*模式图号*/
                $scope.schemaNo = $scope.dataTipsData.ptn;
                $scope.scheName=$scope.dataTipsData.name;
                /*退出*/
                $scope.sceneExit = [];
                $.each($scope.dataTipsData.o_array,function(i,v){
                    if(v.out){
                        $scope.sceneExit.push(v.out.id);
                    }
                });
                break;
            case "1510"://桥
                $scope.brigeArrayLink = $scope.dataTipsData.f_array;
                // console.log($scope.brigeArrayLink)
                break;
            case "1604"://区域内道路
                $scope.fData = $scope.dataTipsData.f_array;
                $scope.zoneRoadState = [
                    {"type":0,"state":"不应用"},
                    {"type":1,"state":"删除"},
                    {"type":2,"state":"修改"},
                    {"type":3,"state":"新增"},
                ];
                break;
            case "1704"://交叉路口
                $scope.fData = $scope.dataTipsData;
                break;
            case "1803"://挂接
                if($scope.dataTipsData.pcd){//有图片时，显示图片
                    $scope.pcd=$scope.dataTipsData.pcd.substr(0,4);
                }else{//无图片时获取经纬度，高亮
                    $scope.garray=$scope.dataTipsData.g_array;
                    if($scope.garray.geo.type=="Point"){

                    }else if($scope.garray.geo.type=="Line"){
                        var highLightroadNamesTips = new fastmap.uikit.HighLightRender(gpsLine, {
                            map: map,
                            highLightFeature: "link",
                            initFlag: true,
                            linkPid: $scope.dataTipsData.rowkey.toString()
                        });
                        highLightroadNamesTips.drawOfLinkForInit();
                        highLightLayer.pushHighLightLayers(highLightroadNamesTips);
                    }
                }

                break;
            case "1901":
                $scope.nArrayData = $scope.dataTipsData.n_array;

                var highLightroadNamesTips = new fastmap.uikit.HighLightRender(gpsLine, {
                    map: map,
                    highLightFeature: "linkOfGps",
                    initFlag: true,
                    linkPid: $scope.dataTipsData.rowkey.toString()
                });
                highLightroadNamesTips.drawOfLinkForInit();
                highLightLayer.pushHighLightLayers(highLightroadNamesTips);

                break;
            case "2001":
                /*种别*/
                $scope.returnLineType = function (code) {
                    switch (code) {
                        case 0:
                            return '作业中';
                        case 1:
                            return "高速道路";
                        case 2:
                            return "城市高速";
                        case 3:
                            return "国道";
                        case 4:
                            return "省道";
                        case 5:
                            return "预留";
                        case 6:
                            return "县道";
                        case 7:
                            return "乡镇村道路";
                        case 8:
                            return "其他道路";
                        case 9:
                            return "非引导道路";
                        case 10:
                            return "步行道路";
                        case 11:
                            return "人渡";
                        case 13:
                            return "轮渡";
                        case 15:
                            return "10级路（障碍物）";
                    }
                }
                /*测线来源*/
                $scope.returnLineSrc = function (code) {
                    switch (code) {
                        case 0:
                            return 'GPS测线';
                        case 1:
                            return '惯导测线';
                        case 2:
                            return '自绘测线';
                        case 3:
                            return '影像矢量测线';
                        case 4:
                            return '情报';
                    }
                }
                if ($scope.dataTipsData) {
                    /*种别*/
                    $scope.lineType = $scope.returnLineType($scope.dataTipsData.kind);
                    /*来源*/
                    $scope.lineSrc = $scope.returnLineSrc($scope.dataTipsData.src);
                    /*车道数*/
                    $scope.carNumber = $scope.dataTipsData.ln;
                }
                var highLightgpsTips = new fastmap.uikit.HighLightRender(gpsLine, {
                    map: map,
                    highLightFeature: "link",
                    initFlag: true,
                    linkPid: $scope.dataTipsData.id.toString()
                });

                highLightLayer.pushHighLightLayers(highLightgpsTips);
                break;
            case "1514"://施工
                $scope.constructionArrayLink = $scope.dataTipsData.f_array;
                break;
            case "1501"://上下线分离
                $scope.upperAndLowerArrayLink = $scope.dataTipsData.f_array;
                break;
            case "1403"://3D
                /*进入*/
                $scope.sceneEnty = $scope.dataTipsData.sceneEnty;
                /*模式图号*/
                $scope.schemaNo = $scope.dataTipsData.schemaNo;
                break;
            case "1801"://立交
                break;

        }
        //获取数据中的图片数组
        if (!$scope.photos) {
            $scope.photos = [];
        }

        //$scope.photoTipsData =  $scope.dataTipsData.feedback.f_array;
        for (var i in  $scope.photoTipsData) {
            if ($scope.photoTipsData[i].type === 1) {
                var content = Application.url + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + $scope.photoTipsData[i].content + '",type:"thumbnail"}';
                $scope.photos.push(content);
            } else if ($scope.photoTipsData[i].type === 3) {
                $scope.remarksContent = $scope.photoTipsData[i].content;
            }

        }
        if ($scope.photos.length != 0 && $scope.photos.length < 4) {
            for (var a = $scope.photos.length; a < 4; a++) {
                var img = "./css/img/noimg.png";
                $scope.photos.push(img);
            }
        } else {
            for (var j = 0; j < 4; j++) {
                var newImg= "./css/img/noimg.png";
                $scope.photos.push(newImg);
            }
        }
    };
    if (selectCtrl.rowKey) {
        //dataTips的初始化数据
        $scope.initializeDataTips(selectCtrl.rowKey);
    }
    $scope.openOrigin=function(id) {
        selectCtrl.rowKey["pictureId"] = id;
        var openOriginObj = {
            "loadType":"tipsPitureContainer",
            "propertyCtrl":"ctrl//attr_tips_ctrl/tipsPictureCtrl",
            "propertyHtml":"js/tpl/attr_tips_tpl/tipsPictureTpl.html"
        };
        $scope.$emit("transitCtrlAndTpl", openOriginObj);
    };
    $scope.eventController.on($scope.eventController.eventTypes.SELECTBYATTRIBUTE,function(event) {
        $scope.initializeDataTips(event.feather);
        $scope.$apply();
    })
    $scope.createRestrictByTips=function() {
        var info = null;
        Application.functions.getRdObjectById($scope.dataTipsData.in.id, "RDLINK", function (data) {
            var restrictObj = {};
            restrictObj["inLinkPid"] = parseInt($scope.dataTipsData.in.id);
            var dataTipsGeo = $scope.dataTipsData.g_location.coordinates;
            var outLinkPids = [];
            for (var outNum = 0, outLen = $scope.dataTipsData.o_array.length; outNum < outLen; outNum++) {
                var outLinks = $scope.dataTipsData.o_array[outNum].out;
                if (!outLinks) {
                    alert("没有退出线，请手动建立交限");
                    return;
                }
                for (var outLinksN = 0, outLinksL = outLinks.length; outLinksN < outLinksL; outLinksN++) {
                    outLinkPids.push(parseInt(outLinks[outLinksN].id));
                }
            }
            restrictObj["outLinkPids"] = outLinkPids;
            var inLinkGeo = data.data.geometry.coordinates, inNode;
            if (data.data.direct === 1) {
                var dataTipsToStart = Math.abs(dataTipsGeo[0] - inLinkGeo[0][0]) + Math.abs(dataTipsGeo[1] - inLinkGeo[0][1]);
                var dataTipsToEnd = Math.abs(dataTipsGeo[0] - inLinkGeo[inLinkGeo.length - 1][0]) + Math.abs(dataTipsGeo[1] - inLinkGeo[inLinkGeo.length - 1][1]);
                if (dataTipsToStart - dataTipsToEnd) {
                    inNode = parseInt(data.data.eNodePid)
                } else {
                    inNode = parseInt(data.data.sNodePid);
                }
            } else {

                if (data.data.direct === 2) {
                    inNode = parseInt(data.data.eNodePid);
                } else if (data.data.direct === 3) {
                    inNode = parseInt(data.data.sNodePid);
                }

            }
            ;
            restrictObj["nodePid"] = inNode;
            var param = {
                "command": "CREATE",
                "type": "RDRESTRICTION",
                "projectId": Application.projectid,
                "data": restrictObj
            };
            Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                if (data.errcode === -1) {
                    info = [{
                        "op": data.errcode,
                        "type": data.errmsg,
                        "pid": data.errid
                    }];
                    outPutCtrl.pushOutput(info);
                    if (outPutCtrl.updateOutPuts !== "") {
                        outPutCtrl.updateOutPuts();
                    }
                    return;
                }
                var pid = data.data.log[0].pid;
                restrictLayer.redraw();//交限图层刷新
                workPoint.redraw();//dataTip图层刷新
                $scope.upBridgeStatus();
                Application.functions.getRdObjectById(pid, "RDRESTRICTION", function (data) {
                    objCtrl.setCurrentObject("RDRESTRICTION", data.data);
                    var restrictObj = {
                        "loadType":"attrTplContainer",
                        "propertyCtrl":"ctrl/attr_restriction_ctrl/rdRestriction",
                        "propertyHtml":"js/pl/rdRestricOfOrdinaryTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", restrictObj);
                })

            });
        });

    };

    /*转换*/
    $scope.transBridge = function (e) {
        var stageLen = $scope.dataTipsData.t_trackInfo.length;
        var stage = parseInt($scope.dataTipsData.t_trackInfo[stageLen - 1]["stage"]);
        if ($scope.dataTipsData.s_sourceType === "2001") {  //测线
            var paramOfLink = {
                "command": "CREATE",
                "type": "RDLINK",
                "projectId": Application.projectid,
                "data": {
                    "eNodePid": 0,
                    "sNodePid": 0,
                    "kind":$scope.dataTipsData.kind,
                    "laneNum":$scope.dataTipsData.ln,
                    "geometry": {"type": "LineString", "coordinates": $scope.dataTipsData.g_location.coordinates}
                }
            }
            if($scope.dataTipsData.t_trackInfo[$scope.dataTipsData.t_trackInfo.length-1].stage == 3){
                $timeout(function(){
                    $.showPoiMsg('状态已为 【回prj_gdb库】 ，不允许改变状态！',e);
                    $scope.$apply();
                });
                return;
            }else if($scope.dataTipsData.t_trackInfo[$scope.dataTipsData.t_trackInfo.length-1].stage != 3 && $scope.dataTipsData.t_trackInfo[$scope.dataTipsData.t_trackInfo.length-1].stage != 1){
                $timeout(function(){
                    $.showPoiMsg('只有外业采集数据可进行转换',e);
                    $scope.$apply();
                });
                return;
            }
            Application.functions.saveLinkGeometry(JSON.stringify(paramOfLink), function (data) {
                var info = null;
                if (data.data) {
                    $scope.upBridgeStatus(data.data.pid, e);

                    if(data.errcode == 0){
                        if(workPoint)
                        workPoint.redraw();
                        var sInfo={
                            "op":"测线转换操作成功",
                            "type":"",
                            "pid": ""
                        };
                        data.data.log.push(sInfo);
                        info=data.data.log;
                        rdLink.redraw();
                        swal("操作成功", "测线转换操作成功！", "success");
                        $scope.dataTipsData.t_trackInfo[$scope.dataTipsData.t_trackInfo.length-1].stage = 3;
                        $scope.$apply();
                    }
                } else {
                    info=[{
                        "op":data.errcode,
                        "type":data.errmsg,
                        "pid": data.errid
                    }];
                    swal("操作失败", data.errmsg, "error");
                }
                outPutCtrl.pushOutput(info);
                if (outPutCtrl.updateOutPuts !== "") {
                    outPutCtrl.updateOutPuts();
                }
            });
        } else if ($scope.dataTipsData.s_sourceType === "1201") {
            var info=null;
            var kindObj = {
                "objStatus": "UPDATE",
                "pid": parseInt($scope.dataTipsData.f.id),
                "kind": $scope.dataTipsData.kind
            };
            var param = {
                "type": "RDLINK",
                "command": "UPDATE",
                "projectId": Application.projectid,
                "data": kindObj
            };
            if (stage === 1) {
                Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {

                    $scope.$parent.$parent.$apply();
                    if (data.errcode == 0) {
                        objCtrl.data.data["kind"] = $scope.dataTipsData.kind;
                        $scope.upBridgeStatus();
                        restrictLayer.redraw();
                        workPoint.redraw();
                        var sInfo={
                            "op":"种别转换操作成功",
                            "type":"",
                            "pid": ""
                        };
                        data.data.log.push(sInfo);
                        info=data.data.log;
                        swal("操作成功", "种别转换操作成功！", "success");
                    } else {
                        info=[{
                            "op":data.errcode,
                            "type":data.errmsg,
                            "pid": data.errid
                        }];
                        swal("操作失败", data.errmsg, "error");
                    }

                })
            } else {
                swal("操作失败", '数据已经转换', "error");
            }

            outPutCtrl.pushOutput(info);
            if (outPutCtrl.updateOutPuts !== "") {
                outPutCtrl.updateOutPuts();
            }
        }else if ($scope.dataTipsData.s_sourceType === "1302") {
            $scope.createRestrictByTips()
        }


    };
    $scope.upBridgeStatus = function (pid,e) {
        if ($scope.rowkey!== undefined) {
            var stageParam = {
                "rowkey":$scope.rowkey,
                "stage": 3,
                "handler": 0
            }
            if($scope.dataTipsData.t_trackInfo[$scope.dataTipsData.t_trackInfo.length-1].stage == 3){
                $timeout(function(){
                    $.showPoiMsg('状态已改，不允许改变状态！',e);
                    $scope.$apply();
                });
                return;
            }
            Application.functions.changeDataTipsState(JSON.stringify(stageParam), function (data) {

                var info = [];
                if (data.errcode === 0) {
                    if(workPoint)
                        workPoint.redraw();
                    $scope.showContent = "外业新增";
                    $scope.dataTipsData.t_trackInfo[$scope.dataTipsData.t_trackInfo.length-1].stage = 3;
                    if(data.data){
                        var sInfo={
                            "op":"状态修改成功",
                            "type":"",
                            "pid": ""
                        };
                        data.data.log.push(sInfo);
                        info=data.data.log;
                    }else{
                        var sInfo=[{
                            "op":"状态修改成功",
                            "type":"",
                            "pid": ""
                        }];
                        data.data=sInfo;
                        info=data.data;
                    }

                    swal("操作成功", "状态修改成功！", "success");
                } else {
                    info=[{
                        "op":data.errcode,
                        "type":data.errmsg,
                        "pid": data.errid
                    }];

                    swal("操作失败",data.errmsg, "error");
                }
                outPutCtrl.pushOutput(info);
                if (outPutCtrl.updateOutPuts !== "") {
                    outPutCtrl.updateOutPuts();
                }
                $scope.rowkey = undefined;
            })
        }
    }

    $scope.closeTips = function () {
        $("#popoverTips").css("display", "none");
    }
});
