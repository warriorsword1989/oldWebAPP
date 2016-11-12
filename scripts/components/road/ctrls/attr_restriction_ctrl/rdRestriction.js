/**
 * Created by liwanchong on 2015/10/24.
 */
angular.module("app").controller("normalController", ['$scope', '$timeout', '$ocLazyLoad', 'dsFcc', 'dsEdit', function ($scope, $timeout, $ocLazyLoad, dsFcc, dsEdit) {
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    objectEditCtrl.setOriginalData($.extend(true, {}, objectEditCtrl.data));
    var selectCtrl = fastmap.uikit.SelectController();
    var layerCtrl = fastmap.uikit.LayerController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var rdLink = layerCtrl.getLayerById('rdLink');
    var rdnode = layerCtrl.getLayerById('rdNode');
    var eventController = fastmap.uikit.EventController();
    var rdRestriction = layerCtrl.getLayerById('relationData');
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var limitPicArr = [];
    $scope.currentVias = [];

    /*时间控件*/
    $scope.fmdateTimer = function (str) {
        //$timeout(function () {
            $scope.$broadcast('set-code', str);
        //}, 100);
    };
    $scope.$on('get-date', function (event, date) {
        if($scope.rdSubRestrictData.conditions.length < 1){
            $scope.rdSubRestrictData.conditions[0] = fastmap.dataApi.rdRestrictionCondition({});
        }
        $scope.rdSubRestrictData.conditions[0].timeDomain = date;
    });

    /*改变限制类型判断时间控件*/
    $scope.changeLimitType = function (type) {
        if (type == 2) {
            //$timeout(function () {
                $ocLazyLoad.load('scripts/components/tools/fmTimeComponent/fmdateTimer').then(function () {
                    $scope.dateURL = '../../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
                    $timeout(function (){
                        /*查询数据库取出时间字符串*/
                        if($scope.rdSubRestrictData.conditions && $scope.rdSubRestrictData.conditions[0] && $scope.rdSubRestrictData.conditions[0].timeDomain){
                            $scope.fmdateTimer($scope.rdSubRestrictData.conditions[0].timeDomain);
                        }else {
                            $scope.fmdateTimer("");
                        }
                    },100);
                });
            //});
        } else {
            $scope.fmdateTimer("");
        }
    };
    var sortRestricInfo = function (){
        var details = objectEditCtrl.data.details;
        var restricInfo = objectEditCtrl.data.restricInfo;
        var resArr = restricInfo.split(',');
        if(restricInfo.split(',').length != details.length){
            swal("警告",'此条交限数据不正确，请检查数据！','warning');
            return ;
        }
        var resArrSorted = [];
        for(var i = 0 ,len = resArr.length;i < len; i++){
            for(var j = 0 ; j < details.length ; j ++){
                if(resArr[i].indexOf('[') < 0){
                    if(details[j].flag == 1 && details[j].restricInfo == resArr[i]){
                        resArrSorted.push(details[j]);
                        break;
                    }
                } else {
                    var temp = '['+details[j].restricInfo+']';
                    if((details[j].flag == 0 || details[j].flag == 2) && temp == resArr[i]){
                        resArrSorted.push(details[j]);
                        break;
                    }
                }
            }
        }
        objectEditCtrl.data.details = resArrSorted;
    };
    //初始化数据
    $scope.initializeData = function () {
        //对交限图表进行排序,为了解决属性栏图表顺序和地图上的不一致
        objectEditCtrl.setOriginalData(objectEditCtrl.data.getIntegrate());
        $scope.rdRestrictData = objectEditCtrl.data;
        $scope.currentOrigin = objectEditCtrl.originalData.details[0];
        $scope.currentVias = $scope.currentOrigin.vias;
        $scope.flag = 0;
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures = [];
        var highLightFeatures = [];
        //高亮进入线;
        highLightFeatures.push({
            id: objectEditCtrl.data["inLinkPid"].toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {color: '#3A5FCD', strokeWidth:4}
        });
        //高亮退出线;
        highLightFeatures.push({
            id: objectEditCtrl.data.details[$scope.flag].outLinkPid.toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {color: '#CD0000'}
        });
        //高亮经过线;
        for(var j=0; j<objectEditCtrl.data.details[$scope.flag].vias.length;j++){
            highLightFeatures.push({
                id: objectEditCtrl.data.details[$scope.flag].vias[j].linkPid.toString(),
                layerid: 'rdLink',
                type: 'line',
                style: {color: 'blue'}
            });
        }
        //高亮图标；
        highLightFeatures.push({
            id: $scope.rdRestrictData.pid.toString(),
            layerid: 'relationData',
            type: 'relationData',
            style: {}
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
        //初始化交限中的第一个禁止方向的信息
        $scope.rdSubRestrictData = objectEditCtrl.data.details[0];
        /*如果默认限制类型为时间段禁止，显示时间段控件*/
        if ($scope.rdSubRestrictData.type == 2) {
            $scope.changeLimitType(2);
        }

        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.restricOrdinaryForm) {
            $scope.restricOrdinaryForm.$setPristine();
        }
    };

    //objectController初始化 数据初始化
    if (objectEditCtrl.data === null) {
        $scope.rdSubRestrictData = {};
    } else {
        $scope.initializeData();
    }


    $scope.showAddDirectTepl = function () {
        var addObj = { //这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            "loadType": "subAttrTplContainer",
            "propertyCtrl": 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            "propertyHtml": '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            "callback": function () {
                var showInfoObj = {
                    "loadType": "subAttrTplContainer",
                    "propertyCtrl": 'scripts/components/road/ctrls/attr_restriction_ctrl/addDirectCtrl',
                    "propertyHtml": '../../../scripts/components/road/tpls/attr_restrict_tpl/addDitrectTpl.html'
                };
                $scope.$emit("transitCtrlAndTpl", showInfoObj);
            }
        };
        $scope.$emit("transitCtrlAndTpl", addObj);
    };

    //调用的方法
    objectEditCtrl.rdrestrictionObject = function () {
        if (objectEditCtrl.data === null) {
            $scope.rdSubRestrictData = [];
        } else {
            $scope.initializeData();
        }
    };

    $scope.removeTipsActive = function () {
        $.each($('.show-tips'), function (i, v) {
            $(v).removeClass('active');
        });
    };

    //点击限制方向时,显示其有的属性信息
    $scope.showTips = function (item, e, index) {
        highRenderCtrl.highLightFeatures.length = 0;
        limitPicArr[$(".show-tips.active").attr('data-index')] = $scope.codeOutput;
        $scope.flag = index;
        $scope.removeTipsActive();
        $(e.target).addClass('active');
        $scope.rdSubRestrictData = item;
        $scope.currentOrigin = objectEditCtrl.originalData.details[index];
        $scope.currentVias = $scope.currentOrigin.vias;
        $scope.changeLimitType($scope.rdSubRestrictData.type);
        //高亮选择限制防线的进入线和退出线
        var highLightFeatures = [];
        highLightFeatures.push({
            id: objectEditCtrl.data["inLinkPid"].toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {color: '#3A5FCD'}
        });
        for(var i=0;i<$scope.currentOrigin.vias.length;i++){
            highLightFeatures.push({
                id: $scope.currentOrigin.vias[i].linkPid.toString(),
                layerid: 'rdLink',
                type: 'line',
                style: {color: 'blue'}
            });
        }
        highLightFeatures.push({
            id: $scope.currentOrigin.outLinkPid.toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {color: '#CD0000'}
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.drawHighlight();
        modifyOutLink();
    };

    var clearMapTool = function() {
        if (eventController.eventTypesMap[eventController.eventTypes.GETLINKID]) {
            for (var ii = 0, lenII = eventController.eventTypesMap[eventController.eventTypes.GETLINKID].length; ii < lenII; ii++) {
                eventController.off(eventController.eventTypes.GETLINKID, eventController.eventTypesMap[eventController.eventTypes.GETLINKID][ii]);
            }
        }
        if (map.currentTool) {
            map.currentTool.disable(); //禁止当前的参考线图层的事件捕获
        }
    };
    function modifyOutLink(){
        clearMapTool();
        //修改退出线;
        map.currentTool = new fastmap.uikit.SelectPath({
            map: map,
            currentEditLayer: rdLink,
            linksFlag: true,
            shapeEditor: shapeCtrl
        });
        //开启link和node的捕捉功能;
        map.currentTool.snapHandler.addGuideLayer(rdnode);
        map.currentTool.snapHandler.addGuideLayer(rdLink);
        map.currentTool.enable();
        eventController.off(eventController.eventTypes.GETLINKID);
        eventController.on(eventController.eventTypes.GETLINKID, function(dataresult) {
            //退出线的合法判断;
            if(dataresult.id == $scope.rdSubRestrictData.inLinkPid){
                tooltipsCtrl.setCurrentTooltip("退出线和进入线不能为同一条线");return ;
            }
            if(dataresult.id == $scope.currentOrigin.outLinkPid){
                $scope.rdRestrictData.details.splice($scope.flag,1)
                highRenderCtrl.highLightFeatures = [];
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.drawHighlight();
                return;
            }
            param = {};
            param["dbId"] = App.Temp.dbId;
            param["type"] = "RDLANEVIA";
            param["data"] = {
                "inLinkPid": objectEditCtrl.data["inLinkPid"].toString(),
                "nodePid": objectEditCtrl.data["nodePid"].toString(),
                "outLinkPid": dataresult.id,
                "type": "RDRESTRICTION" // 交限专用;
            };
            dsEdit.getByCondition(param).then(function(result) {
                if (result !== -1) {
                    var highLightFeatures = [];
                    $scope.rdSubRestrictData.vias = [];
                    $scope.rdSubRestrictData.outLinkPid = dataresult.id;
                    var temp = result.data[0],via = [];
                    for (i = 0; i < temp.links.length; i++) {
                        via.push(fastmap.dataApi.rdRestrictionVias({
                            rowId: "",
                            linkPid: temp.links[i],
                            seqNum: i + 1
                        }))
                        $scope.rdSubRestrictData.vias = via;
                    }
                    $scope.currentVias = via;
                    highLightFeatures.push({
                        id: objectEditCtrl.data["inLinkPid"].toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {color: '#3A5FCD'}
                    });
                    for(var i=0;i<$scope.rdSubRestrictData.vias.length;i++){
                        highLightFeatures.push({
                            id: $scope.rdSubRestrictData.vias[i].linkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {color: 'blue'}
                        });
                    }
                    highLightFeatures.push({
                        id: $scope.rdSubRestrictData.outLinkPid.toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {color: '#CD0000'}
                    });
                    highRenderCtrl.highLightFeatures = highLightFeatures;
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.drawHighlight();
                }
            })
        })
    }

    $scope.deleteDirect = function (item, event,index) {
        var len = $scope.rdRestrictData.details.length;
        if (len === 1) {
            swal("无法操作", "请点击删除按钮删除该交限！", "info");
            return;
        } else {
            $scope.rdRestrictData.details.splice(index,1);
            //var restrictIndex = $scope.getRestrictInfoIndex(item);
            var arr = $scope.rdRestrictData.restricInfo.split(',');
            arr.splice(index,1);
            $scope.rdRestrictData.restricInfo = arr.join(',');
            $timeout(function () {
                $(".show-tips:first").trigger('click');
            })
        }
    };
    //修改交限方向的理论或实际
    $scope.changeType = function (item) {
        var restrictInfoArr = $scope.rdRestrictData.restricInfo.split(",");
        item.flag = parseInt(item.flag);
        if (item.flag === 1) {
            if (restrictInfoArr[$scope.flag].indexOf("[") !== -1) {
                restrictInfoArr[$scope.flag] = restrictInfoArr[$scope.flag].split("")[1];
            }
        } else {
            if (restrictInfoArr[$scope.flag].indexOf("[") !== -1) {
                restrictInfoArr[$scope.flag] = restrictInfoArr[$scope.flag].split("")[1];
            }
            restrictInfoArr[$scope.flag] = "[" + restrictInfoArr[$scope.flag] + "]";
        }
        $scope.rdRestrictData.restricInfo.length = 0;
        $scope.rdRestrictData.restricInfo = restrictInfoArr.join(",");

    };
    //修改属性
    $scope.save = function () {
        var details = $scope.rdRestrictData.details;
        for(var i = 0 ; i < details.length ; i++){
            if(details[i].type != 2){
                if(details[i].conditions && details[i].conditions.length != 0){
                    details[i].conditions[0].timeDomain = '';
                }
            }
        }
        objectEditCtrl.save();
        var param = {
            "command": "UPDATE",
            "type": "RDRESTRICTION",
            "dbId": App.Temp.dbId,
            "data": objectEditCtrl.changedProperty
        };


        if (!objectEditCtrl.changedProperty) {
            swal("操作成功", '属性值没有变化！', "success");
            return;
        }

        dsEdit.save(param).then(function (data) {
            if (data) {
                rdRestriction.redraw();
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures = [];
                $scope.refreshData();
                map.currentTool.disable();
                $scope.$emit('SWITCHCONTAINERSTATE', {
                    'subAttrContainerTpl': false
                });
            }
        });

        if (selectCtrl.rowkey && selectCtrl.rowkey.rowkey) {
            var stageParam = {
                "rowkey": selectCtrl.rowkey.rowkey,
                "stage": 3,
                "handler": 0
            };
            dsFcc.changeDataTipsState(JSON.stringify(stageParam)).then(function (data) {
                selectCtrl.rowkey.rowkey = undefined;
            });
        }
    };
    //根据pid重新请求数据
    $scope.refreshData = function() {
        dsEdit.getByPid($scope.rdRestrictData.pid, "RDRESTRICTION").then(function(data) {
            if (data) {
                objectEditCtrl.setCurrentObject("RDRESTRICTION", data);
                objectEditCtrl.setOriginalData(objectEditCtrl.data.getIntegrate());
            }
        });
    };
    //删除交限
    $scope.delete = function () {
        var pid = parseInt($scope.rdRestrictData.pid);
        var param = {
            "command": "DELETE",
            "type": "RDRESTRICTION",
            "dbId": App.Temp.dbId,
            "objId": pid
        };
        //结束编辑状态
        dsEdit.save(param).then(function (data) {
            var restrict = layerCtrl.getLayerById("relationData");
            restrict.redraw();
            highRenderCtrl.highLightFeatures.length = 0;
            highRenderCtrl._cleanHighLight();
            map.currentTool.disable();
            $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false});
        });
        if (selectCtrl.rowkey) {
            var stageParam = {
                "rowkey": selectCtrl.rowkey.rowkey,
                "stage": 3,
                "handler": 0

            };
            dsFcc.changeDataTipsState(JSON.stringify(stageParam)).then(function (data) {
                var workPoint = layerCtrl.getLayerById("workPoint");
                workPoint.redraw();
                selectCtrl.rowkey.rowkey = undefined;
            })
        }
    };
    //取消操作
    $scope.cancel = function () {

    };
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);
