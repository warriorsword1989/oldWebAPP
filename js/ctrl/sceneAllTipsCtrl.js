/**
 * Created by liuzhaoxia on 2016/1/5.
 */
var dataTipsApp = angular.module("lazymodule", []);
dataTipsApp.controller("sceneAllTipsController", function ($scope, $timeout, $ocLazyLoad) {
    var dataTipsCtrl = new fastmap.uikit.DataTipsController();
    var selectCtrl = new fastmap.uikit.SelectController();
    var checkCtrl = fastmap.uikit.CheckResultController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var restrictLayer = layerCtrl.getLayerById("referencePoint");
    var workPoint = layerCtrl.getLayerById("workPoint");
    var speedlimtPoint = layerCtrl.getLayerById("speedlimit");
    //清除地图上的高亮的feature
    if (highLightLayer.highLightLayersArr.length !== 0) {
        highLightLayer.removeHighLightLayers();
    }
    $scope.outIdS = [];

    $scope.testA = function (event) {
        map.scrollWheelZoom = false;
        //event.preventDefault();
    };
    $scope.testB = function (event) {
    };

    //初始化DataTips相关数据
    $scope.initializeDataTips = function () {
        $scope.photoTipsData = [];
        $scope.photos = [];
        $scope.dataTipsData = selectCtrl.rowKey;
        $scope.allTipsType = $scope.dataTipsData.s_sourceType;
        var highLightDataTips = new fastmap.uikit.HighLightRender(workPoint, {
            map: map,
            highLightFeature: "dataTips",
            dataTips: $scope.dataTipsData.rowkey
        });
        highLightDataTips.drawTipsForInit();
        highLightLayer.pushHighLightLayers(highLightDataTips);
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
                    //.d_array[$index].out[$index].id
                    for (var j in $scope.oarrayData[i].d_array) {
                        for (var m in $scope.oarrayData[i].d_array[j].out) {
                            $scope.outIdS.push({id: $scope.oarrayData[i].d_array[j].out[m].id});
                        }
                    }
                }
                break;
            case "1302":
                break;
            case "1407":
                break;
            case "1510"://桥
                $scope.brigeArrayLink = $scope.dataTipsData.f_array;
                // console.log($scope.brigeArrayLink)
                break;
            case "1604"://区域内道路
                $scope.fData = $scope.dataTipsData.f_array;
                break;
            case "1704"://交叉路口
                $scope.fData = $scope.dataTipsData;
                break;
            case "1803":
                break;
            case "1901":
                $scope.nArrayData = $scope.dataTipsData.n_array;
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
                break;

        }

        //获取数据中的图片数组
        if (!$scope.photos) {
            $scope.photos = [];
        }

        $scope.photoTipsData = selectCtrl.rowKey.f_array;


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
                var imgs = "./css/img/noimg.png";
                $scope.photos.push(imgs);
            }
        } else {
            for (var j = 0; j < 4; j++) {
                var newimgs = "./css/img/noimg.png";
                $scope.photos.push(newimgs);
            }
        }
    };
    if (selectCtrl.rowKey) {
        //dataTips的初始化数据
        $scope.initializeDataTips();

    } else {
        $scope.rdSubTipsData = [];
    }
    selectCtrl.updateTipsCtrl = function () {
        $scope.initializeDataTips();
        $scope.$apply();
    };
    $scope.openOrigin = function (id) {
        if(id <= selectCtrl.rowKey.f_array.length-1){
            $scope.openshotoorigin = selectCtrl.rowKey.f_array[id];
            var originImg = $("#dataTipsOriginImg");
            originImg.attr("src", Application.url + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + $scope.openshotoorigin.content + '",type:"origin"}');
            /*$("#dataTipsOriginModal").css('width',(202+parseInt($("#mainContent").width()))+'px');
            $("#dataTipsOriginModal").modal({
                backdrop:false,
                show:true
            });
            $(".modal-backdrop").remove();*/
            dataTipsOriginImg.onload = function(){
                originImg.hide();
                originImg.smartZoom('destroy'); 
                if($(".zoomableContainer").length == 0){
                    $("#dataTipsOriginModal").width(parseInt($("#mainContent").width())-244);
                    originImg.smartZoom({'containerClass':'zoomableContainer'});
                    $('#zoomInButton,#zoomOutButton').bind("click", function(e){
                        var scaleToAdd = 0.8;
                        if(e.target.id == 'zoomOutButton')
                            scaleToAdd = -scaleToAdd;
                        originImg.smartZoom('zoom', scaleToAdd);
                    });
                }
                $("#dataTipsOriginModal").css('visibility', 'inherit');
                originImg.show();
            }
            
        }
    }
    /*转换*/
    $scope.transBridge = function (e) {
        var stageLen = $scope.dataTipsData.t_trackInfo.length;
        var stage = parseInt($scope.dataTipsData.t_trackInfo[stageLen - 1]["stage"]);
        $scope.$parent.$parent.showLoading = true;  //showLoading
        if ($scope.dataTipsData.s_sourceType === "2001") {  //测线
            var paramOfLink = {
                "command": "CREATE",
                "type": "RDLINK",
                "projectId": 11,
                "data": {
                    "eNodePid": 0,
                    "sNodePid": 0,
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
                var info = [];
                if (data.data) {
                    $scope.upBridgeStatus(data.data.pid, e);

                    $.each(data.data.log, function (i, item) {
                        if (item.pid) {
                            info.push(item.op + item.type + "(pid:" + item.pid + ")");
                        } else {
                            info.push(item.op + item.type + "(rowId:" + item.rowId + ")");
                        }
                    });
                    if(data.errcode == 0){
                        if(workPoint)
                        workPoint.redraw();
                        swal("操作成功", "测线转换操作成功！", "success");
                        $scope.dataTipsData.t_trackInfo[$scope.dataTipsData.t_trackInfo.length-1].stage = 3;
                        $scope.$apply();
                    }
                } else {
                    info.push(data.errmsg + data.errid)
                    swal("操作失败", data.errmsg, "error");
                }
                outPutCtrl.pushOutput(info);
                if (outPutCtrl.updateOutPuts !== "") {
                    outPutCtrl.updateOutPuts();
                }


            });
        } else if ($scope.dataTipsData.s_sourceType === "1201") {
            var kindObj = {
                "objStatus": "UPDATE",
                "pid": parseInt($scope.dataTipsData.f.id),
                "kind": $scope.dataTipsData.kind
            };
            var param = {
                "type": "RDLINK",
                "command": "UPDATE",
                "projectId": 11,
                "data": kindObj
            };
            if (stage === 1) {
                Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                    $scope.$parent.$parent.showLoading = false;  //showLoading
                    $scope.$parent.$parent.$apply();
                    if (data.errcode == 0) {
                        objCtrl.data.data["kind"] = $scope.dataTipsData.kind;
                        $scope.upBridgeStatus();
                        if (objCtrl.updateObject !== "") {
                            objCtrl.updateObject();
                        }
                        restrictLayer.redraw();
                        swal("操作成功", "种别转换操作成功！", "success");
                    } else {
                        swal("操作失败", data.errmsg, "error");
                    }

                })
            } else {
                swal("操作失败", '数据已经转换', "error");
            }
        }


    };
    $scope.upBridgeStatus = function (pid,e) {
        if ($scope.$parent.$parent.rowkeyOfDataTips !== undefined) {
            var stageParam = {
                "rowkey": $scope.$parent.$parent.rowkeyOfDataTips,
                "stage": 3,
                "handler": 0
            }
            if ($scope.dataTipsData.s_sourceType === "1901") {  //道路名
                if($scope.dataTipsData.t_trackInfo[$scope.dataTipsData.t_trackInfo.length-1].stage == 3){
                    $timeout(function(){
                        $.showPoiMsg('状态为 '+$scope.showContent+'，不允许改变状态！',e);
                        $scope.$apply();
                    });
                    return;
                }
            }
            Application.functions.changeDataTipsState(JSON.stringify(stageParam), function (data) {

                var info = [];
                if (data.errcode === 0) {
                    if(workPoint)
                        workPoint.redraw();
                    $scope.showContent = "外业新增";
                    $scope.dataTipsData.t_trackInfo[$scope.dataTipsData.t_trackInfo.length-1].stage = 3;
                    /*Application.functions.getRdObjectById(pid,"RDLINK", function (d) {
                        if (d.errcode === -1) {
                            return;
                        }
                        objCtrl.setCurrentObject(d);
                        if (objCtrl.updateObject !== "") {
                            objCtrl.updateObject();
                        }
                        $ocLazyLoad.load('ctrl/linkObjectCtrl').then(function () {
                            $scope.$parent.$parent.objectEditURL = "js/tepl/currentObjectTepl.html";
                        })
                    });*/
                } else {
                    info.push(data.errmsg + data.errid);

                    swal("操作失败",data.errmsg, "error");
                }
                outPutCtrl.pushOutput(info);
                if (outPutCtrl.updateOutPuts !== "") {
                    outPutCtrl.updateOutPuts();
                }
                $scope.$parent.$parent.rowkeyOfDataTips = undefined;
            })
        }
    }

    $scope.closeTips = function () {
        $("#popoverTips").css("display", "none");
    }
});
$("#tipsImgClose").click(function(){
    $("#dataTipsOriginModal").css('visibility','hidden');
    $("#dataTipsOriginImg").hide();
})