/**
 * Created by liwanchong on 2015/10/24.
 */
var objectEditApp = angular.module("mapApp", ['oc.lazyLoad']);
objectEditApp.controller("normalController", function ($scope, $timeout, $ocLazyLoad) {

    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    objectEditCtrl.setOriginalData($.extend(true, {}, objectEditCtrl.data));
    var layerCtrl = fastmap.uikit.LayerController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var eventController = fastmap.uikit.EventController();
    var rdRestriction = layerCtrl.getLayerById('restriction');
    var linksObj = {};//存放需要高亮的进入线和退出线的id
    var limitPicArr = [];
    //删除以前高亮的进入线和退出线
    if (highLightLayer.highLightLayersArr.length !== 0) {
        highLightLayer.removeHighLightLayers();
    }
    //初始化数据
    $scope.initializeData = function () {
        objectEditCtrl.setOriginalData(objectEditCtrl.data.getIntegrate());
        $scope.rdRestrictData = objectEditCtrl.data;
        $scope.flag = 0;
        //删除以前高亮的进入线和退出线
        if (highLightLayer.highLightLayersArr.length !== 0) {
            highLightLayer.removeHighLightLayers();
        }
        //高亮进入线和退出线
        linksObj["inLink"] = objectEditCtrl.data["inLinkPid"].toString();
        for (var i = 0, len = objectEditCtrl.data.details.length; i < len; i++) {
            linksObj["outLink" + i] = objectEditCtrl.data.details[i].outLinkPid.toString();
        }
        var highLightLinks = new fastmap.uikit.HighLightRender(rdLink, {
            map: map,
            highLightFeature: "links",
            linksObj: linksObj
        });
        var highLightRestriction = new fastmap.uikit.HighLightRender(rdRestriction, {
            map: map,
            highLightFeature: "restrict",
            restrictId: $scope.rdRestrictData.pid,
            initFlag: true
        });

        highLightLinks.drawOfLinksForInit();
        highLightLayer.pushHighLightLayers(highLightLinks);
        //highLightLayer.pushHighLightLayers(highLightRestriction);
        $.each(objectEditCtrl.data.details, function (i, v) {
            if (v)
                limitPicArr.push(v.timeDomain);
            else
                limitPicArr.push('');
        })
        //初始化交限中的第一个禁止方向的信息
        $scope.rdSubRestrictData = objectEditCtrl.data.details[0];
    };


    //objectController初始化 数据初始化
    if (objectEditCtrl.data === null) {
        $scope.rdSubRestrictData = [];
    } else {
        $scope.initializeData();
    }

    $scope.vehicleOptions = [
        {"id": 0, "label": "客车(小汽车)"},
        {"id": 1, "label": "配送卡车"},
        {"id": 2, "label": "运输卡车"},
        {"id": 3, "label": "步行车"},
        {"id": 4, "label": "自行车"},
        {"id": 5, "label": "摩托车"},
        {"id": 6, "label": "机动脚踏两用车"},
        {"id": 7, "label": "急救车"},
        {"id": 8, "label": "出租车"},
        {"id": 9, "label": "公交车"},
        {"id": 10, "label": "工程车"},
        {"id": 11, "label": "本地车辆"},
        {"id": 12, "label": "自用车辆"},
        {"id": 13, "label": "多人乘坐车辆"},
        {"id": 14, "label": "军车"},
        {"id": 15, "label": "有拖车的车"},
        {"id": 16, "label": "私营公共汽车"},
        {"id": 17, "label": "农用车"},
        {"id": 18, "label": "载有易爆品的车辆"},
        {"id": 19, "label": "载有水污染品的车辆"},
        {"id": 20, "label": "载有其他污染品的车辆"},
        {"id": 21, "label": "电车"},
        {"id": 22, "label": "轻轨"},
        {"id": 23, "label": "校车"},
        {"id": 24, "label": "四轮驱动车"},
        {"id": 25, "label": "装有防雪链的车"},
        {"id": 26, "label": "邮政车"},
        {"id": 27, "label": "槽罐车"},
        {"id": 28, "label": "残疾人车"},
        {"id": 29, "label": "预留"},
        {"id": 30, "label": "预留"},
        {"id": 31, "label": "标志位,禁止/允许(0/1)"}
    ];
    $scope.showAddDirectTepl = function () {
        if (!$scope.$parent.$parent.suspendFlag) {
            $scope.$parent.$parent.suspendFlag = true;
        }
        $ocLazyLoad.load('ctrl/restrictionCtrl/addDirectOfRestrictionCtrl').then(function () {
            $scope.$parent.$parent.suspendObjURL = "js/tepl/restrictTepl/addDitrectOfRestrictionTepl.html";
        })
    };

    var towbin = dec2bin(6);
    //var towbin=dec2bin("2147483655");

    //循环车辆值域，根据数据库数据取出新的数组显示在页面
    var originArray = [];
    $scope.checkValue = false;
    var len = towbin.length - 1;
    //长度小于32即是没有选中checkbox，不允许
    if (towbin.length < 32) {
        $scope.checkValue = false;
    } else {
        len = towbin.length - 2;
        $scope.checkValue = true;
    }
    for (var i = len; i >= 0; i--) {
        if (towbin.split("").reverse().join("")[i] == 1) {
            originArray.push($scope.vehicleOptions[i]);
        }
    }
    //初始化数据
    initOrig(originArray, $scope.vehicleOptions, "vehicleExpressiondiv");

    $scope.showPopover = function () {
        $('#vehicleExpressiondiv').popover('show');
    }
    //调用的方法
    objectEditCtrl.rdrestrictionObject = function () {
        if (objectEditCtrl.data === null) {
            $scope.rdSubRestrictData = [];
        } else {
            $scope.initializeData();
        }
    }

    $scope.removeTipsActive = function () {
        $.each($('.show-tips'), function (i, v) {
            $(v).removeClass('active');
        });
    }
    //点击限制方向时,显示其有的属性信息
    $scope.showTips = function (item, e,index) {
        limitPicArr[$(".show-tips.active").attr('data-index')] = $scope.codeOutput;
        $scope.flag = index;
        $timeout(function () {
            $(".data-empty").trigger('click');
            $scope.$apply();
        })
        $scope.removeTipsActive();
        $(e.target).addClass('active');
        $scope.rdSubRestrictData = item;
        //删除以前高亮的进入线和退出线
        if (highLightLayer.highLightLayersArr.length !== 0) {
            highLightLayer.removeHighLightLayers();
        }
        $scope.fmdateTimer(limitPicArr[$(e.target).attr('data-index')]);
        //高亮选择限制防线的进入线和退出线
        var linksOfRestric = {};
        linksOfRestric["inLink"] = linksObj["inLink"];
        linksOfRestric["outLink"] = item.outLinkPid.toString();
        var highLightLinks = new fastmap.uikit.HighLightRender(rdLink, {
            map: map,
            highLightFeature: "links",
            linksObj: linksOfRestric
        })
        highLightLinks.drawOfLinksForInit();
        highLightLayer.pushHighLightLayers(highLightLinks);
    };
    //修改退出线
    $scope.changeOutLink = function (item) {
        var currentTool = new fastmap.uikit.SelectPath({map: map, currentEditLayer: rdLink, linksFlag: false});
        currentTool.enable();
        eventController.on(eventController.eventTypes.GETOUTLINKSPID, function (data) {
            $scope.$apply(function () {
                $scope.rdSubRestrictData.outLinkPid = data.id;
            });
            var changedOutLink = {};
            changedOutLink["inLink"] = linksObj["inLink"];
            changedOutLink["outLink"] = data.id.toString();
            //删除以前高亮的进入线和退出线
            if (highLightLayer.highLightLayersArr.length !== 0) {
                highLightLayer.removeHighLightLayers();
            }
            var highLightLinks = new fastmap.uikit.HighLightRender(rdLink, {
                map: map,
                highLightFeature: "links",
                linksObj: changedOutLink
            })
            highLightLinks.drawOfLinksForInit();
            highLightLayer.pushHighLightLayers(highLightLinks);
        })
    };


    //右击
    $scope.deleteDirect = function (item, event) {
        if (event.button === 2) {
            var len = $scope.rdRestrictData.details.length;
            if (len === 1) {
                alert("请点击删除按钮删除该交限");
                return;
            } else {
                for (var i = 0; i < len; i++) {
                    if (len === 1) {
                        alert("请点击删除按钮删除该交限");
                        break;
                    } else {
                        if (item.pid === $scope.rdRestrictData.details[i]["pid"]) {
                            $scope.rdRestrictData.details.splice(i, 1);
                            len--;

                        }
                    }


                }
            }

        }

    };
    //修改交限方向的理论或实际
    $scope.changeType = function (item) {
        var restrictInfoArr = $scope.rdRestrictData.restricInfo.split(",");
        item.flag = parseInt(item.flag);
        if(item.flag===1) {
            if(restrictInfoArr[$scope.flag].indexOf("[")!==-1) {
                restrictInfoArr[$scope.flag] = restrictInfoArr[$scope.flag].split("")[1];
            }
        }else{
            restrictInfoArr[$scope.flag] = "[" + restrictInfoArr[$scope.flag] + "]";
        }
        $scope.rdRestrictData.restricInfo.length = 0;
        $scope.rdRestrictData.restricInfo = restrictInfoArr.join(",");
    };
    //增加时间段
    $scope.addTime = function () {
        $scope.rdRestrictData.time.unshift({startTime: "", endTime: ""});
    }
    //删除时间段
    $scope.minusTime = function (id) {
        $scope.rdRestrictData.time.splice(id, 1);
    };
    $timeout(function () {
        $ocLazyLoad.load('ctrl/fmdateTimer').then(function () {
            $scope.dateURL = 'js/tepl/fmdateTimer.html';
            /*查询数据库取出时间字符串*/
            var tmpStr = (!$scope.rdRestrictData.time) ? '' : $scope.rdRestrictData.time;
            // var tmpStr = '[[(h7m40)(h8m0)]+[(h11m30)(h12m0)]+[(h13m40)(h14m0)]+[(h17m40)(h18m0)]+[(h9m45)(h10m5)]+[(h11m45)(h12m5)]+[(h14m45)(h15m5)]+[[(M6d1)(M8d31)]*[(h0m0)(h5m0)]]+[[(M1d1)(M2d28)]*[(h0m0)(h6m0)]]+[[(M12d1)(M12d31)]*[(h0m0)(h6m0)]]+[[(M1d1)(M2d28)]*[(h23m0)(h23m59)]]+[[(M12d1)(M12d31)]*[(h23m0)(h23m59)]]]';
            $scope.fmdateTimer(tmpStr);
        });
    })
    /*时间控件*/
    $scope.fmdateTimer = function (str) {
        $scope.$on('get-date', function (event, data) {
            $scope.codeOutput = data;
        });
        $timeout(function () {
            $scope.$broadcast('set-code', str);
            $scope.codeOutput = str;
            $scope.$apply();
        }, 100);
    }
    //修改属性
    $scope.save = function () {
        var index = $(".show-tips.active").attr('data-index');
        //保存的时候，获取车辆类型数组，循环31次存储新的二进制数组，并转为十进制数
        var resultStr = "";
        if ($scope.checkValue) {
            resultStr = "1";
        } else {
            resultStr = "0";
        }
        var re31sult = ""
        for (var j = 0; j < 31; j++) {
            if (inArray(getEndArray(), j)) {
                re31sult += "1";
            } else {
                re31sult += "0";
            }
        }
        resultStr += re31sult.split("").reverse().join("");//倒序后的后31位加上第一位
        $scope.rdRestrictData.vehicleExpression = bin2dec(resultStr);
        $scope.rdRestrictData.details[index].timeDomain = $scope.codeOutput;
        objectEditCtrl.save();
        if (objectEditCtrl.changedProperty) {
            if(objectEditCtrl.changedProperty.details) {
                $.each(objectEditCtrl.changedProperty.details, function (i, v) {
                    delete v.linkPid;
                })
            }

        }
        var param = {
            "command": "UPDATE",
            "type": "RDRESTRICTION",
            "projectId": Application.projectid,
            "data": objectEditCtrl.changedProperty
        }
        if ($scope.$parent.$parent.suspendFlag) {
            $scope.$parent.$parent.suspendFlag = false;
        }
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var info = null;
            if (data.errcode == 0) {
                var sinfo = {
                    "op": "修改RDRESTICTIONR成功",
                    "type": "",
                    "pid": ""
                };
                data.data.log.push(sinfo);
                info = data.data.log;
                rdRestriction.redraw();
            } else {
                info = [{
                    "op": data.errcode,
                    "type": data.errmsg,
                    "pid": data.errid
                }];
            }
            outPutCtrl.pushOutput(info);
            if (outPutCtrl.updateOutPuts !== "") {
                outPutCtrl.updateOutPuts();
            }
        });
        if ($scope.$parent.$parent.rowkeyOfDataTips !== undefined) {
            var stageParam = {
                "rowkey": $scope.$parent.$parent.rowkeyOfDataTips,
                "stage": 3,
                "handler": 0

            }
            Application.functions.changeDataTipsState(JSON.stringify(stageParam), function (data) {

                var info = null;
                if (data.errcode == 0) {
                    var sinfo = {
                        "op": "修改RDRESTICTIONR状态成功",
                        "type": "",
                        "pid": ""
                    };
                    data.data.log.push(sinfo);
                    info = data.data.log;
                } else {
                    info = [{
                        "op": data.errcode,
                        "type": data.errmsg,
                        "pid": data.errid
                    }];
                }
                outPutCtrl.pushOutput(info);
                if (outPutCtrl.updateOutPuts !== "") {
                    outPutCtrl.updateOutPuts();
                }
                $scope.$parent.$parent.rowkeyOfDataTips = undefined;
            })
        }
    };
    //删除交限
    $scope.delete = function () {
        var pid = parseInt($scope.rdRestrictData.pid);
        var param =
        {
            "command": "DELETE",
            "type": "RDRESTRICTION",
            "projectId": Application.projectid,
            "objId": pid
        };
        //结束编辑状态
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var restrict = layerCtrl.getLayerById("restriction");
            restrict.redraw();
            var info = null;
            if (data.errcode == 0) {
                var sinfo = {
                    "op": "删除RDRESTICTIONR成功",
                    "type": "",
                    "pid": ""
                };
                data.data.log.push(sinfo);
                info = data.data.log;
            } else {
                info = [{
                    "op": data.errcode,
                    "type": data.errmsg,
                    "pid": data.errid
                }];
                swal("删除失败", data.errmsg, "error");
            }
            outPutCtrl.pushOutput(info);
            if (outPutCtrl.updateOutPuts !== "") {
                outPutCtrl.updateOutPuts();
            }
        })
        if ($scope.$parent.$parent.rowkeyOfDataTips !== undefined) {
            var stageParam = {
                "rowkey": $scope.$parent.$parent.rowkeyOfDataTips,
                "stage": 3,
                "handler": 0

            }
            Application.functions.changeDataTipsState(JSON.stringify(stageParam), function (data) {
                var workPoint = layerCtrl.getLayerById("workPoint");
                workPoint.redraw();
                var info = null;
                if (data.errcode == 0) {
                    var sinfo = {
                        "op": "修改交限状态成功",
                        "type": "",
                        "pid": ""
                    };
                    data.data.log.push(sinfo);
                    info = data.data.log;
                } else {
                    info = [{
                        "op": data.errcode,
                        "type": data.errmsg,
                        "pid": data.errid
                    }];
                }
                outPutCtrl.pushOutput(info);
                if (outPutCtrl.updateOutPuts !== "") {
                    outPutCtrl.updateOutPuts();
                }
                $scope.$parent.$parent.rowkeyOfDataTips = undefined;
                $scope.$parent.$parent.objectEditURL = "";
            })
        }
    }
    //取消操作
    $scope.cancel = function () {
        $timeout(function () {
            $(".data-empty").trigger('click');
            $scope.$apply();
        })
        Application.functions.getRdObjectById($scope.rdRestrictData.pid, "RDRESTRICTION", function (data) {
            $scope.rdRestrictData = data.data;
            $scope.rdSubRestrictData = $scope.rdRestrictData.details[0];
            if (highLightLayer.highLightLayersArr.length !== 0) {
                highLightLayer.removeHighLightLayers();
            }
            //高亮进入线和退出线
            linksObj["inLink"] = $scope.rdRestrictData["inLinkPid"].toString();
            for (var i = 0, len = ($scope.rdRestrictData.details).length; i < len; i++) {
                linksObj["outLink" + i] = $scope.rdRestrictData.details[i].outLinkPid.toString();
            }
            var highLightLinks = new fastmap.uikit.HighLightRender(rdLink, {
                map: map,
                highLightFeature: "links",
                linksObj: linksObj
            })
            highLightLinks.drawOfLinksForInit();
            highLightLayer.pushHighLightLayers(highLightLinks);

            //初始化交限中的第一个禁止方向的信息
            $scope.rdSubRestrictData = $scope.rdRestrictData.details[0];
            $scope.$apply();
        });

    };
    if(eventController.eventTypesMap[eventController.eventTypes.SAVEPROPERTY]) {
        for(var i= 0,len=eventController.eventTypesMap[eventController.eventTypes.SAVEPROPERTY].length;i<len;i++) {
            eventController.off(eventController.eventTypes.SAVEPROPERTY, eventController.eventTypesMap[eventController.eventTypes.SAVEPROPERTY][i]);
        }
    }
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);

});
