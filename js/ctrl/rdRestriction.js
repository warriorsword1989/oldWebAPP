/**
 * Created by liwanchong on 2015/10/24.
 */
var objectEditApp = angular.module("mapApp", ['oc.lazyLoad']);
objectEditApp.controller("normalController", function ($scope,$timeout,$ocLazyLoad) {

    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    objectEditCtrl.setOriginalData($.extend(true, {}, objectEditCtrl.data));
    var layerCtrl = fastmap.uikit.LayerController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var linksObj = {};//存放需要高亮的进入线和退出线的id

    //删除以前高亮的进入线和退出线
    if(highLightLayer.highLightLayersArr.length!==0) {
        highLightLayer.removeHighLightLayers();
    }
    //初始化数据
    $scope.initializeData = function () {
        $scope.rdRestrictData = objectEditCtrl.data;
        //删除以前高亮的进入线和退出线
        if(highLightLayer.highLightLayersArr.length!==0) {
            highLightLayer.removeHighLightLayers();
        }
        //高亮进入线和退出线
        linksObj["inLink"] = objectEditCtrl.data["inLinkPid"].toString();
        for(var i= 0,len=(objectEditCtrl.data.details).length;i<len;i++) {
            linksObj["outLink" + i] = objectEditCtrl.data.details[i].outLinkPid.toString();
        }
        var highLightLinks=new fastmap.uikit.HighLightRender(rdLink,{map:map,highLightFeature:"links",linksObj:linksObj})
        highLightLinks.drawOfLinksForInit();
        highLightLayer.pushHighLightLayers(highLightLinks);

        //初始化交限中的第一个禁止方向的信息
        $scope.rdSubRestrictData = objectEditCtrl.data.details[0];
        $("#rdSubRestrictflagdiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#rdrelationshipTypediv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#rdtypediv :button").removeClass("btn btn-primary").addClass("btn btn-default");
       // $("#rdSubRestrictflagbtn"+$scope.rdSubRestrictData.flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $("#rdrelationshipTypebtn"+$scope.rdSubRestrictData.relationshipType).removeClass("btn btn-default").addClass("btn btn-primary");
        $("#rdtypebtn"+$scope.rdSubRestrictData.type).removeClass("btn btn-default").addClass("btn btn-primary");
    };


    //objectController初始化 数据初始化
    if (objectEditCtrl.data === null) {
        $scope.rdSubRestrictData = [];
    } else {
        $scope.initializeData();
    }
    //初始化交限
    $scope.addLimitedData = [
        {"id": 1},
        {"id": 2},
        {"id": 3},
        {"id": 4},
        {"id": 5},
        {"id": 6},
        {"id": 7},
        {"id": 11},
        {"id": 22},
        {"id": 33},
        {"id": 44},
        {"id": 55},
        {"id": 66},
        {"id": 77}

    ];
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


    //车辆类型为10进制数转为二进制数
    //var towbin=$scope.dec2bin($scope.rdSubRestrictData.vehicleExpression);
    var towbin=dec2bin(6);
    //var towbin=dec2bin("2147483655");

    //循环车辆值域，根据数据库数据取出新的数组显示在页面
    var originArray=[];
    $scope.checkValue=false;
    var len=towbin.length-1;
    //长度小于32即是没有选中checkbox，不允许
    if(towbin.length<32){
        $scope.checkValue=false;
    }else{
        len=towbin.length-2;
        $scope.checkValue=true;
    }
    for(var i=len;i>=0;i--){
        if(towbin.split("").reverse().join("")[i]==1){
            originArray.push($scope.vehicleOptions[i]);
        }
    }
    //初始化数据
    initOrig(originArray,$scope.vehicleOptions,"vehicleExpressiondiv");

    $scope.showPopover=function(){
        $('#vehicleExpressiondiv').popover('show');
    }
    //调用的方法
    objectEditCtrl.rdrestrictionObject=function(){
        if (objectEditCtrl.data === null) {
            $scope.rdSubRestrictData = [];
        } else {
            $scope.initializeData();
        }
    }

    //点击限制方向时,显示其有的属性信息
    $scope.showTips = function (item) {
        $scope.rdSubRestrictData = item;
        //删除以前高亮的进入线和退出线
        if(highLightLayer.highLightLayersArr.length!==0) {
            highLightLayer.removeHighLightLayers();
        }
        //高亮选择限制防线的进入线和退出线
        var linksOfRestric = {};
        linksOfRestric["inLink"] = linksObj["inLink"];
        linksOfRestric["outLink"] = item.outLinkPid.toString();
        var highLightLinks=new fastmap.uikit.HighLightRender(rdLink,{map:map,highLightFeature:"links",linksObj:linksOfRestric})
        highLightLinks.drawOfLinksForInit();
        highLightLayer.pushHighLightLayers(highLightLinks);

        $("#rdSubRestrictflagdiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#rdSubRestrictflagbtn"+$scope.rdSubRestrictData.flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $("#rdrelationshipTypediv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#rdrelationshipTypebtn"+$scope.rdSubRestrictData.relationshipType).removeClass("btn btn-default").addClass("btn btn-primary");
        $("#rdtypediv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#rdtypebtn"+$scope.rdSubRestrictData.type).removeClass("btn btn-default").addClass("btn btn-primary");
    };

    //修改退出线
    $scope.changeOutLink=function(item) {
        var currentTool= new fastmap.uikit.SelectPath({map: map, currentEditLayer: rdLink,linksFlag:false});
        currentTool.enable();
        rdLink.on("getOutLinksPid",function(data) {
            $scope.$apply(function () {
                $scope.rdSubRestrictData.outLinkPid = data.id;
            });
            var changedOutLink = {};
            changedOutLink["inLink"] = linksObj["inLink"];
            changedOutLink["outLink"] = data.id.toString();
            //删除以前高亮的进入线和退出线
            if(highLightLayer.highLightLayersArr.length!==0) {
                highLightLayer.removeHighLightLayers();
            }
            var highLightLinks=new fastmap.uikit.HighLightRender(rdLink,{map:map,highLightFeature:"links",linksObj:changedOutLink})
            highLightLinks.drawOfLinksForInit();
            highLightLayer.pushHighLightLayers(highLightLinks);
        })
    };
    //选择弹出框中的交限
    $scope.selectTip = function (item) {
        $scope.tipsId = item.id;
        var obj = {};
        obj.restricInfo = item.id;
        obj.outLinkPid = 0; //$scope.rdLink.outPid;
        obj.pid = 0;//featCodeCtrl.newObj.pid;
        obj.relationshipType = 1;
        obj.flag = 1;
        obj.restricPid = 0// featCodeCtrl.newObj.pid;
        obj.type = 1;
        obj.conditons = [];
        $scope.newLimited = obj;

    };
    //双击
    $scope.test = function (item) {
        $("#myModal").modal("show");
        $scope.modifyItem = item;
    };
    //添加交限
    $scope.addTips = function () {

        if ($scope.modifyItem !== undefined) {
            var arr = $scope.rdRestrictData.details
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i].pid === $scope.modifyItem.pid) {
                    $scope.rdRestrictData.details[i].restricInfo = $scope.tipsId;
                    $scope.modifyItem = undefined;
                    break;
                }
            }
        } else {
            if ($scope.tipsId === null || $scope.tipsId === undefined) {
                alert("请先选择tips");
                return;
            }
            $scope.rdRestrictData.details.unshift($scope.newLimited);
        }
    }
    //增加时间段
    $scope.addTime = function () {
        $scope.rdRestrictData.time.unshift({startTime: "", endTime: ""});
    }
    //删除时间段
    $scope.minusTime = function (id) {
        $scope.rdRestrictData.time.splice(id, 1);
    };
    $timeout(function(){
        $ocLazyLoad.load('ctrl/fmdateTimer').then(function () {
            $scope.dateURL = 'js/tepl/fmdateTimer.html';
            /*查询数据库取出时间字符串*/
            var tmpStr = '[[(h7m40)(h8m0)]+[(h11m30)(h12m0)]+[(h13m40)(h14m0)]+[(h17m40)(h18m0)]+[(h9m45)(h10m5)]+[(h11m45)(h12m5)]+[(h14m45)(h15m5)]+[[(M6d1)(M8d31)]*[(h0m0)(h5m0)]]+[[(M1d1)(M2d28)]*[(h0m0)(h6m0)]]+[[(M12d1)(M12d31)]*[(h0m0)(h6m0)]]+[[(M1d1)(M2d28)]*[(h23m0)(h23m59)]]+[[(M12d1)(M12d31)]*[(h23m0)(h23m59)]]]';
            $scope.fmdateTimer(tmpStr);
        });
    })
    /*时间控件*/
    $scope.fmdateTimer = function(str){
        $scope.$on('get-date', function(event,data) {
            $scope.codeOutput = data;
        });
        $timeout(function(){
            $scope.$broadcast('set-code',str);
            $scope.codeOutput = str;
            $scope.$apply();
        },100);
    }
    //修改属性
    $scope.$parent.$parent.save = function () {
        // $scope.$broadcast('set-code',$scope.codeOutput);
    alert($scope.codeOutput)
        //保存的时候，获取车辆类型数组，循环31次存储新的二进制数组，并转为十进制数
        var resultStr="";
        if($scope.checkValue){
            resultStr="1";
        }else{
            resultStr="0";
        }
        var re31sult=""
        for(var j=0;j<31;j++){
            if(inArray(getEdnArray(), j)){
                re31sult+="1";
            }else{
                re31sult+="0";
            }
        }
        resultStr+=re31sult.split("").reverse().join("");//倒序后的后31位加上第一位
        $scope.rdRestrictData.vehicleExpression=bin2dec(resultStr);


        objectEditCtrl.setCurrentObject($scope.rdRestrictData);
        objectEditCtrl.save();
        var param = {
            "command": "UPDATE",
            "type":"RESTRICTION",
            "projectId": 11,
            "data": objectEditCtrl.changedProperty
        }
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var restrict = layerCtrl.getLayerById("referencePoint");
            restrict.redraw();
            var outputcontroller = fastmap.uikit.OutPutController({});
            var info=[];
            if(data.data){
                $.each(data.data.log,function(i,item){
                    if(item.pid){
                        info.push(item.op+item.type+"(pid:"+item.pid+")");
                    }else{
                        info.push(item.op+item.type+"(rowId:"+item.rowId+")");
                    }
                });
            }else{
                info.push(data.errmsg+data.errid)
            }
            outputcontroller.pushOutput(data.data);
            if(outputcontroller.updateOutPuts!==info) {
                outputcontroller.updateOutPuts();
            }
        });
        if ( $scope.$parent.$parent.rowkeyOfDataTips!== undefined) {
            var stageParam = {
                "rowkey": $scope.$parent.$parent.rowkeyOfDataTips,
                "stage": 3,
                "handler": 0

            }
            Application.functions.changeDataTipsState(JSON.stringify(stageParam), function (data) {
                var outputcontroller = fastmap.uikit.OutPutController({});
                var info=[];
                if(data.data){
                    $.each(data.data.log,function(i,item){
                        if(item.pid){
                            info.push(item.op+item.type+"(pid:"+item.pid+")");
                        }else{
                            info.push(item.op+item.type+"(rowId:"+item.rowId+")");
                        }
                    });
                }else{
                    info.push(data.errmsg+data.errid)
                }
                outputcontroller.pushOutput(info);
                if(outputcontroller.updateOutPuts!=="") {
                    outputcontroller.updateOutPuts();
                }
                $scope.$parent.$parent.rowkeyOfDataTips = undefined;
            })
        }
    };
    //删除交限
    $scope.$parent.$parent.delete = function () {
        var pid = parseInt($scope.rdRestrictData.pid);
        var param = {
            "command": "UPDATE",
            "type":"RESTRICTION",
            "projectId": 11,
            "data": {
                "pid": pid,
                "objStatus": "DELETE"
            }
        };
        //结束编辑状态
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var outputcontroller = new fastmap.uikit.OutPutController({});
            var restrict = layerCtrl.getLayerById("referencePoint");
            restrict.redraw();
            var info=[];
            if(data.data){
                $.each(data.data.log,function(i,item){
                    if(item.pid){
                        info.push(item.op+item.type+"(pid:"+item.pid+")");
                    }else{
                        info.push(item.op+item.type+"(rowId:"+item.rowId+")");
                    }
                });
            }else{
                info.push(data.errmsg+data.errid)
            }
            outputcontroller.pushOutput(info);
            if(outputcontroller.updateOutPuts!=="") {
                outputcontroller.updateOutPuts();
            }
            console.log("交限 " + pid + " has been removed");
        })
        if ($scope.$parent.$parent.rowkeyOfDataTips !== undefined) {
            var stageParam = {
                "rowkey": $scope.$parent.$parent.rowkeyOfDataTips,
                "stage": 3,
                "handler": 0

            }
            Application.functions.changeDataTipsState(JSON.stringify(stageParam), function (data) {
                var outputcontroller = fastmap.uikit.OutPutController({});
                var workPoint = layerCtrl.getLayerById("workPoint");
                workPoint.redraw();
                var info=[];
                if(data.data){
                    $.each(data.data.log,function(i,item){
                        if(item.pid){
                            info.push(item.op+item.type+"(pid:"+item.pid+")");
                        }else{
                            info.push(item.op+item.type+"(rowId:"+item.rowId+")");
                        }
                    });
                }else{
                    info.push(data.errmsg+data.errid)
                }
                outputcontroller.pushOutput(info);
                if(outputcontroller.updateOutPuts!=="") {
                    outputcontroller.updateOutPuts();
                }
                $scope.$parent.$parent.rowkeyOfDataTips = undefined;
                $scope.$parent.$parent.objectEditURL = "";
            })
        }
    }

    $scope.checkrdSubRestrictflag=function(flag,item){
        $("#rdSubRestrictflagdiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#rdSubRestrictflagbtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        item.flag=flag;
    }
    $scope.checkrdrelationshipType=function(flag,item){
        $("#rdrelationshipTypediv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#rdrelationshipTypebtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        item.relationshipType=flag;
    }
    $scope.checkrdtype=function(flag,item){
        $("#rdtypediv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#rdtypebtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        item.type=flag;
    }
});
