/**
 * Created by liwanchong on 2015/10/22.
 */
var dataTipsApp = angular.module("lazymodule", []);
dataTipsApp.controller("sceneTipsController", function ($scope,$timeout) {
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
    $scope.photos = [];
    //清除地图上的高亮的feature
    if (highLightLayer.highLightLayersArr.length !== 0) {
        highLightLayer.removeHighLightLayers();
    }

    if (selectCtrl.rowKey) {
        //初始化dataTips面板中的数据
        $scope.dataTipsData = selectCtrl.rowKey;
        $scope.rdSubTipsData = selectCtrl.rowKey.o_array[0];


        //dataTips的初始化数据
        initializeDataTips();

    } else {
        $scope.rdSubTipsData = [];
    }

    //初始化DataTips相关数据
    function initializeDataTips() {

        //显示状态
        if ($scope.dataTipsData) {
            switch ($scope.dataTipsData.t_lifecycle) {
                case 1:
                    $scope.showContent = "外业删除";
                    break;
                case 2:
                    $scope.showContent = "外业修改";
                    break;
                case 3:
                    $scope.showContent = "外业新增";
                    break;
                case 0:
                    $scope.showContent = "默认值";
                    break;
            }
        }
        //获取数据中的图片数组
        $scope.photoTipsData = selectCtrl.rowKey.f_array;
        /*时段*/
        $scope.timeDomain = $scope.dataTipsData.o_array[0].time;

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
        //高亮
        var detailsOfHigh = $scope.dataTipsData.o_array, linksObj = {};
        linksObj["inLink"] = $scope.dataTipsData.in.id;
        for (var hiNum = 0, hiLen = detailsOfHigh.length; hiNum < hiLen; hiNum++) {
            var outLinksOfHigh = detailsOfHigh[hiNum].out;
            if (outLinksOfHigh !== undefined) {
                for (var outNum = 0, outLen = outLinksOfHigh.length; outNum < outLen; outNum++) {

                    linksObj["outLink" + outNum] = outLinksOfHigh[outNum].id;

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
        var highLightDataTips = new fastmap.uikit.HighLightRender(workPoint, {
            map: map,
            highLightFeature: "dataTips",
            dataTips: $scope.dataTipsData.rowkey
        });
        highLightDataTips.drawTipsForInit();
        highLightLayer.pushHighLightLayers(highLightDataTips);
    };
    //查看相关的退出线
    $scope.showOutLink = function (item) {
        $scope.rdSubTipsData = item;
        $scope.timeDomain = item.time;
    };
     //关闭dataTips面板
    $scope.closeDataTips = function () {
        $("#popoverTips").css("display", "none");
    };
    //根据dataTips新增交限
    $scope.increaseDataTips = function () {
        var info=null;
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
            var inLinkGeo = data.data.geometry.coordinates;
            var inNode, linksGeoLen = inLinkGeo.length - 1;
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
                "command": "createrestriction",
                "projectId": Application.projectid,
                "data": restrictObj
            };
            Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                if (data.errcode === -1) {
                    info=[{
                        "op":data.errcode,
                        "type":data.errmsg,
                        "pid": data.errid
                    }];
                    outPutCtrl.pushOutput(info);
                    if(outPutCtrl.updateOutPuts!=="") {
                        outPutCtrl.updateOutPuts();
                    }
                    return;
                }
                var pid = data.data.log[0].pid;
                checkCtrl.setCheckResult(data);
                restrictLayer.redraw();//交限图层刷新
                workPoint.redraw();//dataTip图层刷新
                //修改状态
                var stageParam = {
                    "rowkey": $scope.$parent.$parent.rowkeyOfDataTips,
                    "stage": 3,
                    "handler": 0

                }
                Application.functions.changeDataTipsState(JSON.stringify(stageParam), function (data) {
                    if (data.errcode==0) {
                        var sinfo={
                            "op":"修改交限成功",
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
                    outPutCtrl.pushOutput(info);
                    if(outPutCtrl.updateOutPuts!=="") {
                        outPutCtrl.updateOutPuts();
                    }
                });
                Application.functions.getRdObjectById(pid, "RDRESTRICTION", function (data) {
                    objCtrl.setCurrentObject(data.data);
                    $scope.type = "";
                    if (objCtrl.updateObject !== "") {
                        objCtrl.updateObject();
                    }
                    $ocLazyLoad.load('ctrl/objectEditCtrl').then(function () {
                        $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";
                        if ($scope.$parent.$parent.updateLinkData !== "") {
                            $scope.$parent.$parent.updateLinkData(data.data);
                        }

                    })
                })

            });
        });


    };
    //转换交限
    $scope.transDataTips = function () {
        var outLink = "", details = [], detailsOfTips = [];
        //$scope.$parent.$parent.rdRestrictData.inLinkPid = this.dataTipsData.in.id;
        var rdRestrictData = objCtrl.data;
        details = this.dataTipsData.o_array;
        for (var i = 0, len = details.length; i < len; i++) {
            var outLinks = details[i].out, outLinkObj = {};
            if (outLinks) {
                for (var j = 0, lenJ = outLinks.length; j < lenJ; j++) {
                    outLinkObj.conditions = [];
                    outLinkObj.outLinkPid = outLinks[j].id;
                    outLinkObj.flag = details[i].flag;
                    outLinkObj.relationshipType = 0;
                    outLinkObj.restricInfo = details[i].oInfo;
                    outLinkObj.type = outLinks[j].type;
                    if (details[i].vt === 1) {
                        var cArr = details[i].c_array;
                        for (var k = 0, lenk = cArr.length; k < lenk; k++) {
                            var cObj = {};
                            cObj.resAxleCount = cArr[k].aCt;
                            cObj.resAxleLoad = cArr[k].aLd;
                            cObj.resOut = cArr[k].rOt;
                            cObj.resTrailer = cArr[k].tra;
                            cObj.resWeigh = cArr[k].w;
                            cObj.timeDomain = cArr[k].time;
                            cObj.vehicle = 4;
                            outLinkObj.conditions.push(cObj);
                        }
                    }
                }
            } else {
                outLinkObj.conditions = [];
                outLinkObj.outLinkPid = "无退出线";
                outLinkObj.flag = details[i].flag;
                outLinkObj.relationshipType = 0;
                outLinkObj.restricInfo = details[i].oInfo;
                outLinkObj.type = outLinks[j].type;
                if (details[i].vt === 1) {
                    var cArr = details[i].c_array;
                    for (var k = 0, lenk = cArr.length; k < lenk; k++) {
                        var cObj = {};
                        cObj.resAxleCount = cArr[k].aCt;
                        cObj.resAxleLoad = cArr[k].aLd;
                        cObj.resOut = cArr[k].rOt;
                        cObj.resTrailer = cArr[k].tra;
                        cObj.resWeigh = cArr[k].w;
                        cObj.timeDomain = cArr[k].time;
                        cObj.vehicle = 4;
                        outLinkObj.conditions.push(cObj);
                    }
                }
            }

            detailsOfTips.push(outLinkObj);

        }
        rdRestrictData.details = detailsOfTips;
        rdRestrictData.stage = 3;
        objCtrl.setCurrentObject(rdRestrictData);
        if (objCtrl.updateObject !== "") {
            objCtrl.updateObject();
        }
    }

    $scope.openOrigin = function (id) {
        $scope.openshotoorigin = selectCtrl.rowKey.f_array[id];
        $("#dataTipsOriginImg").attr("src", Application.url + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + $scope.openshotoorigin.content + '",type:"origin"}');
        $("#dataTipsOriginModal").modal('show');
    }

//改状态
    $scope.upBridgeStatus = function (e) {
        if ($scope.$parent.$parent.rowkeyOfDataTips !== undefined) {
            var stageParam = {
                "rowkey": $scope.$parent.$parent.rowkeyOfDataTips,
                "stage": 3,
                "handler": 0
            }
            if($scope.dataTipsData.t_trackInfo[$scope.dataTipsData.t_trackInfo.length-1].stage == 3){
                $timeout(function(){
                    $.showPoiMsg('状态为 '+$scope.showContent+'，不允许改变状态！',e);
                    $scope.$apply();
                });
                return;
            }
            Application.functions.changeDataTipsState(JSON.stringify(stageParam), function (data) {

                var info = null;
                if (data.errcode === 0) {
                    if(workPoint)
                        workPoint.redraw();
                    $scope.showContent = "外业新增";
                    $scope.dataTipsData.t_trackInfo[$scope.dataTipsData.t_trackInfo.length-1].stage = 3;

                    var sinfo={
                        "op":"修改交限成功",
                        "type":"",
                        "pid": ""
                    };
                    data.data.log.push(sinfo);
                    info=data.data.log;
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
                $scope.$parent.$parent.rowkeyOfDataTips = undefined;
            })
        }
    }

});
