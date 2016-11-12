/**
 * Created by liwanchong on 2015/10/24.
 */
angular.module("app").controller("normalController", ['$scope', '$timeout', '$ocLazyLoad', 'dsFcc', 'dsEdit', function ($scope, $timeout, $ocLazyLoad, dsFcc, dsEdit) {
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    var layerCtrl = fastmap.uikit.LayerController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var eventController = fastmap.uikit.EventController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var rdRestriction = layerCtrl.getLayerById('relationData');
    var rdLink = layerCtrl.getLayerById('rdLink');
    var rdnode = layerCtrl.getLayerById('rdNode');
    var limitPicArr = [];
    $scope.currentVias = [];

    // 初始化数据
    $scope.initializeData = function () {
        objectEditCtrl.setOriginalData(objectEditCtrl.data.getIntegrate());
        //控制器初始化数据模型;
        $scope.flag = 0;
        $scope.rdRestrictCurrentData = objectEditCtrl.data;
        $scope.rdRestrictOriginalData = objectEditCtrl.originalData;
        $scope.rdRestrictionCurrentDetail = objectEditCtrl.data.details[0];
        //初始高亮整个关系关联要素;
        highLightRestrictAll();
        /*如果默认限制类型为时间段禁止，显示时间段控件*/
        if ($scope.rdRestrictionCurrentDetail.type == 2) {
            $scope.changeLimitType(2);
        }
        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.restricOrdinaryForm) {
            $scope.restricOrdinaryForm.$setPristine();
        }
    };


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



    //点击限制方向时,显示其有的属性信息
    $scope.showData = function (item, e, index) {
        highRenderCtrl.highLightFeatures.length = 0;
        limitPicArr[$(".show-tips.active").attr('data-index')] = $scope.codeOutput;
        $scope.flag = index;

        //清除所有高亮样式并高亮当前数据;
        removeTipsActive();
        $(e.target).addClass('active');

        $scope.rdRestrictionCurrentDetail = item;
        //$scope.currentOrigin = $scope.rdRestrictOriginalData.details[index];
        //$scope.currentVias = $scope.currentOrigin.vias;
        $scope.changeLimitType($scope.rdRestrictionCurrentDetail.type);
        //高亮点击选中的要素;
        highLightRestrictAll();
        //修改退出线;
        modifyOutLink();
    };

    //清除地图要素选择要素监听事件;
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
            if(dataresult.id == $scope.rdRestrictionCurrentDetail.inLinkPid){
                tooltipsCtrl.setCurrentTooltip("退出线和进入线不能为同一条线");return ;
            }
            if(dataresult.id == $scope.rdRestrictionCurrentDetail.outLinkPid){
                $scope.rdRestrictCurrentData.details.splice($scope.flag,1);
                var arr = $scope.rdRestrictCurrentData.restricInfo.split(',');
                arr.splice($scope.flag,1);
                $scope.rdRestrictCurrentData.restricInfo = arr.join(',');
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
                    $scope.rdRestrictionCurrentDetail.vias = [];
                    $scope.rdRestrictionCurrentDetail.outLinkPid = dataresult.id;
                    var temp = result.data[0],via = [];
                    for (i = 0; i < temp.links.length; i++) {
                        via.push(fastmap.dataApi.rdRestrictionVias({
                            rowId: "",
                            linkPid: temp.links[i],
                            seqNum: i + 1
                        }))
                        $scope.rdRestrictionCurrentDetail.vias = via;
                    }
                    $scope.currentVias = via;
                    highLightFeatures.push({
                        id: objectEditCtrl.data["inLinkPid"].toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {color: '#3A5FCD'}
                    });
                    for(var i=0;i<$scope.rdRestrictionCurrentDetail.vias.length;i++){
                        highLightFeatures.push({
                            id: $scope.rdRestrictionCurrentDetail.vias[i].linkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {color: 'blue'}
                        });
                    }
                    highLightFeatures.push({
                        id: $scope.rdRestrictionCurrentDetail.outLinkPid.toString(),
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
        var len = $scope.rdRestrictCurrentData.details.length;
        if (len === 1) {
            swal("无法操作", "请点击删除按钮删除该交限！", "info");
            return;
        } else {
            $scope.rdRestrictCurrentData.details.splice(index,1);
            //var restrictIndex = $scope.getRestrictInfoIndex(item);
            var arr = $scope.rdRestrictCurrentData.restricInfo.split(',');
            arr.splice(index,1);
            $scope.rdRestrictCurrentData.restricInfo = arr.join(',');
            $timeout(function () {
                $(".show-tips:first").trigger('click');
            })
        }
    };
    //修改交限方向的理论或实际
    $scope.changeType = function (item) {
        var restrictInfoArr = $scope.rdRestrictCurrentData.restricInfo.split(",");
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
        $scope.rdRestrictCurrentData.restricInfo.length = 0;
        $scope.rdRestrictCurrentData.restricInfo = restrictInfoArr.join(",");

    };

    /*--------------------------------------------------------------------------保存操作--------------------------------------------------------------------------*/
    $scope.save = function () {
        var details = $scope.rdRestrictCurrentData.details;
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
        dsEdit.getByPid($scope.rdRestrictCurrentData.pid, "RDRESTRICTION").then(function(data) {
            if (data) {
                objectEditCtrl.setCurrentObject("RDRESTRICTION", data);
                objectEditCtrl.setOriginalData(objectEditCtrl.data.getIntegrate());
            }
        });
    };

    /*--------------------------------------------------------------------------删除交限--------------------------------------------------------------------------*/

    $scope.delete = function () {
        var pid = parseInt($scope.rdRestrictCurrentData.pid);
        var param = {
            "command": "DELETE",
            "type": "RDRESTRICTION",
            "dbId": App.Temp.dbId,
            "objId": pid
        };
        //结束编辑状态
        dsEdit.save(param).then(function (data) {
            //var restrict = layerCtrl.getLayerById("relationData");
            rdRestriction.redraw();
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
    /*--------------------------------------------------------------------------删除交限--------------------------------------------------------------------------*/


    $scope.cancel = function () {};


    /*--------------------------------------------------------------------------时间控件--------------------------------------------------------------------------*/
    $scope.$on('get-date', function (event, date) {
        if($scope.rdRestrictionCurrentDetail.conditions.length < 1){
            $scope.rdRestrictionCurrentDetail.conditions[0] = fastmap.dataApi.rdRestrictionCondition({});
        }
        $scope.rdRestrictionCurrentDetail.conditions[0].timeDomain = date;
    });

    $scope.fmdateTimer = function (str) {
        $scope.$broadcast('set-code', str);
    };
    /*改变限制类型判断时间控件*/
    $scope.changeLimitType = function (type) {
        if (type == 2) {
            //$timeout(function () {
            $ocLazyLoad.load('scripts/components/tools/fmTimeComponent/fmdateTimer').then(function () {
                $scope.dateURL = '../../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
                $timeout(function (){
                    /*查询数据库取出时间字符串*/
                    if($scope.rdRestrictionCurrentDetail.conditions && $scope.rdRestrictionCurrentDetail.conditions[0] && $scope.rdRestrictionCurrentDetail.conditions[0].timeDomain){
                        $scope.fmdateTimer($scope.rdRestrictionCurrentDetail.conditions[0].timeDomain);
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

    /**
     *
     */
    function highLightRestrictAll(){
        highRenderCtrl.highLightFeatures = [];
        rdRestrictionHighLightArrayAdd($scope.rdRestrictCurrentData["inLinkPid"],'inLine');
        rdRestrictionHighLightArrayAdd($scope.rdRestrictCurrentData["nodePid"],'inNode');
        rdRestrictionHighLightArrayAdd($scope.rdRestrictionCurrentDetail.outLinkPid,'outLine');
        rdRestrictionHighLightArrayAdd($scope.rdRestrictCurrentData.pid,'icon');
        for(var i=0; i<$scope.rdRestrictionCurrentDetail.vias.length;i++){
            rdRestrictionHighLightArrayAdd($scope.rdRestrictionCurrentDetail.vias[i].linkPid,'linkLine');
        }
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.drawHighlight();
    }

    /**
     *
     * @param Pid
     * @param type 经过线 进入点 关系图标 退出线 经过线
     */
    function rdRestrictionHighLightArrayAdd(Pid,type){
        if(!isNaN(Pid)){Pid = Pid.toString()}
        if(type=='inLine'){
            highRenderCtrl.highLightFeatures.push({
                id: Pid,
                layerid: 'rdLink',
                type: 'line',
                style: {color: 'green'}
            });
        }else if(type=='inNode'){
            highRenderCtrl.highLightFeatures.push({
                id: Pid,
                layerid: 'rdLink',
                type: 'node',
                style: {color: 'yellow'}
            });
        }else if(type=='outLine'){
            highRenderCtrl.highLightFeatures.push({
                id: Pid,
                layerid: 'rdLink',
                type: 'line',
                style: {color: 'red'}
            });
        }else if(type=='linkLine'){
            highRenderCtrl.highLightFeatures.push({
                id: Pid,
                layerid: 'rdLink',
                type: 'line',
                style: {color: 'blue'}
            });
        }else if(type=='icon'){
            highRenderCtrl.highLightFeatures.push({
                id: Pid,
                layerid: 'relationData',
                type: 'relationData',
                style: {}
            });
        }else{
            alert('传参错误')
        }

    }

    function removeTipsActive() {
        $.each($('.show-tips'), function (i, v) {
            $(v).removeClass('active');
        });
    };


    /*--------------------------------------------------------------------------时间控件--------------------------------------------------------------------------*/

    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
    //objectController初始化 数据初始化
    if (objectEditCtrl.data === null) {
        $scope.rdRestrictionCurrentDetail = {};
    } else {
        $scope.initializeData();
    }
}]);
